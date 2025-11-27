from ninja import NinjaAPI, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Group, Expense, User, GroupMember, GroupLog, ExpenseSplit
from django.db.models import Sum, Count
from datetime import datetime
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from urllib.parse import unquote

signer = TimestampSigner()

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
    status: str
    user_approval_status: Optional[str] = None

class GroupLogSchema(Schema):
    id: int
    action: str
    details: str
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
        return obj.expenses.filter(status='APPROVED').count()

    @staticmethod
    def resolve_pendingTransactions(obj):
        return obj.expenses.filter(status='PENDING').count()

    @staticmethod
    def resolve_netAmount(obj):
        # This is a simplified calculation. 
        # In a real app, this would depend on the user's perspective.
        # For now, returning total expense amount.
        total = obj.expenses.filter(status='APPROVED').aggregate(Sum('amount'))['amount__sum']
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
        # Return group creation date as fallback
        return obj.created_at.isoformat()

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

@api.post("/groups/{group_id}/leave")
def leave_group(request, group_id: int):
    user = request.user
    group = get_object_or_404(Group, id=group_id, members=user)
    
    if group.owner == user:
        # If owner leaves, delete the group
        group.delete()
        return {"message": "Group deleted", "action": "deleted"}
    else:
        # Otherwise just remove the user
        GroupMember.objects.filter(group=group, user=user).delete()
        GroupLog.objects.create(
            group=group,
            action='LEAVE',
            details=f"{user.name} left the group"
        )
        return {"message": "Left group", "action": "left"}

@api.post("/groups/{group_id}/invite")
def generate_invite(request, group_id: int):
    print(f"DEBUG: generate_invite called for group {group_id} by user {request.user}")
    user = request.user
    # Verify user is a member
    get_object_or_404(Group, id=group_id, members=user)
    
    # Sign the Group ID
    signed_token = signer.sign(group_id)
    
    # Return the full URL for the frontend
    # Assuming frontend runs on localhost:3000 - ideally this should be from settings
    invite_url = f"http://localhost:3000/join/{signed_token}"
    
    return {"invite_url": invite_url}

class JoinGroupSchema(Schema):
    token: str

@api.post("/groups/join/", response=GroupSchema)
def join_group(request, payload: JoinGroupSchema):
    print(f"DEBUG: join_group called with token: {payload.token[:20]}...")
    user = request.user
    print(f"DEBUG: Authenticated user: {user}")
    token = payload.token
    
    try:
        # URL-decode the token first (it comes URL-encoded from the frontend)
        decoded_token = unquote(token)
        print(f"DEBUG: Decoded token: {decoded_token[:20]}...")
        
        # Unsign and Verify Timestamp (10 Minutes = 600 Seconds)
        group_id = signer.unsign(decoded_token, max_age=600)
        print(f"DEBUG: Unsigned group_id: {group_id}")
        
        group = get_object_or_404(Group, id=group_id)
        print(f"DEBUG: Found group: {group.name}")
        
        # Add User to Group if not already member
        if not group.members.filter(id=user.id).exists():
            print(f"DEBUG: Adding user {user.name} to group {group.name}")
            GroupMember.objects.create(group=group, user=user)
            # Log the join
            GroupLog.objects.create(
                group=group,
                action='JOIN',
                details=f"{user.name} joined via invite link"
            )
        else:
            print(f"DEBUG: User {user.name} already a member of {group.name}")
            
        return group
        
    except SignatureExpired:
        print("DEBUG: Token expired")
        return api.create_response(request, {'message': 'Link has expired'}, status=403)
    except BadSignature:
        print("DEBUG: Invalid token signature")
        return api.create_response(request, {'message': 'Invalid link'}, status=403)

from .models import Group, Expense, User, GroupMember, GroupLog, ExpenseSplit

class ExpenseSchema(Schema):
    id: int
    amount: float
    description: str
    category: str
    payer: UserSchema
    created_at: datetime
    status: str
    user_approval_status: Optional[str] = None

class ExpenseResponseSchema(Schema):
    action: str

@api.get("/groups/{group_id}/expenses", response=List[ExpenseSchema])
def list_group_expenses(request, group_id: int):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    expenses = Expense.objects.filter(group=group).order_by('-created_at')
    
    for expense in expenses:
        split = expense.splits.filter(user=user).first()
        expense.user_approval_status = split.status if split else "NOT_INVOLVED"
        
    return expenses

@api.post("/expenses/{expense_id}/respond")
def respond_to_expense(request, expense_id: int, payload: ExpenseResponseSchema):
    user = request.user
    expense = get_object_or_404(Expense, id=expense_id)
    
    # Check if user is involved in this expense
    try:
        split = ExpenseSplit.objects.get(expense=expense, user=user)
    except ExpenseSplit.DoesNotExist:
        return api.create_response(request, {"error": "User not involved in this expense"}, status=400)
    
    if payload.action == "ACCEPT":
        split.status = "ACCEPTED"
    elif payload.action == "REJECT":
        split.status = "REJECTED"
        expense.status = "REJECTED"
        expense.save()
    else:
        return api.create_response(request, {"error": "Invalid action"}, status=400)
    
    split.save()
    
    # Check if all splits are accepted
    # If any split is REJECTED, expense is REJECTED (already handled above)
    # If all splits are ACCEPTED, expense is APPROVED
    if expense.status != "REJECTED":
        # Check if there are any splits that are NOT ACCEPTED
        # Note: Payer is usually implicitly accepted, but we should check if we create a split for payer?
        # In create_expense_from_parsed_data, we create splits for everyone involved.
        # If payer is in splits, they need to accept too? Or we auto-accept for payer?
        # For now, let's assume everyone in splits must accept.
        if not expense.splits.exclude(status="ACCEPTED").exists():
            expense.status = "APPROVED"
            expense.save()
            
    return {"success": True, "status": split.status, "expense_status": expense.status}

@api.get("/groups/{group_id}/logs", response=List[GroupLogSchema])
def list_group_logs(request, group_id: int):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    return GroupLog.objects.filter(group=group).order_by('-created_at')

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
            "id": user.id,
            "name": user.name,
            "balance": balances.get(user.name, 0.0),
            "transaction_count": tx_count
        })
        
    analysis["member_details"] = member_details
    return analysis
