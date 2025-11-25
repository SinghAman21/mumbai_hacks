import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PROJ.settings')
django.setup()

from APP.models import Group, User, Expense, GroupMember
from django.utils import timezone
import random

def populate():
    if Group.objects.exists():
        print("Data already exists.")
        return

    # Create Users
    users = []
    for i in range(5):
        user, created = User.objects.get_or_create(name=f"User {i+1}")
        users.append(user)

    # Create Groups
    group_names = ["Weekend Trip", "House Expenses", "Office Lunch"]
    for name in group_names:
        group = Group.objects.create(name=name, type="SHORT")
        
        # Add members
        members = random.sample(users, k=3)
        for user in members:
            GroupMember.objects.create(group=group, user=user)
        
        # Add expenses
        for i in range(5):
            payer = random.choice(members)
            Expense.objects.create(
                group=group,
                payer=payer,
                amount=random.uniform(10.0, 100.0),
                description=f"Expense {i+1}",
                category="Food",
                created_at=timezone.now()
            )
    
    print("Test data created.")

if __name__ == "__main__":
    populate()
