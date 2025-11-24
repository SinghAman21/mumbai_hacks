from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import User, Group, GroupMember

class GroupMemberLimitTest(TestCase):
    def test_group_member_limit(self):
        group = Group.objects.create(name="Test Group", type="SHORT")
        
        # Add 32 members
        for i in range(32):
            user = User.objects.create(name=f"User {i}")
            GroupMember.objects.create(group=group, user=user)
            
        self.assertEqual(group.members.count(), 32)
        
        # Try to add the 33rd member
        user33 = User.objects.create(name="User 33")
        with self.assertRaises(ValidationError):
            GroupMember.objects.create(group=group, user=user33)
