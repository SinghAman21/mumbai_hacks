from ninja import NinjaAPI, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Group, Expense, User, GroupMember
from django.db.models import Sum, Count
from datetime import datetime

api = NinjaAPI()

class UserSchema(Schema):
    name: str
    id: int

class ExpenseSchema(Schema):
    id: int
    amount: float
    description: str
    category: str
    payer: UserSchema
    created_at: datetime

class GroupSchema(Schema):
    id: int
    name: str
    type: str
    owner_id: Optional[int] = None
    totalTransactions: int = 0
    approvedTransactions: int = 0
    pendingTransactions: int = 0
    netAmount: float = 0.0
    memberCount: int = 0
    lastActivity: Optional[str] = None

    @staticmethod
    def resolve_totalTransactions(obj):
        return obj.expenses.count()

    @staticmethod
    def resolve_approvedTransactions(obj):
        # Assuming all expenses are approved for now as there is no status field
        return obj.expenses.count()

    @staticmethod
    def resolve_pendingTransactions(obj):
        return 0

    @staticmethod
    def resolve_netAmount(obj):
        # This is a simplified calculation. 
        # In a real app, this would depend on the user's perspective.
        # For now, returning total expense amount.
        total = obj.expenses.aggregate(Sum('amount'))['amount__sum']
        return float(total or 0.0)

    @staticmethod
    def resolve_memberCount(obj):
        return obj.members.count()

    @staticmethod
    def resolve_lastActivity(obj):
        last_expense = obj.expenses.order_by('-created_at').first()
        if last_expense:
            # Return a human readable string or ISO format
            # For simplicity, returning ISO format, frontend can format it
            return last_expense.created_at.isoformat()
        return None

class GroupCreateSchema(Schema):
    name: str
    type: str

class GroupUpdateSchema(Schema):
    name: Optional[str] = None
    type: Optional[str] = None

@api.get("/groups", response=List[GroupSchema])
def list_groups(request):
    # Return groups where the authenticated user is a member
    user = request.user
    return user.groups.all()

@api.get("/groups/{group_id}", response=GroupSchema)
def get_group(request, group_id: int):
    # Ensure user has access to this group
    user = request.user
    return get_object_or_404(Group, id=group_id, members=user)

@api.post("/groups", response=GroupSchema)
def create_group(request, payload: GroupCreateSchema):
    user = request.user
    group = Group.objects.create(owner=user, **payload.dict())
    # Automatically add the creator as a member
    GroupMember.objects.create(group=group, user=user)
    return group

@api.put("/groups/{group_id}", response=GroupSchema)
def update_group(request, group_id: int, payload: GroupUpdateSchema):
    user = request.user
    group = get_object_or_404(Group, id=group_id, members=user)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(group, attr, value)
    group.save()
    return group

@api.delete("/groups/{group_id}")
def delete_group(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    group.delete()
    return {"success": True}

@api.get("/groups/{group_id}/expenses", response=List[ExpenseSchema])
def list_group_expenses(request, group_id: int):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    return Expense.objects.filter(group=group).order_by('-created_at')

class AIExpenseCreateSchema(Schema):
    text_input: str

from .services import parse_expense_with_ai, create_expense_from_parsed_data

@api.post("/groups/{group_id}/expenses/ai", response=ExpenseSchema)
def create_expense_ai(request, group_id: int, payload: AIExpenseCreateSchema):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    
    # Use authenticated user's name
    parsed = parse_expense_with_ai(payload.text_input, group_id, user.name)
    if not parsed:
         return api.create_response(request, {"error": "Failed to parse"}, status=400)
    
    try:
        expense = create_expense_from_parsed_data(group_id, parsed)
        return expense
    except Exception as e:
        return api.create_response(request, {"error": str(e)}, status=400)

from .services import get_unified_fairness_analysis

@api.get("/groups/{group_id}/analysis")
def get_group_analysis(request, group_id: int):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    
    analysis = get_unified_fairness_analysis(group_id)
    
    # Enrich with member details for frontend (tx count, etc)
    # This logic is here to avoid modifying the core fairness service function
    members = group.members.all()
    now = datetime.now()
    
    member_details = []
    balances = analysis.get("balances", {})
    
    for user in members:
        # Calculate transaction count for this user in this month
        # We need to replicate the filter logic from services roughly or just count all for now?
        # The service uses current month. Let's stick to that.
        tx_count = Expense.objects.filter(
            group=group,
            payer=user,
            created_at__year=now.year,
            created_at__month=now.month
        ).count()
        
        member_details.append({
            "name": user.name,
            "balance": balances.get(user.name, 0.0),
            "transaction_count": tx_count
        })
        
    analysis["member_details"] = member_details
    return analysis
