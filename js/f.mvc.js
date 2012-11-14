/*
 * f.mvc.js
 *
 * This script give the abstract MVC.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.2.0
 * @github   https://github.com/edom18/f.js
 * @require f.js
 */

(function (f, win, doc, exports, undefined) {

'use strict';

var modelIdBase = 'id',
    modelIdIndex = 0,
    EventDispatcher = f.events.EventDispatcher,
    utils = f.utils,
    copyClone = utils.copyClone,
    extend = utils.extend;

/**
 * Model of MVC
 * @name Model
 * @param attr {Object} default settings.
 * @param opt {Object} use to initialize.
 */
function Model(attr, opt) {

    this.init.apply(this, arguments);
}

//shortcut to prototype.
Model.fn = Model.prototype;

//defien Model.prototype by EventDispatcher and more.
copyClone(Model.prototype, EventDispatcher.prototype, {
    init: function (attr, opt) {

        var attribute = ($.isPlainObject(attr)) ? attr : {};

        //setting this model's id.
        this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);

        if (this.defaults) {
            copyClone(attribute, this.defaults);
        }

        //set data by defaults and argumetns.
        this.set(attribute, {silent: true});


        //copy to `_previousAttributes` current attributes.
        this._previousAttributes = copyClone({}, this.attributes);

        //called `initialize` function if that exist on attributes.
        if ($.isFunction(this.initialize)) {
            this.initialize.apply(this, arguments);
        }
    },

    /**
     * @returns {Boolean} has been changed as true.
     */
    hasChanged: function () {
    
        return !isEmpty(this._changed);
    },

    /**
     * change attributes
     */
    change: function (options) {

        var key, ret;

        options || (options = {});

        if (this._changing || !this.hasChanged()) {
            return false;
        }

        this._changing = true;

        //fired `change` event that takes changed object.
        if (!options.silent) {
            this.trigger('change', this._changed);

            //fired event of each paramaters.
            for (key in this._changed) {
                ret = {};
                ret[key] = this._changed[key];
                this.trigger('change:' + key, ret);
            }
        }

        //copy `this.attributes` to `this._previousAttributes`.
        this._previousAttributes = copyClone({}, this.attributes);

        //delete changed object.
        this._changed = null;
        delete this._changed;

        this._changing = false;
    },
    set: function (name, val, options) {
    
        var attr, attrs,
            attributes = (this.attributes || (this.attributes = {}));

        this._changed || (this._changed = {});

        if ($.isPlainObject(name)) {
            attrs = name;
            options = val;
        }
        else {
            attrs = {};
            attrs[name] = val;
        }

        for (attr in attrs) {
            if (attributes[attr] === attrs[attr]) {
                continue;
            }
            attributes[attr] = attrs[attr];
            this._changed[attr] = attrs[attr];
        }

        if (this.hasChanged()) {
            this.change(options);
        }
    },
    previous: function (attr) {

        if (!arguments.length || !this._previousAttributes) {
            return null;
        }
        return this._previousAttributes[attr];
    },
    previousAttributes: function () {
    
        return copyClone({}, this._previousAttributes);
    },
    get: function (name) {
    
        return this.attributes[name];
    }
});

/**
 * View of MVC
 * @name View
 * @param attr {Object} default settings.
 * @param opt {Object} use to initialize.
 */
function View(attr, opt) {

    this.init.apply(this, arguments);
}

//shortcut to prototype.
View.fn = View.prototype;

//defien View.prototype by EventDispatcher and more.
copyClone(View.prototype, EventDispatcher.prototype, {
    tagName: 'div',
    className: '',
    init: function (attr, opt) {

        var elem,
            attribute = ($.isPlainObject(attr)) ? attr : {},
            selector, eventName, key, method, tmp;

        //setting defaults.
        this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);
        this.events || (this.events = $.isPlainObject(attribute.events) ? attribute.events : {});
        copyClone(this, attribute);

        if (!this.el) {
            elem = document.createElement(this.tagName);
            $(elem).addClass(this.className);
            this.setElement(elem, false);
        }
        else {
            this.setElement(attribute.el, false);
        }

        for (key in this.events) {
            tmp = key.match(/^(\S+)\s*(.*)$/);
            eventName = tmp[1];
            selector = tmp[2];
            method = this.events[key];
            ($.isFunction(method)) || (method = this[this.events[key]]);
            this.$el.delegate(selector, eventName, $.proxy(method, this));
        }

        //initialize call
        if ($.isFunction(this.initialize)) {
            this.initialize.apply(this, arguments);
        }
    },

    /**
     * Abstruct function.
     */
    initialize: function () {},
    $: function(selector) {

        return this.$el.find(selector);
    },
    setElement: function(el, delegate) {

        this.$el = $(el);
        this.el = this.$el[0];

        if (delegate !== false) {
            //this.delegateEvents();
        }

        return this;
    },
    render: function () {
    
        return this;
    }
});

Model.extend = View.extend = extend;

/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for MVC
f.Model = Model;
f.View  = View;

}(f, window, document, window));
