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
 */

(function (win, doc, exports, undefined) {

'use strict';

var objProto = Object.prototype,
    arrProto = Array.prototype,
    arrSlice = arrProto.slice,
    toString = objProto.toString;

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
    utils : {},
    events: {},
    Model : {},
    View  : {}
};

////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO
function chkProp(obj, propList) {

    var key, tmp;

    for (key in obj) {
        //if (obj[key]) 
    }
}

/* ----------------------------------------------------------------------------------------------
    FOR CHECKING UTILITES
------------------------------------------------------------------------------------------------- */
function hasProp(obj, prop) {

    return objProto.hasOwnProperty.call(obj, prop);
}

function isFunction(obj) {

    return toString.call(obj) === '[object Function]';
}

function isString(obj) {

    return toString.call(obj) === '[object String]';
}

function isNumber(obj) {

    return toString.call(obj) === '[object Number]';
}

function isNull(obj) {

    return obj === null;
}

function isUndefined(obj) {

    return obj === undefined;
}

var isArray = Array.isArray || function (obj) {

    return toString.call(obj) === '[object Array]';
};

function isEmpty(obj) {

    var key;

    if (isFunction(obj)) {
        return false;
    }
    else if (isNumber(obj)) {
        return false;
    }
    else if (isArray(obj) || isString(obj)) {
           return obj.length === 0;
    }
    else if (isNull(obj)) {
        return true;
    }
    else if (isUndefined(obj)) {
        return true;
    }

    for (key in obj) if (hasProp(obj, key)) {
        return false;
    }

    return true;
}

/**
 * Bind function to context.
 */
function bind(func, context) {

    return function () {
    
        func.apply(context, arguments);
    };
}

/**
 * copy arguments object properties to `obj`
 * @param {Object} obj base to be copy of properties.
 */
function copyClone(obj) {

    var args = arrProto.slice.call(arguments, 1),
        l    = args.length,
        i    = 0,
        src, prop;

    for (; i < l; i++) {
        src = args[i];
        for (prop in src) {
            obj[prop] = args[i][prop];
        }
    }

    return obj;
}

/**
 * Make a new array.
 * @param {Array} arr
 * @returns {Array} A new array object.
 */
function makeArr(arr) {

    return arrSlice.call(arr);
}

function entity(str) {

    return ('' + str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g,'&#x2F;');
}

function unentity(str) {

    return ('' + str)
            .replace(/&amp;/g, '&')
            .replace(/&#x26;/g, '&')
            .replace(/&#38;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&#x3c;/g, '<')
            .replace(/&#60;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x3e;/g, '>')
            .replace(/&#62;/g, '>')
            .replace(/&quout;/g, '"')
            .replace(/&#x22;/g, '"')
            .replace(/&#34;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g,'\/');
}

function unescape(str) {

    return str.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
}


/**
 * return object by split string within `&` and `=`.
 * @returns {Object} splited parameters.
 */
function getParams(str) {

    var ret = {},
        tmp, i = 0, l;

    tmp = str.split('&');
    for (l = tmp.length; i < l; i++) {
        tmp2 = tmp[i].split('=');
        ret[tmp2[0]] = tmp2[1];
    }

    return ret;
}

function template(source, data, options) {

    var  settings, funcTmpl, func,
         noMath = /.^/;
    
    options || (options = {});

    function _parse(code) {
    
        code = code.replace(/\\/g, '\\\\');
        code = code.replace(/\'/g, "\\'");
        code = code.replace(settings.deploy || noMatch, function (m, code) {

            return "', f.utils.entity(" + unescape(code) + "), '";
        });
        code = code.replace(settings.escape || noMatch, function (m, code) {

            return "', " + unescape(code) + ", '";
        });
        code = code.replace(settings.exe || noMatch, function (m, code) {

            return "'); " + unescape(code).replace(/[\r\n\t]/g, ' ') + "; __f.push('";
        });
        code = code.replace(/\n/g, '\\n');
        code = code.replace(/\r/g, '\\r');
        code = code.replace(/\t/g, '\\t');

        return code;
    }

    //////////////////////////////////////////////////////////////////////

    settings = {
        exe   : /<%([\s\S]+?)%>/g,
        deploy: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    funcTmpl = [
        'var __f = [];',
        (options.throughErr) ? 'try {' : '',
            'with (obj || {}) {',
                '__f.push(\'',
                    _parse(source),
                '\');',
            '}',
        (options.throughErr) ? '} catch (e) {}' : '',
        'return __f.join("");'
    ].join('');

    func = new Function('obj', 'f', funcTmpl);

    if (data) {
        return func(data, f);
    }

    return function (data) {
    
        return func.call(this, data, f);
    };
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

    
    function inherits(_super, protoProp, staticProp) {

        var child;

        if (protoProp && hasProp(protoProp, 'constructor')) {
            child = protoProp.constructor;
        }
        else {
            child = function(){
                _super.apply(this, arguments);
            };
        }

        copyClone(child, _super);

        ctor.prototype = _super.prototype;
        child.prototype = new ctor();

        if (protoProp) {
            copyClone(child.prototype, protoProp);
        }

        if (staticProp) {
            copyClone(child, staticProp);
        }
        child.prototype.constructor = child;
        child.__super__ = _super.prototype;

        return child;
    }

    //////////////////////////////////////////////////////////////

    child = inherits(this, protoProps, classProps);
    child.extend = this.extend;

    return child;
}

function _Deferred(func) {
  
    var _queue = [],
        _data,
        ret = {
            isResolved: isResolved,
            done: done,
            resolve: resolve
        };

    function done(func) {
        if (isFunction(func)) {
            _queue ? _queue.push(func) : func(_data);
        }

        return this;
    }
    function resolve(data) {
        if (isResolved()) {
            return;
        }

        var arr = _queue,
            i = 0,
            l = arr.length;

        _data = data;
        _queue = null;

        for (; i < l; i++) {
            arr[i](data);
        }
    }
    function isResolved() {
        return !_queue;
    }

    if (isFunction(func)) {
        func(ret);
    }

    return ret;
}

function Deferred(func) {
    var _dSuccess = new _Deferred(),
        _dFail    = new _Deferred(),
        ret = {
            resolve: resolve,
            reject: reject,
            done: done,
            fail: fail
        };

    function resolve() {
        if (_dFail.isResolved()) {
            return false;
        }
        _dSuccess.resolve.apply(null, arguments);
    }

    function reject() {
        if (_dSuccess.isResolved()) {
            return false;
        }
        _dFail.resolve.apply(null, arguments);
    }

    function done() {
        _dSuccess.done.apply(null, arguments);
        return this;
    }

    function fail() {
        _dFail.done.apply(null, arguments);
        return this;
    }

    if (isFunction(func)) {
        func(ret);
    }

    return ret;
}

/////////////////////////////////////////////////////////////////////////

function when(arr) {

    var d = new Deferred(),
        i = arr.length,
        len = i;

    function _watch() {
        --len || d.resolve();
    }

    while(i--) {
        arr[i].done(_watch);
    }

    return d;
}

/////////////////////////////////////////////////////////////////////////

/**
 * @class Throttle
 * @param {Number} ms millsecounds
 * @example
 * var throttle = new Throttle(1000);
 *
 * var i = 0;
 * var timer = setInterval(function () {
 *     i++;
 *     throttle.exec(function () {
 *         console.log(i);
 *     });
 * }, 32);
 */
function Throttle(ms) {

    var _timer,
        prevTime;

    function exec(func) {

        var now = +new Date(),
            delta;

        if (!isFunction(func)) {
            return false;
        }

        if (!prevTime) {
            func();
            prevTime = now;
            return;
        }

        clearTimeout(_timer);
        delta = now - prevTime;
        if (delta > ms) {
            func();
            prevTime = now;
        }
        else {
            _timer = setTimeout(function () {
                func();
                _timer = null;
                prevTime = now;
            }, ms);
        }
    }

    return {
        exec: exec
    };
}

/**
 * Chain callbacks.
 * @param {Function[]} [No arguments name] Call function objects as chain method.
 * @return undefined
 * @example
 *   chain(function (next) {... next(); }, function (next) {... next(); }, function (next) {... next(); }...);
 *       -> next is callback.
 */
function chain() {

    var actors = Array.prototype.slice.call(arguments);

    function next() {

        var actor = actors.shift(),
            arg = Array.prototype.slice.call(arguments);

        //push `next` method to argumetns to last.
        arg.push(next);

        //when `actor` is function, call it.
        (toString.call(actor) === '[object Function]') && actor.apply(actor, arg);
    }

    next();
}


/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for utils
f.utils.chain       = f.chain       = chain;
f.utils.Throttle    = f.Throttle    = Throttle;
f.utils.Deferred    = f.Deferred    = Deferred;
f.utils.when        = f.when        = when;
f.utils.makeArr     = f.makeArr     = makeArr;
f.utils.bind        = f.bind        = bind;
f.utils.extend      = f.extend      = extend;
f.utils.copyClone   = f.copyClone   = copyClone;
f.utils.isFunction  = f.isFunction  = isFunction;
f.utils.isString    = f.isString    = isString;
f.utils.isNumber    = f.isNumber    = isNumber;
f.utils.isArray     = f.isArray     = isArray;
f.utils.isNull      = f.isNull      = isNull;
f.utils.isUndefined = f.isUndefined = isUndefined;
f.utils.isEmpty     = f.isEmpty     = isEmpty;
f.utils.hasProp     = f.hasProp     = hasProp;
f.utils.template    = f.template    = template;
f.utils.getParams   = getParams;
f.utils.entity      = entity;
f.utils.unentity    = unentity;
f.utils.unescape    = unescape;

//export to global.
exports.f = f;

}(window, document, window));
/*
 * f.event.js
 *
 * This script give the event object.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.2.0
 * @github   https://github.com/edom18/f.js
 * @require f.core.js
 *
 */

(function (f, win, doc, exports, undefined) {

'use strict';

/**
 *  EventDispatcher
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
            arr = [].concat(obj[typ] || []), //Use copy
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
            arr[--i][0] === fnc && arr.splice(i, 1);
        }
    }

    function one(typ, fnc, context) {
    
        var self = this;

        function _fnc() {

            self.removeEventListener(typ, _fnc, context);
            fnc.apply(context || self, arguments);
        }

        this.addEventListener(typ, _fnc, context);
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
        off                 : removeEventListener,

        one                 : one
    };
}());

/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for events
f.events.EventDispatcher = EventDispatcher;

}(f, window, document, window));
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
