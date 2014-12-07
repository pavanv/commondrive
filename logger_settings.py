import settings

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(process)d %(asctime)s %(module)s %(filename)s:%(funcName)s():%(lineno)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'default': {
            'level': 'DEBUG' if settings.DEBUG else 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'default.log',
            'maxBytes': 1024 * 1024 * 5,  # 5 MB
            'backupCount': 4,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'apps': {
            'handlers': ['default'],
            'level': 'DEBUG' if settings.DEBUG else 'INFO',
            'propagate': True,
        },
    }
}
