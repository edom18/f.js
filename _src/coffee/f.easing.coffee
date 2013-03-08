###

    f.easing.js

    This script give the easing functions.

    Copyright (c) 2012 Kazuya Hiruma
    Licensed under the MIT License:
    http://www.opensource.org/licenses/mit-license.php

    @author   Kazuya Hiruma (http://css-eblog.com/)
    @version  0.1.0
    @github   https://github.com/edom18/f.js
    @require  f.core.js

###

do (win = window, doc = window.document, exports = window) ->

    'use strict'

    ###
        Easing functions
        @param {number} t Time.
        @param {number} b Beginning position.
        @param {number} c Total change
        @param {number} d Duration
        @example
         var begin    = 100,
             finish   = 220,
             change   = finish - begin,
             duration = 30,
             time     = 0,
             easing   = new Easing('easeInCubic', time, begin, change, duration);
        
        (function easing() {
            var x = easing.getValue();
        
            if (x === null) return;
            setTimeout(easing, 1000 / 60);
        }());
    ###

    ###
        @constructor
        @param {string} type Easing name.
    ###
    class Easing
        constructor: (type, t, b, c, d) ->
            @_easing = easing[type]
            throw new Error 'Value of `type` is undefined.' if not @_easing

            if (
                typeof t is 'number' and
                typeof b is 'number' and
                typeof c is 'number' and
                typeof d is 'number'
            )
                @setProp t, b, c, d

        ###
            @return {?number} easing value.
        ###
        getValue: ->

            if (
                typeof @_t is 'undefined' or
                typeof @_b is 'undefined' or
                typeof @_c is 'undefined' or
                typeof @_d is 'undefined'
            )
                throw new Error('Must be set properties, time, begin, change and duration.')

            val = @_easing @_t++, @_b, @_c, @_d

            if @_t > @_d and val isnt @_f
                return null

            return val

        ###
            @param {number} t Time.
            @param {number} b Beginning position.
            @param {number} c Total change
            @param {number} d Duration
        ###
        setProp: (t, b, c, d) ->

            throw new Error 'Not enough arguments.' if arguments.length isnt 4

            @_t = t
            @_b = b
            @_c = c
            @_d = d

            @_f = b + c

    {pow, cos, sin, sqrt, PI} = Math

    easing =
        easeInCubic: (t, b, c, d) ->
            return c * pow(t / d, 3) + b

        easeOutCubic: (t, b, c, d) ->
            return c * (pow(t / d - 1, 3) + 1) + b

        easeInOutCubic: (t, b, c, d) ->
            if (t /= d / 2) < 1
                return c / 2 * pow(t, 3) + b

            return c / 2 * (pow(t - 2, 3) + 2) + b
        
        easeInQuart: (t, b, c, d) ->
            return c * pow(t / d, 4) + b

        easeOutQuart: (t, b, c, d) ->
            return -c * (pow(t / d-1, 4) - 1) + b

        easeInOutQuart: (t, b, c, d) ->
            if (t /= d / 2) < 1
                return c / 2 * pow(t, 4) + b

            return -c / 2 * (pow(t-2, 4) - 2) + b

        easeInQuint: (t, b, c, d) ->
            return c * pow(t / d, 5) + b

        easeOutQuint: (t, b, c, d) ->
            return c * (pow(t / d-1, 5) + 1) + b

        easeInOutQuint: (t, b, c, d) ->
            if (t /= d / 2) < 1
                return c / 2 * pow(t, 5) + b

            return c / 2 * (pow(t - 2, 5) + 2) + b

        easeInSine: (t, b, c, d) ->
            return c * (1 - cos(t / d * (PI / 2))) + b

        easeOutSine: (t, b, c, d) ->
            return c * sin(t / d * (PI / 2)) + b

        easeInOutSine: (t, b, c, d) ->
            return c / 2 * (1 - cos(PI * t / d)) + b

        easeInExpo: (t, b, c, d) ->
            return c * pow(2, 10 * (t / d - 1)) + b

        easeOutExpo: (t, b, c, d) ->
            return c * (-pow(2, -10 * t / d) + 1) + b

        easeInOutExpo: (t, b, c, d) ->
            if (t/=d/2) < 1
                return c / 2 * pow(2, 10 * (t - 1)) + b

            return c / 2 * (-pow(2, -10 * --t) + 2) + b

        easeInCirc: (t, b, c, d) ->
            return c * (1 - sqrt(1 - (t /= d) * t)) + b

        easeOutCirc: (t, b, c, d) ->
            return c * sqrt(1 - (t = t / d - 1) * t) + b

        easeInOutCirc: (t, b, c, d) ->
            if (t /= d / 2) < 1
                return c / 2 * (1 - sqrt(1 - t * t)) + b

            return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b

        easeInQuad: (t, b, c, d) ->
            return c * (t /= d) * t + b

        easeOutQuad: (t, b, c, d) ->
            return -c * (t /= d) * (t - 2) + b

        easeInOutQuad: (t, b, c, d) ->
            if (t /= d / 2) < 1
                return c / 2 * t * t + b

            return -c / 2 * ((--t) * (t - 2) - 1) + b

    #export to global.
    exports.f.Easing = Easing
