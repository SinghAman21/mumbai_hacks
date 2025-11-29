from django.db.models import Sum
from django.utils import timezone
from .models import Group, Expense, ExpenseSplit
import google.generativeai as genai
import json
import os
import PIL.Image
import io

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def get_monthly_financials(group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return {"total_spend": 0, "balances": {}}

    members = group.members.all()
    member_count = members.count()
    raw_balances = {}

    now = timezone.now()
    monthly_expenses = Expense.objects.filter(
        group=group,
        created_at__year=now.year,
        created_at__month=now.month,
        status='APPROVED'
    )

    val = monthly_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    total_monthly_spend = float(val)

    for user in members:
        paid = monthly_expenses.filter(payer=user).aggregate(Sum('amount'))['amount__sum'] or 0
        consumed = ExpenseSplit.objects.filter(
            expense__group=group,
            user=user,
            expense__created_at__year=now.year,
            expense__created_at__month=now.month,
            expense__status='APPROVED'
        ).aggregate(Sum('owed_amount'))['owed_amount__sum'] or 0

        if member_count == 1:
            net_balance = paid
        else:
            net_balance = paid - consumed
            
        raw_balances[user] = net_balance

    return {
        "total_spend": total_monthly_spend,
        "balances": raw_balances,
        "group": group,
        "member_count": member_count
    }

def parse_expense_with_ai(text_input, group_id, current_user_name):
    try:
        group = Group.objects.get(id=group_id)
        member_names = ", ".join([u.name for u in group.members.all()])
        
        # Get current financial context
        financials = get_monthly_financials(group_id)
        balances = financials.get("balances", {})
        
        # Format balances for context
        balance_context = ", ".join([f"{u.name}: {amt:.2f}" for u, amt in balances.items()])
        
        model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"response_mime_type": "application/json"})
        prompt = f"""
        You are an expense parser.
        Context: 
        - Members: [{member_names}]
        - Current Balances (Positive = Owed to them, Negative = They owe): [{balance_context}]
        - Current User: {current_user_name}
        
        Input: "{text_input}"
        
        Task: Translate if not in English, Identify Payer, Amount, Splits, Categorize according to the list [Food, Transportation, Entertainment, Miscellaneous, Supplies, Bills.]
        
        Special Logic:
        - If the user says "I paid back all my debts" or similar:
            1. Identify the current user's balance.
            2. If their balance is negative (e.g., -500), the 'amount' is the absolute value (500).
            3. Create 'splits' for users with POSITIVE balances. 
            4. Distribute the payment to those positive balance users proportionally or fully if it matches.
            5. If their balance is positive or zero, return amount 0.
        
        Output JSON: {{ "description": "str", "amount": num, "payer_name": "str", "splits": [{{ "user_name": "str", "amount": num }}], category: choose one from [Food, Transportation, Entertainment, Miscellaneous, Supplies, Bills.] }}
        """
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except:
        return None

def parse_receipt_with_ai(image_file, group_id, current_user_name, text_context=None):
    try:
        group = Group.objects.get(id=group_id)
        member_names = ", ".join([u.name for u in group.members.all()])
        
        # Get current financial context
        financials = get_monthly_financials(group_id)
        balances = financials.get("balances", {})
        
        # Format balances for context
        balance_context = ", ".join([f"{u.name}: {amt:.2f}" for u, amt in balances.items()])
        
        model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"response_mime_type": "application/json"})
        
        prompt_text = f"""
        You are a receipt parser. 
        Context: 
        - Members: [{member_names}]
        - Current Balances: [{balance_context}]
        - Current User: {current_user_name}
        - Additional Context: {text_context if text_context else "None"}
        
        Task: Analyze the receipt image and the additional context to identify Payer, Amount, Description, and Splits Categorize according to the list [Food, Transportation, Entertainment, Miscellaneous, Supplies, Bills.].
        
        Rules:
        1. If specific items are visible, try to categorize them.
        2. If the user provides context like "Dinner for me and Bob", use that to determine splits.
        3. If no specific split info is found, default to equal splits among all members.
        4. Payer is likely the Current User unless the receipt or context suggests otherwise.
        
        Output JSON: {{ "description": "str", "amount": num, "payer_name": "str", "splits": [{{ "user_name": "str", "amount": num }}], category: "str" }}
        """
        
        image = PIL.Image.open(image_file)
        
        response = model.generate_content([prompt_text, image])
        return json.loads(response.text)
    except Exception as e:
        print(f"Error parsing receipt: {e}")
        return None

def get_unified_fairness_analysis(group_id):
    financials = get_monthly_financials(group_id)
    if not financials.get("group"):
        return {"alerts": [], "balances": {}}
        
    group = financials["group"]
    total_monthly_spend = financials["total_spend"]
    raw_balances = financials["balances"]
    member_count = financials["member_count"]
    
    alerts = []
    
    # 1. GET MONTHLY VOLUME (Financial Temperature)
    now = timezone.now()

    if member_count > 0:
        fair_share = total_monthly_spend / member_count
    else:
        fair_share = 0

    # 2. SET DYNAMIC LIMITS
    MIN_FLOOR = float(group.min_floor)

    # Soft Limit: Max of Floor OR 50% of monthly share
    soft_limit = max(MIN_FLOOR, fair_share * 0.5)

    # Hard Limit: Max of (2x Floor) OR (100% of monthly share)
    hard_limit = max(MIN_FLOOR * 2, fair_share * 1.0)

    # 4. GENERATE ALERTS
    sorted_users = sorted(raw_balances.items(), key=lambda x: x[1])

    for user, amount in sorted_users:
        if amount < 0:
            debt = abs(amount)
            if debt < soft_limit:
                continue
            elif soft_limit <= debt < hard_limit:
                alerts.append({
                    "level": "WARNING",
                    "message": f"🟡 **{user.name}** is lagging (₹{debt:.0f}) this month."
                })
            else:
                alerts.append({
                    "level": "CRITICAL",
                    "message": f"🔴 **{user.name}** hit the monthly limit (₹{debt:.0f}). Settle Up."
                })

    return {
        "alerts": alerts,
        "balances": {u.name: float(amt) for u, amt in raw_balances.items()},
        "stats": {
            "month": now.strftime("%B"),
            "total_spend": float(total_monthly_spend),
            "floor_setting": MIN_FLOOR,
            "dynamic_hard_limit": float(hard_limit)
        }
    }

def create_expense_from_parsed_data(group_id, parsed_data):
    group = Group.objects.get(id=group_id)
    members = group.members.all()
    
    def find_user(name):
        for m in members:
            if m.name.lower() == name.lower():
                return m
        for m in members:
            if name.lower() in m.name.lower():
                return m
        return None

    payer = find_user(parsed_data['payer_name'])
    if not payer:
        raise ValueError(f"Payer '{parsed_data['payer_name']}' not found in group")

    expense = Expense.objects.create(
        group=group,
        payer=payer,
        amount=parsed_data['amount'],
        description=parsed_data['description'],
        category=parsed_data['category'],
        status='APPROVED'
    )

    splits_data = parsed_data.get('splits', [])
    
    if not splits_data:
        # Default to equal splits if no splits provided
        count = members.count()
        if count > 0:
            amount_per_person = parsed_data['amount'] / count
            for member in members:
                splits_data.append({
                    'user_name': member.name,
                    'amount': amount_per_person
                })

    for split in splits_data:
        user = find_user(split['user_name'])
        if user:
            ExpenseSplit.objects.create(
                expense=expense,
                user=user,
                owed_amount=split['amount'],
                status='ACCEPTED'
            )
    
    return expense