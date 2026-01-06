from ninja import NinjaAPI, Schema, File, UploadedFile, Form
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Group, Expense, User, GroupMember, GroupLog, ExpenseSplit
from django.db.models import Sum, Count
from datetime import datetime
from functools import wraps
from django.views.decorators.cache import cache_page
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from urllib.parse import unquote
import os

signer = TimestampSigner()

api = NinjaAPI()


def cache_page_per_user(timeout_seconds: int):
    """Cache a view response per authenticated user.

    NOTE: Using Django's plain @cache_page on auth-protected endpoints can leak data
    across users because the default cache key does not vary on Authorization.
    """

    def decorator(view_func):
        @wraps(view_func)
        def _wrapped(request, *args, **kwargs):
            user = getattr(request, "user", None)
            if not user or not getattr(user, "is_authenticated", False):
                return view_func(request, *args, **kwargs)

            # URL already contains group_id for analysis endpoints; prefix isolates users.
            key_prefix = f"user:{user.pk}"
            return cache_page(timeout_seconds, key_prefix=key_prefix)(view_func)(
                request, *args, **kwargs
            )

        return _wrapped

    return decorator

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
    dispute_reason: Optional[str] = None
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
    min_floor: float = 2000.00
    totalTransactions: int = 0
    approvedTransactions: int = 0
    pendingTransactions: int = 0
    netAmount: float = 0.0
    memberCount: int = 0
    lastActivity: Optional[str] = None
    is_owner: bool = False

    @staticmethod
    def resolve_is_owner(obj, context):
        request = context.get('request')
        if request and request.user:
            return obj.owner == request.user
        return False

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
    min_floor: Optional[float] = None

@api.get("/groups", response=List[GroupSchema])
@cache_page_per_user(60 * 5)
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

    # Build the invite URL for the *current* frontend.
    # Priority:
    # 1) Use FRONTEND_BASE_URL env var (recommended for deployed backend)
    # 2) Use request Origin if it is in CORS_ALLOWED_ORIGINS
    # 3) Fall back to localhost for local development
    
    # First, try FRONTEND_BASE_URL
    frontend_base_url = os.getenv("FRONTEND_BASE_URL")

    # If not set, try Origin header
    if not frontend_base_url:
        origin = request.headers.get("origin")
        allowed_origins_raw = os.getenv("CORS_ALLOWED_ORIGINS", "")
        allowed_origins = {o.strip() for o in allowed_origins_raw.split(",") if o.strip()}
        
        if origin and (not allowed_origins or origin in allowed_origins):
            frontend_base_url = origin

    # Final fallback to localhost
    if not frontend_base_url:
        frontend_base_url = "http://localhost:3000"

    invite_url = f"{frontend_base_url.rstrip('/')}/join/{signed_token}"

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
    dispute_reason: Optional[str] = None
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
    
    if payload.action == "REJECT":
        split.status = "REJECTED"
        expense.status = "REJECTED"
        expense.save()
    else:
        return api.create_response(request, {"error": "Invalid action"}, status=400)
    
    split.save()
            
    return {"success": True, "status": split.status, "expense_status": expense.status}

class DisputeSchema(Schema):
    reason: str

@api.post("/expenses/{expense_id}/dispute")
def dispute_expense(request, expense_id: int, payload: DisputeSchema):
    user = request.user
    expense = get_object_or_404(Expense, id=expense_id)
    
    # Check if user is involved
    try:
        split = ExpenseSplit.objects.get(expense=expense, user=user)
    except ExpenseSplit.DoesNotExist:
        return api.create_response(request, {"error": "User not involved in this expense"}, status=400)
        
    # Update split status
    split.status = "DISPUTED"
    split.save()
    
    # Update expense status and reason
    expense.status = "DISPUTED"
    expense.dispute_reason = payload.reason
    expense.save()
    
    return {"success": True, "status": "DISPUTED"}

@api.delete("/expenses/{expense_id}")
def delete_expense(request, expense_id: int):
    user = request.user
    expense = get_object_or_404(Expense, id=expense_id)
    
    # Check if user is the payer
    if expense.payer != user:
        return api.create_response(request, {"error": "Only the payer can delete this expense"}, status=403)
        
    expense.delete()
    return {"success": True}

@api.get("/groups/{group_id}/logs", response=List[GroupLogSchema])
def list_group_logs(request, group_id: int):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    return GroupLog.objects.filter(group=group).order_by('-created_at')

class AIExpenseCreateSchema(Schema):
    text_input: str

from .services import parse_expense_with_ai, create_expense_from_parsed_data, parse_receipt_with_ai

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

@api.post("/groups/{group_id}/expenses/ocr", response=ExpenseSchema)
def create_expense_ocr(request, group_id: int, file: UploadedFile = File(...), text_input: str = Form(None)):
    user = request.user
    # Verify user is a member of this group
    group = get_object_or_404(Group, id=group_id, members=user)
    
    # Parse receipt with AI
    parsed = parse_receipt_with_ai(file.file, group_id, user.name, text_context=text_input)
    
    if not parsed:
         return api.create_response(request, {"error": "Failed to parse receipt"}, status=400)
    
    try:
        expense = create_expense_from_parsed_data(group_id, parsed)
        return expense
    except Exception as e:
        return api.create_response(request, {"error": str(e)}, status=400)

from .services import get_unified_fairness_analysis

@api.get("/groups/{group_id}/analysis")
@cache_page_per_user(60 * 5)
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
