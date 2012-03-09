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
 *
 */

(function (win, doc, exports) {

'use strict';

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
            (fnc = arr[i][0]) && fnc.call(arr[i][1] || this, evt);
        }
        
        // handle wildcard "*" event
        arr  = obj["*"] || [];
        for (i = 0, len = arr.length; i < len; ++i) {
            (fnc = arr[i]) && fnc.call(this, evt);
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
        
        ( obj[typ] || (obj[typ] = []) ).push([fnc, context]);
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

/**
 * Model of MVC
 * @name Model
 * @param attr {Object} default settings.
 * @param opt {Object} use to initialize.
 */
function Model(attr, opt) {

    this.init.apply(this, arguments);
}

copyClone(Model.prototype, EventDispatcher.prototype, {
    init: function (attr, opt) {

        var attribute = ($.isPlainObject(attr)) ? attr : {};

        //copy attribute.
        $.extend(this, attribute);

        //setting defaults.
        this.id = (attribute.id) ? attribute.id : modelIdBase + (++modelIdIndex);
        this.defaults = (attribute.defaults) ? attribute.defaults : {};
        this._event = $({});

        if ($.isFunction(attribute.initialize)) {
            attribute.initialize.apply(this, opt);
        }
    },
    set: function (name, val) {
    
        this.store[name] = val;
        this.trigger('change');
    },
    get: function (name) {
    
        return this.store[name];
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
    },
    bind: function (eventName, func) {
    
        this._event.bind(eventName, func);
    },
    unbind: function (eventName, func) {

        this._event.unbind(eventName, func);
    },
    trigger: function (eventName) {
    
        this._event.trigger(eventName);
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
