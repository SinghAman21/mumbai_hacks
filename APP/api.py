from ninja import NinjaAPI, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from .models import Group, Expense, User, GroupMember
from django.db.models import Sum, Count
from datetime import datetime

api = NinjaAPI()

class GroupSchema(Schema):
    id: int
    name: str
    type: str
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
    return Group.objects.all()

@api.get("/groups/{group_id}", response=GroupSchema)
def get_group(request, group_id: int):
    return get_object_or_404(Group, id=group_id)

@api.post("/groups", response=GroupSchema)
def create_group(request, payload: GroupCreateSchema):
    group = Group.objects.create(**payload.dict())
    return group

@api.put("/groups/{group_id}", response=GroupSchema)
def update_group(request, group_id: int, payload: GroupUpdateSchema):
    group = get_object_or_404(Group, id=group_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(group, attr, value)
    group.save()
    return group
