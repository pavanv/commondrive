from celery import Celery, shared_task
import os
import logging

os.environ['DJANGO_SETTINGS_MODULE'] = "settings"
topdir = os.path.dirname(os.path.abspath(__file__))
os.sys.path.insert(0, topdir)
#print 'topdir={0}'.format(topdir)

logger = logging.getLogger(__name__)

app = Celery('celery_tasks')


@shared_task
def index(indexer_obj):
    logger.debug('Indexing container={} user={} {}'.format(
        indexer_obj.container, indexer_obj.container.user.email,
        indexer_obj.container.__dict__, indexer_obj.__dict__
    ))
    pass
