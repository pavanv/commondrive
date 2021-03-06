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
import settings
import dropbox
import os

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
    dropbox_access_token = models.CharField(max_length=500, blank=True)
    dropbox_user_id = models.CharField(max_length=30, blank=True)
    status = models.CharField(
        max_length=30,
        choices=INDEXING_STATUS,
    )

    @property
    def root(self):
        return get_object_or_none(
            Object,
            container=self,
            parent=None
        )

    def index_dropbox(self):
        self.status = INDEXING_STATUS.indexing
        self.save()

        client = dropbox.client.DropboxClient(self.dropbox_access_token)
        logger.debug('linked account: {}'.format(client.account_info()))
        directories = [('/', None)]
        while directories:
            dirname, parent = directories.pop(0)
            metadata = client.metadata(dirname)
            dirobj = Object.objects.create(
                container=self,
                parent=parent,
                name=os.path.split(dirname)[-1],
                type=OBJECT_TYPES.directory,
                bytes=metadata.get('bytes', 0),
                hash=metadata['hash']
            )
            for obj in metadata['contents']:
                logger.debug('obj: {} size={} is_dir={}'.format(obj['path'].encode('utf-8'), obj['bytes'], obj['is_dir']))
                if obj['is_dir']:
                    directories.append((obj['path'], dirobj))
                else:
                    dirobj = Object.objects.create(
                        container=self,
                        parent=dirobj,
                        name=os.path.split(obj['path'])[-1],
                        type=OBJECT_TYPES.file,
                        bytes=obj.get('bytes', 0),
                        hash=obj.get('hash', '')
                    )
        self.status = self.INDEXING_STATUS.indexed
        self.save()

    def __unicode__(self):
        return u'{}'.format(self.name)


class Object(TimeStampedModel):
    container = models.ForeignKey(Container)
    parent = models.ForeignKey('Object', null=True)
    name = models.CharField(max_length=1100)
    type = models.CharField(
        max_length=30,
        choices=OBJECT_TYPES,
    )
    bytes = models.PositiveIntegerField()
    hash = models.CharField(max_length=100)

    @property
    def fullpath(self):
        parentpath = self.parent.fullpath if self.parent else '/'
        return os.path.join(parentpath, self.name.encode('utf-8'))

    @property
    def children(self):
        objs = Object.objects.filter(parent=self).values('id', 'name', 'type', 'bytes')
        return objs

    def __unicode__(self):
        return u'{}'.format(self.name.encode('utf-8'))


#############################################################################
# Create our own test user automatically.
#############################################################################
import sys


# Adapted from http://stackoverflow.com/questions/1466827/
def create_testuser(app, created_models, verbosity, **kwargs):
    if not settings.DEBUG:
        return

    email = (settings.DEFAULT_CONTACT_EMAIL[0]
             if hasattr(settings, 'DEFAULT_CONTACT_EMAIL')
             else 'test@test.com')
    username = 'test'
    try:
        User.objects.get(username=username)
    except User.DoesNotExist:
        try:
            print '*' * 80
            print 'Creating test user -- username: {}, email: {}, password: test'.format(username, email)
            print '*' * 80
            user = User.objects.create_superuser(
                username, email, 'test')
            assert(user)
        except AttributeError as e:
            print 'Got exception {}'.format(e)
    else:
        print 'Test user already exists.'

models.signals.post_syncdb.connect(
    create_testuser, sender=sys.modules[__name__],
    dispatch_uid='common.models.create_testuser')


from django.contrib.sites.models import Site
from django.contrib.sites import models as site_app
from django.contrib.sites.management import create_default_site as orig_default_site

models.signals.post_syncdb.disconnect(orig_default_site, sender=site_app)


# Configure default Site creation with better defaults, and provide
# overrides for those defaults via settings and kwargs:
def create_default_site(app, created_models, verbosity, db, **kwargs):
    name = kwargs.pop('name', None)
    domain = kwargs.pop('domain', None)

    if not name:
        name = getattr(settings, 'DEFAULT_SITE_NAME', 'example.com')
    if not domain:
        domain = getattr(settings, 'DEFAULT_SITE_DOMAIN', 'localhost:8000')

    if Site in created_models:
        if verbosity >= 2:
            print "Creating example.com Site object"
        s = Site(domain=domain, name=name)
        s.save(using=db)
    Site.objects.clear_cache()

models.signals.post_syncdb.connect(create_default_site, sender=site_app)
