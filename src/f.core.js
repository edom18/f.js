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

(function (win, doc, exports, undefined) {

'use strict';

var objProto = Object.prototype,
    arrProto = Array.prototype,
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

function Deferred(func) {
  
    var _queue = [],
        _data,
        ret = {
            done: done,
            resolve: resolve
        };

    function done(func) {
        if (isFunction(func)) {
            _queue ? _queue.push(func) : func(_data);
        }
    }
    function resolve(data) {

        var arr = _queue,
            i = 0,
            l = arr.length;

        _data = data;
        _queue = null;

        for (; i < l; i++) {
            arr[i](data);
        }
    }

    func(ret);

    return ret;
}

var d = new Deferred(function (d) {

    d.done(function (data) { console.log(data); });
});

setTimeout(function () {
  d.resolve('hoge');
  
  d.done(function () {
    console.log('after hoge');
  });
}, 5000);

/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
//for utils
f.utils.Deferred    = f.Deferred    = Deferred;
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
