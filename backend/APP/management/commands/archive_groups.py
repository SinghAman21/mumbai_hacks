from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from APP.models import Group, ArchivedGroup

class Command(BaseCommand):
    help = 'Archives SHORT term groups older than 14 days'

    def handle(self, *args, **options):
        cutoff_date = timezone.now() - timedelta(days=14)
        
        # Find groups to archive
        groups_to_archive = Group.objects.filter(
            type='SHORT',
            created_at__lt=cutoff_date,
            archived_record__isnull=True
        )
        
        count = 0
        for group in groups_to_archive:
            ArchivedGroup.objects.create(group=group)
            count += 1
            
        self.stdout.write(self.style.SUCCESS(f'Successfully archived {count} groups'))
