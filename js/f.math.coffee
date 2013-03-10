###
    @require f.core.js

    Copyright (c) 2012 Kazuya Hiruma
    Licensed under the MIT License:
    http://www.opensource.org/licenses/mit-license.php

    @author   Kazuya Hiruma (http://css-eblog.com/)
    @version  0.0.1
    @github   https://github.com/edom18/f.js
###
do (win = window, doc = window.document, exports = (f.math or (f.math = {}))) ->

    {max, min, sin, cos, sqrt, pow, atan2, floor, random, PI} = Math

    class Point
        constructor: (@x = 0, @y = 0) ->

        add: (p) ->
            Point.add @, p

        subtract: (p) ->
            Point.subtract @, p

        equals: (p) ->
            Point.equals @, p

        angles: ->
            Point.angles @

        distance: (p) ->
            Point.distance @, p

        dot: (p) ->
            Point.dot @, p

        cross: (p) ->
            Point.cross @, p

        interpolate: (p, x) ->
            Point.interpolate @, p, x

        length: ->
            sqrt @x * @x + @y * @y

        normalize: ->
            len = @length()
            @x = @x / len
            @y = @y / len
            return @


        toString: ->
            "x: #{@x}, y: #{@y}"

        @add: (p1, p2) ->
            new Point p1.x + p2.x, p1.y + p2.y

        @subtract: (p1, p2) ->
            new Point p1.x - p2.x, p1.y - p2.y

        @equals: (p1, p2) ->
            (p1.x is p2.x and p1.y is p2.y)

        @angles: (p) ->
            atan2 p.y, p.x

        @distance: (p1, p2) ->
            dx = p1.x - p2.x
            dy = p1.y - p2.y
            sqrt dx * dx + dy * dy

        @dot: (p1, p2) ->
            p1.x * p2.x + p1.y * p2.y

        @cross: (p1, p2) ->
            p1.x * p2.y - p1.y * p2.x

        @interpolate: (p1, p2, x) ->
            a = p2.x - p1.x
            b = p2.y - p1.y
            f = (1.0 - cos(x * 3.1415927)) * 0.5
            return a * (1.0 - f) + b * f

    # ---------------------------------------------------------

    class Xorshift
        constructor: (seed = +new Date)->
            x = 123456789
            y = 362436069
            z = 521288629
            w = 88675123
            t = 0
            vec = [ 1812433254, 3713160357, 3109174145, 64984499 ]

            for i in [0..4]
                vec[i - 1] = seed = 1812433253 * (seed ^ (seed >> 30)) + i

            @random = ->
                t = vec[0]
                w = vec[3]

                [vec[0], vec[1], vec[2]] = [vec[1], vec[2], w]

                t ^= t << 11
                t ^= t >> 8
                w ^= w >> 19
                w ^= t
                vec[3] = w

                return w * 2.3283064365386963e-10

    ###
        Improved Noise reference implementation
        @url http://mrl.nyu.edu/~perlin/noise/
        Created by Ken Perlin
    ###
    class PerlinNoise
        constructor: (seed) ->
            #seed = new Xorshift().random() * 100 if not seed
            random = new Xorshift().random

            _p = []
            for i in [0...256]
                _p[i] = floor random() * 256

            p = new Array 512
            for i in [0...512]
                p[i] = _p[i & 255]

            @p = p

        noise: (x, y = 0, z = 0) ->
            X = floor(x) & 255
            Y = floor(y) & 255
            Z = floor(z) & 255

            x -= floor x
            y -= floor y
            z -= floor z

            u = @fade x
            v = @fade y
            w = @fade z

            p = @p

            A = p[X + 0] + Y; AA = p[A] + Z; AB = p[A + 1] + Z
            B = p[X + 1] + Y; BA = p[B] + Z; BB = p[B + 1] + Z
            
            return @lerp(w, @lerp(v, @lerp(u, @grad(p[AA + 0], x + 0, y + 0, z + 0),
                                              @grad(p[BA + 0], x - 1, y + 0, z + 0)),
                                     @lerp(u, @grad(p[AB + 0], x + 0, y - 1, z + 0),
                                              @grad(p[BB + 0], x - 1, y - 1, z + 0))),
                            @lerp(v, @lerp(u, @grad(p[AA + 1], x + 0, y + 0, z - 1),
                                              @grad(p[BA + 1], x - 1, y + 0, z - 1)),
                                     @lerp(u, @grad(p[AB + 1], x + 0, y - 1, z - 1),
                                              @grad(p[BB + 1], x - 1, y - 1, z - 1))))

        fade: (t) ->
            return t * t * t * (t * (t * 6 -15) + 10)

        lerp: (t, a, b) ->
            return a + t * (b - a)

        grad: (hash, x, y, z) ->
            h = hash & 15
            u = if h < 8 then x else y
            v = if h < 4 then y else if h is 12 or h is 14 then x else z
            return (if (h & 1) is 0 then u else -u) + (if (h & 2) is 0 then v else -v)

        octaves: (octave) ->
            if octave
                @octave = octave
            else
                @octave

        octaveNoise: (x, args...) ->
            switch args.length
                when 1
                    return @octaveNoise1.apply @, arguments
                when 2
                    return @octaveNoise2.apply @, arguments
                when 3
                    return @octaveNoise3.apply @, arguments

        octaveNoise1: (x, octaves) ->
            result = 0.0
            amp = 1.0

            for i in [0...octaves]
                result += @noise(x) * amp
                x *= 2.0
                amp *= 0.5

            return result

        octaveNoise2: (x, y, octaves) ->
            result = 0.0
            amp = 1.0

            for i in [0...octaves]
                result += @noise(x, y) * amp
                x *= 2.0
                y *= 2.0
                amp *= 0.5

            return result

        octaveNoise3: (x, y, z, octaves) ->
            result = 0.0
            amp = 1.0

            for i in [0...octaves]
                result += @noise(x, y, z) * amp
                x *= 2.0
                y *= 2.0
                z *= 2.0
                amp *= 0.5

            return result

    class Vec3
        constructor: (@x = 0, @y = 0, @z = 0) ->
        zero: ->
            @x = @y = @z = 0;

        sub: (v) ->
            @x -= v.x
            @y -= v.y
            @z -= v.z
            return @

        add: (v) ->
            @x += v.x
            @y += v.y
            @z += v.z
            return @

        copyFrom: (v) ->
            @x = v.x
            @y = v.y
            @z = v.z
            return @

        norm: ->
            Math.sqrt(@x * @x + @y * @y + @z * @z)

        normalize: ->
            nrm = @norm()
            if nrm isnt 0
                @x /= nrm
                @y /= nrm
                @z /= nrm

            return @

        #scalar multiplication
        smul: (k) ->
            @x *= k
            @y *= k
            @z *= k
            return @

        #dot product
        dpWith: (v) ->
            @x * v.x + @y * v.y + @z * v.z

        #cross product
        cp: (v, w) ->
            @x = (w.y * v.z) - (w.z * v.y)
            @y = (w.z * v.x) - (w.x * v.z)
            @z = (w.x * v.y) - (w.y * v.x)
            return @

        toString: ->
            "#{@x},#{@y},#{@z}"

# -----------------------------------------------------------

    class M44
        constructor: (cpy)->
            if cpy?
                @copyFrom(cpy)
            else
                @ident()

        ident: ->
            @_12 = @_13 = @_14 = 0

            @_21 = @_23 = @_24 = 0
            @_31 = @_32 = @_34 = 0
            @_41 = @_42 = @_43 = 0

            @_11 = @_22 = @_33 = @_44 = 1

            return @

        copyFrom: (m) ->
            @_11 = m._11
            @_12 = m._12
            @_13 = m._13
            @_14 = m._14

            @_21 = m._21
            @_22 = m._22
            @_23 = m._23
            @_24 = m._24

            @_31 = m._31
            @_32 = m._32
            @_33 = m._33
            @_34 = m._34

            @_41 = m._41
            @_42 = m._42
            @_43 = m._43
            @_44 = m._44

            return @

        transVec3: (out, x, y, z) ->
            out[0] = x * @_11 + y * @_21 + z * @_31 + @_41
            out[1] = x * @_12 + y * @_22 + z * @_32 + @_42
            out[2] = x * @_13 + y * @_23 + z * @_33 + @_43
            out[3] = x * @_14 + y * @_24 + z * @_34 + @_44

        perspectiveLH: (vw, vh, z_near, z_far) ->
            @_11 = 2.0 * z_near / vw
            @_12 = 0
            @_13 = 0
            @_14 = 0

            @_21 = 0
            @_22 = 2 * z_near / vh
            @_23 = 0
            @_24 = 0

            @_31 = 0
            @_32 = 0
            @_33 = z_far / (z_far - z_near)
            @_34 = 0

            @_41 = 0
            @_42 = 0
            @_43 = z_near * z_far / (z_near - z_far)
            @_44 = 0

        #multiplication
        mul: (A, B) ->
            @_11 = A._11 * B._11 + A._12 * B._21 + A._13 * B._31 + A._14 * B._41
            @_12 = A._11 * B._12 + A._12 * B._22 + A._13 * B._32 + A._14 * B._42
            @_13 = A._11 * B._13 + A._12 * B._23 + A._13 * B._33 + A._14 * B._43
            @_14 = A._11 * B._14 + A._12 * B._24 + A._13 * B._34 + A._14 * B._44

            @_21 = A._21 * B._11 + A._22 * B._21 + A._23 * B._31 + A._24 * B._41
            @_22 = A._21 * B._12 + A._22 * B._22 + A._23 * B._32 + A._24 * B._42
            @_23 = A._21 * B._13 + A._22 * B._23 + A._23 * B._33 + A._24 * B._43
            @_24 = A._21 * B._14 + A._22 * B._24 + A._23 * B._34 + A._24 * B._44

            @_31 = A._31 * B._11 + A._32 * B._21 + A._33 * B._31 + A._34 * B._41
            @_32 = A._31 * B._12 + A._32 * B._22 + A._33 * B._32 + A._34 * B._42
            @_33 = A._31 * B._13 + A._32 * B._23 + A._33 * B._33 + A._34 * B._43
            @_34 = A._31 * B._14 + A._32 * B._24 + A._33 * B._34 + A._34 * B._44

            @_41 = A._41 * B._11 + A._42 * B._21 + A._43 * B._31 + A._44 * B._41
            @_42 = A._41 * B._12 + A._42 * B._22 + A._43 * B._32 + A._44 * B._42
            @_43 = A._41 * B._13 + A._42 * B._23 + A._43 * B._33 + A._44 * B._43
            @_44 = A._41 * B._14 + A._42 * B._24 + A._43 * B._34 + A._44 * B._44

            return @

        translate: (x, y, z) ->
            @_11 = 1; @_12 = 0; @_13 = 0; @_14 = 0;
            @_21 = 0; @_22 = 1; @_23 = 0; @_24 = 0;
            @_31 = 0; @_32 = 0; @_33 = 1; @_34 = 0;

            @_41 = x; @_42 = y; @_43 = z; @_44 = 1;
            return @

        rotX: (r) ->
            @_22 = Math.cos(r)
            @_23 = Math.sin(r)
            @_32 = -@_23
            @_33 = @_22

            @_12 = @_13 = @_14 = @_21 = @_24 = @_31 = @_34 = @_41 = @_42 = @_43 = 0
            @_11 = @_44 = 1

            return @

        rotY: (r) ->
            @_11 = Math.cos(r)
            @_13 = Math.sin(r)
            @_31 = -@_13
            @_33 = @_11

            @_12 = @_14 = @_21 = @_23 = @_24 = @_32 = @_34 = @_41 = @_42 = @_43 = 0
            @_22 = @_44 = 1

            return @

# -----------------------------------------------------------

    class M22
        constructor: ->
            @_11 = 1
            @_12 = 0
            @_21 = 0
            @_22 = 1

        getInvert: ->
            out = new M22
            det = @_11 * @_22 - @_12 * @_21

            if 0.0001 > det > -0.0001
                return null

            out._11 = @_22 / det
            out._22 = @_11 / det

            out._12 = @_12 / det
            out._21 = @_21 / det

            return out

# -----------------------------------------------------------

    class MeshMgr
        constructor: (@g, @img, @mesh) ->
            @vertex = []

        addVertex: (x, y, ux, uy, corner) ->
            @vertex.push(new Vertex x, y, ux, uy, corner);

        addIndex: (x, y) ->
            @index.push(x, y);

        getMesh: ->
            return @vertex

# -----------------------------------------------------------

    class Vertex
        constructor: (@x, @y, @ux, @uy, @corner) ->
            @ox = x
            @oy = y

# ---------------------------------------------------------

    drawTriangles = (g, img, vertecies, indecies, uvData) ->
        cv = doc.createElement 'canvas'
        _g = cv.getContext '2d'

        w = img.width
        h = img.height

        cv.width  = w
        cv.height = h

        for index, i in indecies by 3
            i0 = indecies[i + 0]
            i1 = indecies[i + 1]
            i2 = indecies[i + 2]

            v0 = vertecies[i0]
            v1 = vertecies[i1]
            v2 = vertecies[i2]

            uv0 = uvData[i0]
            uv1 = uvData[i1]
            uv2 = uvData[i2]
            
            v0x = v0.x; v0y = v0.y
            v1x = v1.x; v1y = v1.y
            v2x = v2.x; v2y = v2.y

            uv0x = uv0.x; uv0y = uv0.y
            uv1x = uv1.x; uv1y = uv1.y
            uv2x = uv2.x; uv2y = uv2.y

            _Ax = v1x - v0x; _Ay = v1y - v0y
            _Bx = v2x - v0x; _By = v2y - v0y

            Ax = (uv1x - uv0x) * w; Ay = (uv1y - uv0y) * h
            Bx = (uv2x - uv0x) * w; By = (uv2y - uv0y) * h

            # move position from A(Ax, Ay) to _A(_Ax, _Ay)
            # move position from B(Ax, Ay) to _B(_Bx', _By)
            # A,Bのベクトルを、_A,_Bのベクトルに変換することが目的。
            # 変換を達成するには、a, b, c, dそれぞれの係数を導き出す必要がある。
            #
            #    ↓まずは公式。アフィン変換の移動以外を考える。
            #
            # _Ax = a * Ax + c * Ay
            # _Ay = b * Ax + d * Ay
            # _Bx = a * Bx + c * By
            # _By = b * Bx + d * By
            #
            #    ↓上記の公式を行列の計算で表すと以下に。
            #
            # |_Ax| = |Ax Ay||a|
            # |_Bx| = |Bx By||c|
            #
            #    ↓a, cについて求めたいのだから、左に掛けているものを「1」にする必要がある。
            #    　行列を1にするには、逆行列を左から掛ければいいので、両辺に逆行列を掛ける。（^-1は逆行列の意味）
            #
            # |Ax Ay|^-1 |_Ax| = |a|
            # |Bx By|    |_Bx| = |c|

            m = new M22
            m._11 = Ax; m._12 = Ay
            m._21 = Bx; m._22 = By

            #To invert
            mi = m.getInvert() 

            if mi is null then return

            a = mi._11 * _Ax + mi._12 * _Bx
            c = mi._21 * _Ax + mi._22 * _Bx

            b = mi._11 * _Ay + mi._12 * _By
            d = mi._21 * _Ay + mi._22 * _By

            tx = v0x - (a * uv0x * w + c * uv0y * h)
            ty = v0y - (b * uv0x * w + d * uv0y * h)

            _g.save()
            _g.beginPath()
            _g.moveTo v0x, v0y
            _g.lineTo v1x, v1y
            _g.lineTo v2x, v2y

            _g.clip()
            _g.closePath()

            _g.setTransform a, b, c, d, tx, ty
            _g.drawImage img, 0, 0
            _g.restore()

        g.clearRect 0, 0, w, h
        g.drawImage cv, 0, 0


    # ----------------------------------------------------

    interpolate = (a, b, x) ->
        f = (1.0 - cos(x * 3.1415927)) * 0.5
        return a * (1.0 - f) + b * f

    # ----------------------------------------------------

    limit = (val, _min, _max) ->
        return max(_min, min(val, _max))

    # ----------------------------------------------------
    #   EXPORTS to f.math.
    # ----------------------------------------------------

    # methos
    exports.limit = limit

    # classes
    exports.M44   = M44
    exports.M22   = M22
    exports.Vec3  = Vec3
    exports.Point = Point
    exports.Xorshift    = Xorshift
    exports.PerlinNoise = PerlinNoise
