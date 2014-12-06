from django.db import models
from model_utils.models import TimeStampedModel
from model_utils import Choices
#from autoslug import AutoSlugField
import django.shortcuts
#from django.db.models.query import Q
#import re
import logging
#from django.core.validators import RegexValidator
#from django.db.models import F
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)


STORAGE_TYPES = Choices(
    ('dropbox', 'Dropbox'),
)

OBJECT_TYPES = Choices(
    ('file', 'File'),
    ('directory', 'Directory'),
)

INDEXING_STATUS = Choices(
    ('indexing', 'Indexing'),
    ('indexed', 'Indexed'),
    ('pending', 'Pending'),
)


def get_object_or_none(cls, *args, **kwargs):
    """
    Based on get_object_or_404()
    """
    queryset = django.shortcuts._get_queryset(cls)
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        return None


class Container(TimeStampedModel):
    user = models.ForeignKey(User)
    storage_type = models.CharField(
        max_length=30,
        choices=STORAGE_TYPES,
    )
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return u'{}'.format(self.name)


class Object(TimeStampedModel):
    container = models.ForeignKey(Container)
    parent = models.ForeignKey('Object')
    name = models.CharField(max_length=1100)
    type = models.CharField(
        max_length=30,
        choices=OBJECT_TYPES,
    )
    size = models.PositiveIntegerField()

    def __unicode__(self):
        return u'{}'.format(self.name)


class Indexer(TimeStampedModel):
    container = models.ForeignKey(Container)
    status = models.CharField(
        max_length=30,
        choices=INDEXING_STATUS,
    )

    def __unicode__(self):
        return u'{}-{}'.format(self.container, self.status)
