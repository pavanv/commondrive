from django.core.management.base import BaseCommand
from apps.core import models
import celery_tasks


class Command(BaseCommand):
    def handle(self, *args, **options):
        for obj in models.Indexer.objects.filter(status=models.INDEXING_STATUS.pending):
            print('Launching indexer for container={} user={}'.format(obj.container, obj.container.user.email))
            celery_tasks.index.delay(obj)