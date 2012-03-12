/*
 * f.js - markup engineer's coding adminicle JavaScript library plus HTML5.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.2.0
 * @github   https://github.com/edom18/f.js
 * @require jQuery
 *
 */

(function (win, doc, exports) {

'use strict';

/* ---------------------------------------------------------------
   EXTEND BUILTIN OBJECTS
------------------------------------------------------------------ */
if (typeof Object.create !== 'function') {
    Object.create = function (o) {

        function F() {}
        F.prototype = o;

        return new F();
    };
}

/**
 * @namespace
 */
var f = {
    utils: {},
    events: {}
};

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * copy arguments object properties to `obj`
 * @param {Object} obj base to be copy of properties.
 */
function copyClone(obj) {

    var args = Array.prototype.slice.call(arguments, 1),
        l    = args.length,
        i    = 0,
        source, prop;

    for (; i < l; i++) {
        source = args[i];
        for (prop in source) {
            obj[prop] = args[i][prop];
        }
    }

    return obj;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * extend mine properties to child.
 * @param {Object} protoProps for class instance members.
 * @param {Object} classProps for class static members.
 */
function extend(protoProps, classProps) {

    var child,
        ctor = function () {};
    
    //////////////////////////////////////////////////////////////

    
    function inherits(parent, protoProps, staticProps) {

        var child;

        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        }
        else {
            child = function(){
                parent.apply(this, arguments);
            };
        }

        copyClone(child, parent);

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        if (protoProps) {
            copyClone(child.prototype, protoProps);
        }

        if (staticProps) {
            copyClone(child, staticProps);
        }
        child.prototype.constructor = child;
        child.__super__ = parent.prototype;

        return child;
    }

    //////////////////////////////////////////////////////////////

    child = inherits(this, protoProps, classProps);
    child.extend = this.extend;

    return child;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *  EventDispatcher
 *  
 *  @constructor
 */
function EventDispatcher() {}

EventDispatcher.prototype = (function() {

    /**
     *  @param {string}   typ
     *  @param {?Object=} opt_evt
     *  @return {void}
     */
    function dispatchEvent(typ, opt_evt) {

        if (!typ) {
            throw "INVALID EVENT TYPE " + typ;
        }
        
        var obj = this.handlers || (this.handlers = {}),
            arr = obj[typ] || [],
            evt = opt_evt || {},
            len, i, fnc;
            
        evt.type || (evt.type = typ);
        
        // handle specified event type
        for (i = 0, len = arr.length; i < len; ++i) {
            (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
        }
        
        // handle wildcard "*" event
        arr  = obj["*"] || [];
        for (i = 0, len = arr.length; i < len; ++i) {
            (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, this, evt);
        }
    }

    /**
     *  @param {string} typ
     *  @param {function(evt:Object):void} fnc
     *  @param {Object} [context] if would like to be called context is set this param.
     *  @return {void}
     */
    function addEventListener(typ, fnc, context) {

        if (!typ) {
            throw "addEventListener:INVALID EVENT TYPE " + typ + " " + fnc;
        }
        
        var obj = this.handlers || (this.handlers = {});
        
        (obj[typ] || (obj[typ] = [])).push([fnc, context]);
    }
    /**
     *  @param {string} typ
     *  @param {function(evt:object):void} fnc
     */
    function removeEventListener(typ, fnc) {
        if (!typ) {
            throw "removeEventListener:INVALID EVENT TYPE " + typ + " " + fn;
        }
        
        var obj = this.handlers || (this.handlers = {}),
            arr = obj[typ] || [],
            i = arr.length;
            
        while(i) {
            arr[--i] === fnc && arr.splice(i, 1);
        }
    }

    /* --------------------------------------------------------------------
        EXPORT
    ----------------------------------------------------------------------- */
    return {
        dispatchEvent       : dispatchEvent,
        trigger             : dispatchEvent,
        pub                 : dispatchEvent,
        
        addEventListener    : addEventListener,
        bind                : addEventListener,
        sub                 : addEventListener,
        on                  : addEventListener,
        
        removeEventListener : removeEventListener,
        unbind              : removeEventListener,
        off                 : removeEventListener
    };
}());

////////////////////////////////////////////////////////////////////////////////////////////////////

var modelIdBase = 'id',
    modelIdIndex = 0;

/**
 * Model of MVC
 * @name Model
 * @param attr {Object} default settings.
 * @param opt {Object} use to initialize.
 */
function Model(attr, opt) {

    this.init.apply(this, arguments);
}

//defien Model.prototype by EventDispatcher and more.
copyClone(Model.prototype, EventDispatcher.prototype, {
    init: function (attr, opt) {

        var attribute = ($.isPlainObject(attr)) ? attr : {};

        //copy attribute.
        $.extend(this, attribute);

        //setting defaults.
        this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);
        (this.defaults) || (this.defaults = {});

        //create placeholder
        this._previousAttributes = null;

        //called `initialize` function if that exist on attributes.
        if ($.isFunction(this.initialize)) {
            this.initialize.apply(this, arguments);
        }
    },

    /**
     * @returns {Boolean} has been changed as true.
     */
    hasChanged: function () {
    
        return !!this._changed;
    },

    /**
     * change attributes
     */
    change: function () {

        //fired `change` event that takes changed object.
        this.trigger('change', this._changed);

        //copy `this.attributes` to `this._previousAttributes`.
        this._previousAttributes = copyClone({}, this.attributes);

        //delete changed object.
        this._changed = null;
        delete this._changed;
    },
    set: function (name, val) {
    
        var attr, attrs,
            attributes = (this.attributes || (this.attributes = {}));

        this._changed || (this._changed = {});

        if ($.isPlainObject(name)) {
            attrs = name;
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
            this.change();
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

//defien View.prototype by EventDispatcher and more.
copyClone(View.prototype, EventDispatcher.prototype, {
    init: function (attr, opt) {

        var attribute = ($.isPlainObject(attr)) ? attr : {},
            tmp;

        //copy attribute.
        $.extend(this, attribute);

        //setting defaults.
        this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);
        this._event = $({});
        this.events = ($.isPlainObject(attribute.events)) ? attribute.events : {};

        for (var key in this.events) {
            tmp = key.replace(/ +/g, ' ').split(' ');
            $(this.el).delegate(tmp[1], tmp[0], $.proxy(this[this.events[key]], this));
        }

        //initialize call
        if ($.isFunction(attribute.initialize)) {
            attribute.initialize.apply(this, opt);
        }
    }
});

Model.extend = View.extend = extend;

/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for utils
f.utils.extend    = extend;
f.utils.copyClone = copyClone;

//for MVC
f.Model = Model;
f.View  = View;

//for events
f.events.EventDispatcher = EventDispatcher;

//export to global.
exports.f = f;

}(window, document, window));
