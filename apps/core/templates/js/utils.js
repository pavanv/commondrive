"use strict";

/* jshint -W097 */

/* global alert */
/* global console */
/* global BootstrapDialog */

/* global _ */
/* global jQuery */

/*************************************************
 UTILITIES
**************************************************/

var CD = CD || {};

CD.views = CD.views || {};
CD.models = CD.models || {};
CD.collections = CD.collections || {};
CD.globals = CD.globals || {};
CD.functions = CD.functions || {};
CD.constants = CD.constants || {};

CD.log = function() {
    if (CD.debug) {
        console.log.apply(console, arguments);
    }
};

Date.prototype.toServerFormat = function() {
    return this.toString('yyyy-MM-ddTHH:mm:ss');
};

String.prototype.pluralize = function(count, plural) {
    if ((plural === null) || (plural === undefined))
        plural = this + 's';

    return (count == 1 ? this : plural);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.trimToLength = function(m) {
    return (this.length > m) ? jQuery.trim(this).substring(0, m).split(" ").slice(0, -1).join(" ") + "..." : this;
};

CD.assert = function(condition, message) {
    if (!condition) {
        BootstrapDialog.alert('Assertion failed: ' + message);
        throw message || "Assertion failed";
    }
};

_.getVal = function(obj, key, defaultValue) {
    return (_.isObject(obj) && _.has(obj, key)) ? obj[key] : defaultValue;
};