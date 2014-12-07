"use strict";

/* jshint -W097 */

/* global alert */
/* global console */
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

    onAddStorageBtn: function() {
        CD.log('Add Storage button click');

        this.$('#AH_AddStorage').toggleClass('hidden');
        this.$('.AH_AddStorageView').toggleClass('hidden');
        return this;
    },

    onAddStorageSubmit: function() {
        CD.log('Add Storage Submit handler');
        return this;
    },

    onAddStorageCancel: function() {
        CD.log('Add Storage Cancel handler');
        this.$('#AH_AddStorage').toggleClass('hidden');
        this.$('.AH_AddStorageView').toggleClass('hidden');
    },

});