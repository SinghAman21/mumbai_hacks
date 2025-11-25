from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class User(models.Model):
    # Diagram: ID (PK/auto-increment)
    id = models.AutoField(primary_key=True)
    # Diagram: Name
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Group(models.Model):
    # Diagram: Choices for 'Type'
    TYPE_CHOICES = [
        ('SHORT', 'Short Term'),
        ('LONG', 'Long Term'),
    ]

    # Diagram: ID (PK)
    id = models.AutoField(primary_key=True)
    # Diagram: Name
    name = models.CharField(max_length=100)
    # Diagram: Type (short/long term)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES) #Long or Short
    
    # Created at timestamp for archiving logic
    created_at = models.DateTimeField(auto_now_add=True)

    min_floor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=2000.00,  # Default to your new preference
        help_text="The minimum debt before AI starts complaining"
    )

    # Diagram: "has members" / "Group_Members" table
    # This creates the link between Users and Groups
    members = models.ManyToManyField(User, through='GroupMember', related_name='groups')

    def __str__(self):
        return self.name


class ArchivedGroup(models.Model):
    """
    Stores references to groups that have been archived.
    """
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='archived_record')
    archived_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Archived: {self.group.name}"


class GroupMember(models.Model):
    """
    This model explicitly represents the 'Group_Members' box in your diagram.
    It links a User and a Group.
    """
    # Diagram: group_id (FK, PK part)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    # Diagram: user_id (FK, PK part)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        # Ensures a user can't be in the same group twice (Composite PK logic)
        unique_together = ('group', 'user')

    def save(self, *args, **kwargs):
        if not self.pk:  # Only check on creation
            if self.group.members.count() >= 32:
                raise ValidationError("Group cannot have more than 32 members.")
        super().save(*args, **kwargs)


class Expense(models.Model):
    # Diagram: ID (PK)
    id = models.AutoField(primary_key=True)

    # Diagram: group_id (FK)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expenses')

    # Diagram: payer_id (FK) -> Relationship "Pays"
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses_paid')

    # Diagram: amount
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Diagram: description
    description = models.CharField(max_length=255)

    # Diagram: category
    category = models.CharField(max_length=50)

    # Created at timestamp for dashboard activity
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - {self.amount}"


class ExpenseSplit(models.Model):
    """
    This represents the 'Expense_Splits' box.
    """
    # Diagram: ID (PK)
    id = models.AutoField(primary_key=True)

    # Diagram: expense_id (FK)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='splits')

    # Diagram: user_id (FK) -> Relationship "Owes"
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owed_splits')

    # NOTE: Your diagram didn't explicitly write "amount" in the split bubble,
    # but logically you need to know HOW much this person owes.
    # I added this field so your backend logic works.
    owed_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.name} owes {self.owed_amount}"