"use strict";

/* jshint -W097 */

/* global alert */

/* global document */
/* global window */

/* global $ */
/* global _ */
/* global Backbone */
/* global BootstrapDialog */

/* global CD */

/*************************************************
 ROUTER
**************************************************/

CD.Router = Backbone.Router.extend({
    routes: {
        '': 'dashboard',

        'login': 'login',
        'signup': 'signup',
        'dashboard': 'dashboard',

        'c/add': 'addContainer',
        'o/:id': 'viewObject',

        '*notFound': 'notFound'
    },

    initialize: function() {
        this.currentView = null;
    },

    renderView: function(view) {
        this.cleanupCurrentView();
        this.currentView = view;
        $('#AH_PageContainer').html(this.currentView.render().el);
        $(document).scrollTop(0);
    },

    notFound: function() {
        BootstrapDialog.alert('Route not found ' + window.location.href);
        this.navigate('', {
            trigger: true
        });
    },

    cleanupCurrentView: function() {
        if (this.currentView) {
            CD.log('Cleaning up view ' + this.currentView.cid);
            if (_.isFunction(this.currentView.cleanup)) {
                this.currentView.cleanup();
            }
            this.currentView.remove();
            this.currentView = null;
        }
    },

    login: function() {
        CD.log('Routing to Login view');
        this.renderView(new CD.views.LoginView());
    },

    signup: function() {
        CD.log('Routing to Signup view');
        this.renderView(new CD.views.SignupView());
    },

    dashboard: function() {
        CD.log('Routing to dashboard');
        this.renderView(new CD.views.DashboardView());
    },

    addContainer: function() {
        CD.log('Routing to addContainer');
        this.renderView(new CD.views.AddContainerView());
    },

    viewObject: function(id) {
        CD.log('Routing to view object');
        this.renderView(new CD.views.ObjectView({
            id: id
        }));
    },

});