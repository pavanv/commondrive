"use strict";

/* jshint -W097 */

/* global alert */
/* global window */
/* global BootstrapDialog */

/* global _ */
/* global $ */

/* global CD */

CD.views.UserDropdownView = CD.views.BaseView.extend({

    template: _.template($('#UserDropdownTmpl').html()),

    events: {
        'click #AH_UserProfile': 'onUserProfile'
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    serialize: function() {
        return {
            user: this.model
        };
    },

    onUserProfile: function(evt) {
        CD.log('User clicked on User Profile');
        evt.preventDefault();
        CD.globals.router.navigate('user_profile', {
            trigger: true
        });
        return this;
    }

});

CD.views.DashboardView = CD.views.BaseView.extend({

    template: _.template($('#DashboardTmpl').html()),

    events: {
        'click #AH_AddStorage': 'onAddStorageBtn',
        'click .AH_AddStorageView .AH_Submit': 'onAddStorageSubmit',
        'click .AH_AddStorageView .AH_Cancel': 'onAddStorageCancel',
    },

    initialize: function() {
        this.containers = new CD.collections.Containers();
        this.containers.fetch({
            async: false
        });
    },

    serialize: function() {
        return {
            containers: this.containers
        };
    },

    beforeRender: function() {
        var view = this;
        this.containers.each(function(container) {
            view.insertView('#AH_Containers tbody', new CD.views.ContainerView({
                model: container
            }));
        });
    },

    onAddStorageBtn: function() {
        CD.log('Add Storage button click');

        this.$('#AH_AddStorage').toggleClass('hidden');
        this.$('.AH_AddStorageView').toggleClass('hidden');
        return this;
    },

    onAddStorageSubmit: function() {
        CD.log('Add Storage Submit handler');
        $.ajax({
            url: '/api/1/container/add/dropbox/',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            },
            error: function() {
                BootstrapDialog.alert('Error adding Dropbox account');
            }
        });
        return this;
    },

    onAddStorageCancel: function() {
        CD.log('Add Storage Cancel handler');
        this.$('#AH_AddStorage').toggleClass('hidden');
        this.$('.AH_AddStorageView').toggleClass('hidden');
        return this;
    },

});

CD.views.ContainerView = CD.views.BaseView.extend({

    tagName: 'tr',

    template: _.template($('#ContainerTmpl').html()),

    initialize: function() {
        this.listenTo(this.model, 'delete', this.remove);
    },

    events: {
        'click .AH_View': 'onView',
        'click .AH_Index': 'onIndex',
        'click .AH_Watch': 'onWatch',
        'click .AH_Delete': 'onDelete',
    },

    onView: function() {
        CD.log('View called on container');
        CD.functions.routeToObject(this.model.get('root'));
        return this;
    },

    onIndex: function() {
        CD.log('Index called on container');
        return this;
    },

    onWatch: function() {
        CD.log('Watch called on container');
        return this;
    },

    onDelete: function() {
        CD.log('Delete called on container');
        return this;
    },

});

CD.views.ObjectView = CD.views.BaseView.extend({

    template: _.template($('#ObjectTmpl').html()),

    events: {
        'click .AH_ViewDirectory': 'onViewDirectory',
    },

    initialize: function(options) {
        this.model = new CD.models.Object({
            id: options.id
        });
        this.model.fetch({
            async: false
        });
    },

    onViewDirectory: function() {
        CD.log('View called on directory');
        return this;
    },

});