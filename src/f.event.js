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
