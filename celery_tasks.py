from celery import Celery, shared_task
import os
import logging

os.environ['DJANGO_SETTINGS_MODULE'] = "settings"
topdir = os.path.dirname(os.path.abspath(__file__))
os.sys.path.insert(0, topdir)
#print 'topdir={0}'.format(topdir)

from apps.core import models

logger = logging.getLogger(__name__)

app = Celery('celery_tasks')


@shared_task
def index(obj):
    logger.debug('Indexing container={} user={}'.format(
        obj, obj.user.email, obj.__dict__
    ))
    functions = {
        models.STORAGE_TYPES.dropbox: obj.index_dropbox
    }
    return functions[obj.storage_type]()
