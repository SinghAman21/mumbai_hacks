from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)

    # These fields store the original Clerk data
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name  = models.CharField(max_length=100, null=True, blank=True)

    # still optional combined full name
    name = models.CharField(max_length=200, null=True, blank=True)

    clerk_user_id = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(null=True, blank=True)
    profile_image_url = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name or self.email or f"User {self.id}"



class Group(models.Model):
    TYPE_CHOICES = [
        ('SHORT', 'Short Term'),
        ('LONG', 'Long Term'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)  # Long or Short
    created_at = models.DateTimeField(auto_now_add=True)

    min_floor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=2000.00,  
        help_text="The minimum debt before AI starts complaining"
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups', null=True, blank=True)

    members = models.ManyToManyField(User, through='GroupMember', related_name='groups')

    def __str__(self):
        return self.name


class ArchivedGroup(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='archived_record')
    archived_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Archived: {self.group.name}"


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('group', 'user')

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.group.members.count() >= 32:
                raise ValidationError("Group cannot have more than 32 members.")
        super().save(*args, **kwargs)


class Expense(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('DISPUTED', 'Disputed'),
    ]

    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expenses')
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses_paid')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='APPROVED')
    dispute_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - {self.amount} ({self.status})"


class ExpenseSplit(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('DISPUTED', 'Disputed'),
    ]

    id = models.AutoField(primary_key=True)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='splits')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owed_splits')
    owed_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACCEPTED')

    def __str__(self):
        return f"{self.user} owes {self.owed_amount} ({self.status})"


class GroupLog(models.Model):
    ACTION_CHOICES = [
        ('JOIN', 'Member Joined'),
        ('LEAVE', 'Member Left'),
        ('RENAME', 'Group Renamed'),
    ]

    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    details = models.TextField(help_text="Details about the action (e.g., user name, old/new group name)")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.group.name}] {self.action} - {self.created_at}"
