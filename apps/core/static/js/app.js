"use strict";

/* jshint -W097 */

/* global alert */
/* global console */
/* global window */

/* global $ */
/* global _ */
/* global Backbone */

/* global CD */

/*************************************************
 EVENT AGGREGATOR
**************************************************/

CD.globals.events = _.extend({}, Backbone.Events);

/*************************************************
FUNCTIONS
**************************************************/

CD.functions.routeToDefault = function() {
    CD.globals.router.navigate('', {
        trigger: true
    });
};

CD.functions.fetchUser = function() {
    CD.log('Getting user');
    CD.globals.user = new CD.models.User({
        id: CD.globals.userProfile.get('id')
    });
    CD.globals.user.fetch({
        async: false,
        success: function(model) {
            CD.log('Success in getting user');
            Backbone.Tastypie.csrfToken = $.cookie('csrftoken');
            CD.functions.getUserOrganizations();
            CD.functions.getUserProjects();
            CD.functions.getStarredForms();
            CD.functions.getAllForms();
            //CD.functions.loadPageContent();
            CD.functions.loadSidebar();
            CD.functions.loadUserDropdown();
            CD.functions.loadSearchBar();
        },
        error: function() {
            CD.log('Error in getting user');
            window.location.href = '#login';
        }
    });
};

CD.functions.fetchUserProfile = function() {
    CD.log('Getting user profile');
    CD.globals.userProfile = new CD.models.UserProfile();
    CD.globals.userProfile.fetch({
        async: false,
        success: function(model) {
            CD.log('Success in getting user profile');
            CD.functions.fetchUser();
        },
        error: function() {
            CD.log('Error in getting user profile');
            window.location.href = '#login';
        }
    });
};

CD.functions.routeToContainer = function(container) {
    CD.globals.router.navigate('c/' + container.get('id'), {
        trigger: true
    });
};

CD.functions.routeToObject = function(object) {
    CD.globals.router.navigate('o/' + object.get('id'), {
        trigger: true
    });
};

CD.functions.loadPageContent = function() {
    CD.globals.pageContent = new CD.views.PageContentView({
        el: "#AH_PageContent"
    }).render();
};

CD.functions.activateSpinner = function() {
    /* Global spinner options */
    CD.globals.spinner = {
        active: false
    };

    var spinnerOptions = {
        lines: 9, // The number of lines to draw
        length: 21, // The length of each line
        width: 5, // The line thickness
        radius: 3, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    $("#spinner").spin(spinnerOptions).hide();
    $('#spinner').ajaxStart(function() {
        if (!CD.globals.spinner.active) {
            $(this).fadeIn();
        }
    });
    $('#spinner').ajaxComplete(function() {
        if (!CD.globals.spinner.active) {
            $(this).fadeOut();
        }
    });
};

CD.functions.startSpinner = function() {
    if (!CD.globals.spinner.active) {
        CD.globals.spinner.active = true;
        $('#spinner').fadeIn();
    }
};

CD.functions.stopSpinner = function() {
    if (CD.globals.spinner.active) {
        CD.globals.spinner.active = false;
        $('#spinner').fadeOut();
    }
};

CD.functions.getUser = function(userid) {
    var uri = '/api/1/user/' + userid + '/';
    var user = CD.models.User.findOrCreate({
        resource_uri: uri
    });
    if (!user.has('id')) {
        user.fetch({
            async: false
        });
    }
    return user;
};

/*************************************************
 START THE APP
 *************************************************/

$(function() {
    CD.functions.activateSpinner();

    /* Start global spinner */
    CD.functions.startSpinner();

    /* Fetch the user */
    CD.functions.fetchUserProfile();

    /* Stop global spinner */
    CD.functions.stopSpinner();

    /* Create the router */
    CD.globals.router = new CD.Router();

    /* Start the app */
    Backbone.history.start();
});