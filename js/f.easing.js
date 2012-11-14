/*
 * f.easing.js
 *
 * This script give the easing functions.
 *
 * Copyright (c) 2012 Kazuya Hiruma
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author   Kazuya Hiruma (http://css-eblog.com/)
 * @version  0.2.0
 * @github   https://github.com/edom18/f.js
 * @require f.core.js
 */

(function (f, win, doc, exports) {

'use strict';
/**
 * Easing functions
 * @param {Number} t Time.
 * @param {Number} b Beginning position.
 * @param {Number} c Total change
 * @param {Number} d Duration
 * @example
 *  var begin    = 100,
 *      finish   = 220,
 *      change   = finish - begin,
 *      duration = 30,
 *      time     = 0;
 * (function easing() {
 *     var x = easeInCubic(time++, begin, change, duration);
 *
 *     if (time > duration) return;
 *     setTimeout(easing, 1000 / 60);
 * }());
 */
var easing = {
    easeInCubic: function (t, b, c, d) {
        return c * Math.pow (t/d, 3) + b;
    },
    easeOutCubic: function (t, b, c, d) {
        return c * (Math.pow (t/d-1, 3) + 1) + b;
    },
    easeInOutCubic: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2 * Math.pow (t, 3) + b;
        }
        return c/2 * (Math.pow (t-2, 3) + 2) + b;
    },
    easeInQuart: function (t, b, c, d) {
        return c * Math.pow (t/d, 4) + b;
    },
    easeOutQuart: function (t, b, c, d) {
        return -c * (Math.pow (t/d-1, 4) - 1) + b;
    },
    easeInOutQuart: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2 * Math.pow (t, 4) + b;
        }
        return -c/2 * (Math.pow (t-2, 4) - 2) + b;
    },
    easeInQuint: function (t, b, c, d) {
        return c * Math.pow (t / d, 5) + b;
    },
    easeOutQuint: function (t, b, c, d) {
        return c * (Math.pow (t / d-1, 5) + 1) + b;
    },
    easeInOutQuint: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow (t, 5) + b;
        }
        return c / 2 * (Math.pow (t - 2, 5) + 2) + b;
    },
    easeInSine: function (t, b, c, d) {
        return c * (1 - Math.cos(t / d * (Math.PI / 2))) + b;
    },
    easeOutSine: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function (t, b, c, d) {
        return c / 2 * (1 - Math.cos(Math.PI * t / d)) + b;
    },
    easeInExpo: function (t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (t, b, c, d) {
        return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
    },
    easeOutCirc: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function (t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * (1 - Math.sqrt(1 - t * t)) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeInQuad: function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c/2 * ((--t) * (t - 2) - 1) + b;
    }
};

//export to global.
f.easing = easing;

}(f, window, document, window));
