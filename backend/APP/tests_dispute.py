from django.test import TestCase
from .models import User, Group, Expense, ExpenseSplit, GroupMember
from .services import get_monthly_financials
from ninja.testing import TestClient
from .api import api

class DisputeSystemTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(name="User 1", clerk_user_id="user1")
        self.user2 = User.objects.create(name="User 2", clerk_user_id="user2")
        self.group = Group.objects.create(name="Test Group", type="SHORT", owner=self.user1)
        GroupMember.objects.create(group=self.group, user=self.user1)
        GroupMember.objects.create(group=self.group, user=self.user2)
        
        self.client = TestClient(api)

    def test_dispute_flow(self):
        # 1. Create Expense
        expense = Expense.objects.create(
            group=self.group,
            payer=self.user1,
            amount=100.00,
            description="Dinner",
            category="Food",
            status="APPROVED"
        )
        ExpenseSplit.objects.create(expense=expense, user=self.user1, owed_amount=50.00, status="ACCEPTED")
        split2 = ExpenseSplit.objects.create(expense=expense, user=self.user2, owed_amount=50.00, status="ACCEPTED")

        # 2. Verify Initial Financials (Should be calculated immediately)
        financials = get_monthly_financials(self.group.id)
        self.assertEqual(financials['total_spend'], 100.0)
        self.assertEqual(financials['balances'][self.user1], 50.0)
        self.assertEqual(financials['balances'][self.user2], -50.0)

        # 3. Dispute Expense via API
        # Mock request.user
        class MockRequest:
            user = self.user2
        
        response = self.client.post(
            f"/expenses/{expense.id}/dispute",
            json={"reason": "I didn't eat"},
            user=self.user2 
        )
        self.assertEqual(response.status_code, 200)
        
        expense.refresh_from_db()
        self.assertEqual(expense.status, "DISPUTED")
        self.assertEqual(expense.dispute_reason, "I didn't eat")

        # 4. Verify Financials (Should STILL count - Benefit of Doubt)
        financials = get_monthly_financials(self.group.id)
        self.assertEqual(financials['total_spend'], 100.0)
        self.assertEqual(financials['balances'][self.user1], 50.0)
        self.assertEqual(financials['balances'][self.user2], -50.0)

        # 5. Delete Expense
        expense.delete()

        # 6. Verify Financials (Should revert to 0)
        financials = get_monthly_financials(self.group.id)
        self.assertEqual(financials['total_spend'], 0)
        self.assertEqual(financials['balances'][self.user1], 0)
        self.assertEqual(financials['balances'][self.user2], 0)
