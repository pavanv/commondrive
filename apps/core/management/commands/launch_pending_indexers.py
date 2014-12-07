from django.core.management.base import BaseCommand
from apps.core import models
import celery_tasks


class Command(BaseCommand):
    def handle(self, *args, **options):
        for obj in models.Container.objects.filter(status=models.INDEXING_STATUS.pending):
            print('Launching indecer for container={} user={}'.format(obj, obj.user.email))
            celery_tasks.index.delay(obj)
