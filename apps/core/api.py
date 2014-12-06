from tastypie.resources import ModelResource
import models
# from tastypie.authorization import Authorization
# from tastypie.authentication import Authentication
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from django.core.exceptions import ValidationError
from django.conf.urls import url
from tastypie import fields
from tastypie.utils import trailing_slash
from django.contrib.auth import authenticate, login, logout
from tastypie.http import HttpUnauthorized, HttpBadRequest, HttpCreated
#from tastypie.exceptions import Unauthorized
from tastypie.constants import ALL_WITH_RELATIONS
#from django.http import HttpResponseRedirect
from allauth.account.forms import SignupForm
from allauth.account.utils import complete_signup
from allauth.account import app_settings
from django.conf import settings
from django.contrib.auth.models import User


##############################################################################
# BASE API RESOURCE
##############################################################################

class ApiResource(ModelResource):
    def determine_format(self, request):
        return 'application/json'


##############################################################################
# USERS
##############################################################################

class UserResource(ApiResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        fields = ['id', 'first_name', 'last_name', 'email']
        authentication = SessionAuthentication()
        authorization = Authorization()
        always_return_data = True
        allowed_methods = ['get', 'post', 'put']
        list_allowed_methods = []

    def prepend_urls(self):
        return [
            url(r'^(?P<resource_name>%s)/login%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name='api_login'),
            url(r'^(?P<resource_name>%s)/signup%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('signup'), name='api_signup'),
            url(r'^(?P<resource_name>%s)/logout%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('logout'), name='api_logout'),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(
            request, request.body,
            format=request.META.get('CONTENT_TYPE', 'application/json'))

        user = authenticate(**data)

        if not user:
            return self.create_response(request, {
                'success': False,
                'reason': 'incorrect',
            }, HttpUnauthorized)

        if not user.is_active:
            return self.create_response(request, {
                'success': False,
                'reason': 'disabled',
            }, HttpUnauthorized)

        login(request, user)
        return self.create_response(request, {
            'success': True,
            'id': user.id,
            'resource_uri': self.get_resource_uri(user),
        })

    def signup(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(
            request, request.body,
            format=request.META.get('CONTENT_TYPE', 'application/json'))

        try:
            form = SignupForm(data)
            if not form.is_valid():
                return self.create_response(request, {
                    'success': False,
                    'reason': 'form',
                    'error_type': 'dict',
                    'error': form.errors,
                }, HttpBadRequest)
            user = form.save(request)
            response = complete_signup(request, user,
                                       app_settings.EMAIL_VERIFICATION,
                                       success_url='/')
            if response.status_code not in [200, 201, 301, 302]:
                return self.create_response(request, {
                    'success': False,
                    'reason': 'status',
                    'error_type': 'str',
                    'error': 'Got bad status code {}'.format(response.status_code),
                })

            # Set session expiry
            request.session.set_expiry(settings.SESSION_COOKIE_AGE)

            return self.create_response(request, {
                'success': True,
                'id': user.id,
                'resource_uri': self.get_resource_uri(user),
            }, HttpCreated)
        except ValidationError as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'invalid',
                'error_type': 'list',
                'error': e.messages,
            }, HttpBadRequest)
        except Exception as e:
            return self.create_response(request, {
                'success': False,
                'reason': 'exception',
                'error_type': 'str',
                'error': '{}'.format(e),
            }, HttpBadRequest)

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['post', 'get'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, {'success': True})
        else:
            return self.create_response(request, {'success': False}, HttpUnauthorized)


class ContainerResource(ApiResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)

    class Meta:
        queryset = models.Container.objects.all()
        authentication = SessionAuthentication()
        authorization = Authorization()
        always_return_data = True

        filtering = {
            'user': ALL_WITH_RELATIONS,
        }


class ObjectResource(ApiResource):
    container = fields.ForeignKey(ContainerResource, 'container', full=True)

    class Meta:
        queryset = models.Object.objects.all()
        authentication = SessionAuthentication()
        authorization = Authorization()
        always_return_data = True

        filtering = {
            'container': ALL_WITH_RELATIONS,
        }


class IndexerResource(ApiResource):
    container = fields.ForeignKey(ContainerResource, 'container', full=True)

    class Meta:
        queryset = models.Indexer.objects.all()
        authentication = SessionAuthentication()
        authorization = Authorization()
        always_return_data = True

        filtering = {
            'container': ALL_WITH_RELATIONS,
        }
