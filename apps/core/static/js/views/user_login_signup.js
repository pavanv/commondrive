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


/* global CD */

/*************************************************
VALIDATION
**************************************************/

_.extend(Backbone.Validation.callbacks, {
    valid: function(view, attr, selector) {
        CD.log('Valid attr=' + attr + ' selector=' + selector);
        var parentSelector = '.form-group:has(:input[' + selector + '~="' + attr + '"])';
        view.$(parentSelector).removeClass('has-error');
        view.$(parentSelector + ' span.help-block').remove();
        view.$(parentSelector + ' .input-icon')[0].style.removeProperty('border-left-color');
    },
    invalid: function(view, attr, error, selector) {
        CD.log('Invalid attr=' + attr + ' selector=' + selector);
        var parentSelector = '.form-group:has(:input[' + selector + '~="' + attr + '"])';
        view.$(parentSelector).addClass('has-error');
        view.$(parentSelector + ' span.help-block').remove();
        view.$(parentSelector).append('<span class="help-block">' + error + '</span>');

    }
});

/*************************************************
VIEWS
**************************************************/

CD.views.LoginView = CD.views.BaseView.extend({

    template: _.template($('#LoginTmpl').html()),

    events: {
        'click #LoginBtn': 'doLogin'
    },

    bindings: {
        ':input[name="email"]': 'email',
        ':input[name="password"]': 'password'
    },

    initialize: function() {
        CD.log('LoginView::initialize');
        this.model = new CD.models.LoginUser({
            email: '',
            password: ''
        });
        Backbone.Validation.bind(this);
    },

    afterRender: function() {
        this.stickit();
    },

    doLogin: function(evt) {
        CD.log('LoginView::doLogin');
        evt.preventDefault();

        CD.log(JSON.stringify(this.model.toJSON()));

        if (!this.model.isValid(true)) {
            CD.log('Login user is not valid');
            return this;
        }

        $.ajax({
            url: '/api/1/user/login/',
            type: 'POST',
            data: JSON.stringify(this.model.toJSON()),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                CD.globals.userProfile = new CD.models.UserProfile(data);
                CD.functions.fetchUser();
                CD.functions.routeToDefault();
            },
            error: function() {
                BootstrapDialog.alert('Login failed because either your email or password is incorrect');
            }
        });
        return this;
    }

});

CD.views.SignupView = CD.views.BaseView.extend({

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
        CD.log('Signup View::initialize');
        this.model = new CD.models.SignupUser({
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
        CD.log('SignupView::doSignup');
        evt.preventDefault();

        CD.log(JSON.stringify(this.model.toJSON()));

        if (!this.model.isValid(true)) {
            CD.log('Signup user is not valid');
            return this;
        }

        $.ajax({
            url: '/api/1/user/signup/',
            type: 'POST',
            data: JSON.stringify(this.model.toJSON()),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                CD.globals.userProfile = new CD.models.UserProfile(data);
                CD.functions.fetchUser();
                CD.functions.routeToDefault();
            },
            error: function() {
                BootstrapDialog.alert('An account already exists with the given email address.');
            }
        });
        return this;
    }

});