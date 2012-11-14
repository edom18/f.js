/*
 * f.aspect.js
 *
 * This script give the aspect method.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.1.0
 * @github   https://github.com/edom18/f.js
 * @require  f.core.js
 */
(function (win, doc, exports) {

'use strict';

/////////////////////////////////////////////////////////////////////////////
//for AOP
function _after(target, methodName, aspect) {

    var method = target[methodName];

    //overwrite the method.
    target[methodName] = function () {

        var args = Array.prototype.slice.call(arguments),
            result;
        
        result = method.apply(this, arguments);

        args.push(result);
        args.push({
            target: this,
            methodName: methodName,
            method: method
        });

        return aspect.apply(this, args);
    };
}

function _apply(func, target, methodNames, aspect) {

    if (Object.prototype.toString.call(methodNames) !== '[object Array]') {
        methodNames = [methodNames];
    }

    var i = 0, mName;

    for (; mName = methodNames[i]; i++) {
        func(target, mName, aspect);
    }
}

function after(target, methodNames, aspect) {

    _apply(_after, target, methodNames, aspect);
}

/*! -------------------------------------------------------
  EXPORTS
---------------------------------------------------------- */
//Aspect
exports.f.aspect          = {};
exports.f.aspect.after    = after;

}(window, document, window));
