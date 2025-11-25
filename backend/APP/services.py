from django.db.models import Sum
from django.utils import timezone
from .models import Group, Expense, ExpenseSplit
import google.generativeai as genai
import json
import os

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def parse_expense_with_ai(text_input, group_id, current_user_name):
    try:
        group = Group.objects.get(id=group_id)
        member_names = ", ".join([u.name for u in group.members.all()])
        model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"response_mime_type": "application/json"})
        prompt = f"""
        You are an expense parser. Context: [{member_names}]. User: {current_user_name}. Input: "{text_input}"
        Task: Identify Payer, Amount, Splits.
        Output JSON: {{ "description": "str", "amount": num, "payer_name": "str", "splits": [{{ "user_name": "str", "amount": num }}] }}
        """
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except:
        return None

def get_unified_fairness_analysis(group_id):
    try:
        group = Group.objects.get(id=group_id)
    except Group.DoesNotExist:
        return {"alerts": [], "balances": {}}

    members = group.members.all()
    member_count = members.count()
    alerts = []
    raw_balances = {}

    # 1. GET MONTHLY VOLUME (Financial Temperature)
    now = timezone.now()

    # Filter: ONLY expenses from the current month & year
    monthly_expenses = Expense.objects.filter(
        group=group,
        created_at__year=now.year,
        created_at__month=now.month
    )

    val = monthly_expenses.aggregate(Sum('amount'))['amount__sum'] or 0
    total_monthly_spend = float(val)

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

    # 3. CALCULATE BALANCES
    for user in members:
        # Paid THIS MONTH
        paid = monthly_expenses.filter(payer=user).aggregate(Sum('amount'))['amount__sum'] or 0

        # Consumed THIS MONTH
        consumed = ExpenseSplit.objects.filter(
            expense__group=group,
            user=user,
            expense__created_at__year=now.year,
            expense__created_at__month=now.month
        ).aggregate(Sum('owed_amount'))['owed_amount__sum'] or 0

        if member_count == 1:
            net_balance = paid
        else:
            net_balance = paid - consumed
            
        raw_balances[user] = net_balance

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
        category="General" 
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
                owed_amount=split['amount']
            )
    
    return expense