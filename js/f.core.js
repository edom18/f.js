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
    utils : {}
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

function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
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
        return obj === 0;
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
    else if (isBoolean(obj)) {
        return !obj;
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

function each (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.forEach) {
        arr.forEach(func);
    }
    else {
        for (var i = 0, l = arr.length; i < l; i++) {
            func(arr[i], i);
        }
    }
}

function every (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.every) {
        return arr.every(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (!func(arr[i], i, arr)) {
                return false;
            }
        }

        return true;
    }
}

function some (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    if (arr.some) {
        return arr.some(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (func(arr[i], i)) {
                return true;
            }
        }

        return false;
    }
}

function filter (arr, func) {
    if (!isArray(arr)) {
        return false;
    }

    var ret = [];

    if (arr.filter) {
        return arr.filter(func);
    }
    else {
        for (var i = 0, l; i < l; i++) {
            if (func(arr[i], i)) {
                ret.push(arr[i]);
            }
        }

        return ret;
    }
}


//function reduce (arr, func, initVal) {
//    if (!isArray(arr)) {
//        return false;
//    }
//
//    var ret = +initVal || 0;
//
//    if (arr.reduce) {
//        return arr.reduce(func, initVal);
//    }
//    else {
//        for (var i = 0, l; i < l; i++) {
//            if (func(arr[i], i)) {
//                ret.push(arr[i]);
//            }
//        }
//
//        return ret;
//    }
//}

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

/**
 * Gives you indexOf function.
 * If browser gives you this method, return value with native function.
 * @param {Array} arr target array.
 * @param {*} item target item.
 */
function indexOf (arr, item) {
    if (arr.indexOf) {
        return arr.indexOf(item);
    }
    else {
        for (var i = 0, l = arr; i < l; ++i) if (arr[i] === item) return i;
    }
    return -1;
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
        tmp,
        tmp2,
        i = 0,
        l = 0;

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
f.utils.every       = f.every       = every;
f.utils.each        = f.each        = each;
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
