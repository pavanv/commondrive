"use strict";

/* jshint -W097 */

/* global alert */
/* global confirm */
/* global console */
/* global window */

/* global $ */
/* global _ */
/* global Backbone */
/* global BootstrapDialog */


/* global PMS */

/*************************************************
VALIDATION
**************************************************/

_.extend(Backbone.Validation.callbacks, {
    valid: function(view, attr, selector) {
        PMS.log('Valid attr=' + attr + ' selector=' + selector);
        var parentSelector = '.form-group:has(:input[' + selector + '~="' + attr + '"])';
        view.$(parentSelector).removeClass('has-error');
        view.$(parentSelector + ' span.help-block').remove();
        view.$(parentSelector + ' .input-icon')[0].style.removeProperty('border-left-color');
    },
    invalid: function(view, attr, error, selector) {
        PMS.log('Invalid attr=' + attr + ' selector=' + selector);
        var parentSelector = '.form-group:has(:input[' + selector + '~="' + attr + '"])';
        view.$(parentSelector).addClass('has-error');
        view.$(parentSelector + ' span.help-block').remove();
        view.$(parentSelector).append('<span class="help-block">' + error + '</span>');

    }
});

/*************************************************
VIEWS
**************************************************/

PMS.views.LoginView = PMS.views.BaseView.extend({

    template: _.template($('#LoginTmpl').html()),

    events: {
        'click #LoginBtn': 'doLogin'
    },

    bindings: {
        ':input[name="email"]': 'email',
        ':input[name="password"]': 'password'
    },

    initialize: function() {
        PMS.log('LoginView::initialize');
        this.model = new PMS.models.LoginUser({
            email: '',
            password: ''
        });
        Backbone.Validation.bind(this);
    },

    afterRender: function() {
        this.stickit();
    },

    doLogin: function(evt) {
        PMS.log('LoginView::doLogin');
        evt.preventDefault();

        PMS.log(JSON.stringify(this.model.toJSON()));

        if (!this.model.isValid(true)) {
            PMS.log('Login user is not valid');
            return this;
        }

        $.ajax({
            url: '/api/1/user/login/',
            type: 'POST',
            data: JSON.stringify(this.model.toJSON()),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                PMS.globals.userProfile = new PMS.models.UserProfile(data);
                PMS.functions.fetchUser();
                PMS.functions.routeToDefault();
            },
            error: function() {
                BootstrapDialog.alert('Login failed because either your email or password is incorrect');
            }
        });
        return this;
    }

});

PMS.views.SignupView = PMS.views.BaseView.extend({

    template: _.template($('#SignupTmpl').html()),


    bindings: {
        ':input[name="email"]': 'email',
        ':input[name="password1"]': 'password1',
        ':input[name="password2"]': 'password2',
        ':input[name="account_name"]': 'account_name',

    },

    events: {
        'click #SignupBtn': 'doSignup'
    },

    initialize: function() {
        PMS.log('Signup View::initialize');
        this.model = new PMS.models.SignupUser({
            email: '',
            password1: '',
            password2: '',
            account_name: '',
        });
        Backbone.Validation.bind(this);
    },

    afterRender: function() {
        this.stickit();
    },

    doSignup: function(evt) {
        PMS.log('SignupView::doSignup');
        evt.preventDefault();

        PMS.log(JSON.stringify(this.model.toJSON()));

        if (!this.model.isValid(true)) {
            PMS.log('Signup user is not valid');
            return this;
        }

        $.ajax({
            url: '/api/1/user/signup/',
            type: 'POST',
            data: JSON.stringify(this.model.toJSON()),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                PMS.globals.userProfile = new PMS.models.UserProfile(data);
                PMS.functions.fetchUser();
                PMS.functions.routeToDefault();
            },
            error: function() {
                BootstrapDialog.alert('An account already exists with the given email address.');
            }
        });
        return this;
    }

});