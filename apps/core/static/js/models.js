_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

CD.models.BaseModel = Backbone.RelationalModel.extend({

    getJSON: function() {
        return JSON.stringify(this.toJSON());
    },

    dump: function() {
        CD.log(this.getJSON());
    },

    // Override toString to return something more meaningful
    toString: function() {
        return "Model(" + this.getJSON() + ")";
    }

});

CD.models.UserProfile = CD.models.BaseModel.extend({

    urlRoot: '/api/1/user/profile/'

});

CD.models.User = CD.models.BaseModel.extend({

    urlRoot: '/api/1/user/',

    defaults: {
        first_name: '',
        last_name: ''
    },

    validation: {
        email: {
            required: true,
            minLength: 1,
            pattern: 'email'
        },
        password1: {
            required: true,
            minLength: 1
        },
        password2: {
            required: true,
            equalTo: 'password1',
            msg: 'The passwords do not match'
        }
    },

    getUsername: function() {
        var fullname = this.getFullName();
        return fullname || this.get('email');
    },

    getFullName: function() {
        var fullname = (this.get('first_name') || '') + ' ' + (this.get('last_name') || '');
        return fullname.trim();
    },

});

CD.models.LoginUser = CD.models.BaseModel.extend({
    validation: {
        email: {
            required: true,
            pattern: 'email'
        },
        password: {
            required: true,
            minLength: 1
        }
    }
});

CD.models.SignupUser = CD.models.BaseModel.extend({
    validation: {

        email: {
            required: true,
            pattern: 'email'
        },
        password1: {
            required: true,
            minLength: 1
        },
        password2: {
            required: true,
            equalTo: 'password1',
            msg: 'The passwords do not match'
        }
    }
});


CD.models.Container = CD.models.BaseModel.extend({

    urlRoot: function() {
        return '/api/1/container/?user=' + CD.globals.user.get('id');
    },

    validation: {
        name: {
            required: true,
            minLength: 1
        }
    },

    relations: [{
        type: Backbone.HasMany,
        key: 'objects',
        relatedModel: 'CD.models.Object',
        collectionType: 'CD.collections.Objects',
        includeInJSON: false,
        autoFetch: false,
        reverseRelation: {
            key: 'container',
            includeInJSON: 'resource_uri'
        }
    }],

});

CD.collections.Containers = Backbone.Collection.extend({

    model: CD.models.Container,

    url: function() {
        return '/api/1/container/';
    },

});

CD.models.Object = CD.models.BaseModel.extend({

    urlRoot: '/api/1/object/',

});

CD.collections.Objects = Backbone.Collection.extend({

    model: CD.models.Objects,

    url: function() {
        return '/api/1/objects/?container=' + this.container.get('id');
    },

});