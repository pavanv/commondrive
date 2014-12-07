from django.contrib import admin
import models


def foreign_field(field_name):
    def accessor(obj):
        val = obj
        for part in field_name.split('__'):
            val = getattr(val, part) if val else None
        return val
    accessor.__name__ = field_name
    return accessor

ff = foreign_field


class ContainerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'storage_type', ff('user__email'), 'status',
                    'dropbox_access_token', 'dropbox_user_id')
    search_fields = ['^name', '^user__email']


class ObjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', ff('parent__name'), ff('container__name'))
    search_fields = ['^name', '^container__name']


admin.site.register(models.Container, ContainerAdmin)
admin.site.register(models.Object, ObjectAdmin)
