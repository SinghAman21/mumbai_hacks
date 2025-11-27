from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from django.db import IntegrityError
from .models import Group, GroupMember, GroupLog

@receiver(pre_save, sender=Group)
def log_group_rename(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_group = Group.objects.get(pk=instance.pk)
            if old_group.name != instance.name:
                GroupLog.objects.create(
                    group=instance,
                    action='RENAME',
                    details=f"Group renamed from '{old_group.name}' to '{instance.name}'"
                )
        except Group.DoesNotExist:
            pass

@receiver(post_save, sender=GroupMember)
def log_member_join(sender, instance, created, **kwargs):
    if created:
        GroupLog.objects.create(
            group=instance.group,
            action='JOIN',
            details=f"{instance.user.name} joined the group"
        )

