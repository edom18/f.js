/*
 * f.js - markup engineer's coding adminicle JavaScript library plus HTML5.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.1.0
 * @github   https://github.com/edom18/f.js
 *
 */

/**
 * @namespace
 */
var f = {};

(function (win, doc) {

'use strict';

/**
 * extend mine properties to child.
 * @param {Object} protoProps for class instance members.
 * @param {Object} classProps for class static members.
 */
function extend(protoProps, classProps) {

    var child,
        ctor = function () {};
    
    //////////////////////////////////////////////////////////////

    function _extend(obj) {
    
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

        _extend(child, parent);

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        if (protoProps) {
            _extend(child.prototype, protoProps);
        }

        if (staticProps) {
            _extend(child, staticProps);
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

/* --------------------------------------------------------------------
    EXPORT
----------------------------------------------------------------------- */
f.extend = extend;

}(window, document));
