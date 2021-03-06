//@ sourceMappingURL=f.math.map
// Generated by CoffeeScript 1.6.1
/*
    @require f.core.js

    Copyright (c) 2012 Kazuya Hiruma
    Licensed under the MIT License:
    http://www.opensource.org/licenses/mit-license.php

    @author   Kazuya Hiruma (http://css-eblog.com/)
    @version  0.0.1
    @github   https://github.com/edom18/f.js
*/

var __slice = [].slice;

(function(win, doc, exports) {
  var M22, M44, MeshMgr, PI, PerlinNoise, Point, Vector3, Vertex, XorEnc, Xorshift, atan2, cos, drawTriangles, floor, interpolate, limit, max, min, pow, random, sin, sqrt;
  max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, pow = Math.pow, atan2 = Math.atan2, floor = Math.floor, random = Math.random, PI = Math.PI;
  Point = (function() {

    function Point(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Point.prototype.add = function(p) {
      return Point.add(this, p);
    };

    Point.prototype.subtract = function(p) {
      return Point.subtract(this, p);
    };

    Point.prototype.equals = function(p) {
      return Point.equals(this, p);
    };

    Point.prototype.angle = function() {
      return Point.angle(this);
    };

    Point.prototype.distance = function(p) {
      return Point.distance(this, p);
    };

    Point.prototype.dot = function(p) {
      return Point.dot(this, p);
    };

    Point.prototype.cross = function(p) {
      return Point.cross(this, p);
    };

    Point.prototype.interpolate = function(p, x) {
      return Point.interpolate(this, p, x);
    };

    Point.prototype.length = function() {
      return sqrt(this.x * this.x + this.y * this.y);
    };

    Point.prototype.normalize = function(tick) {
      var len;
      if (tick == null) {
        tick = 1;
      }
      len = this.length();
      this.x = this.x / len * tick;
      this.y = this.y / len * tick;
      return this;
    };

    Point.prototype.toString = function() {
      return "x: " + this.x + ", y: " + this.y;
    };

    Point.add = function(p1, p2) {
      return new Point(p1.x + p2.x, p1.y + p2.y);
    };

    Point.subtract = function(p1, p2) {
      return new Point(p1.x - p2.x, p1.y - p2.y);
    };

    Point.equals = function(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
    };

    Point.angle = function(p) {
      return atan2(p.y, p.x);
    };

    Point.distance = function(p1, p2) {
      var dx, dy;
      dx = p1.x - p2.x;
      dy = p1.y - p2.y;
      return sqrt(dx * dx + dy * dy);
    };

    Point.dot = function(p1, p2) {
      return p1.x * p2.x + p1.y * p2.y;
    };

    Point.cross = function(p1, p2) {
      return p1.x * p2.y - p1.y * p2.x;
    };

    Point.interpolate = function(p1, p2, x) {
      var a, b, f;
      a = p2.x - p1.x;
      b = p2.y - p1.y;
      f = (1.0 - cos(x * 3.1415927)) * 0.5;
      return a * (1.0 - f) + b * f;
    };

    return Point;

  })();
  XorEnc = (function() {

    function XorEnc(seed) {
      this.seed = seed != null ? seed : '123456789';
    }

    XorEnc.prototype.encode = function(str) {
      var i, ret, _i, _ref;
      ret = [];
      for (i = _i = 0, _ref = url.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        ret.push(url.charCodeAt(i) ^ this.seed);
      }
      return ret;
    };

    XorEnc.prototype.decode = function(encArr) {
      var a, ret, _i, _len;
      ret = '';
      for (_i = 0, _len = encArr.length; _i < _len; _i++) {
        a = encArr[_i];
        ret += String.fromCharCode(a ^ this.seed);
      }
      return ret;
    };

    return XorEnc;

  })();
  Xorshift = (function() {

    function Xorshift(seed) {
      var i, t, vec, w, x, y, z, _i;
      if (seed == null) {
        seed = +(new Date);
      }
      x = 123456789;
      y = 362436069;
      z = 521288629;
      w = 88675123;
      t = 0;
      vec = [1812433254, 3713160357, 3109174145, 64984499];
      for (i = _i = 0; _i <= 4; i = ++_i) {
        vec[i - 1] = seed = 1812433253 * (seed ^ (seed >> 30)) + i;
      }
      this.random = function() {
        var _ref;
        t = vec[0];
        w = vec[3];
        _ref = [vec[1], vec[2], w], vec[0] = _ref[0], vec[1] = _ref[1], vec[2] = _ref[2];
        t ^= t << 11;
        t ^= t >> 8;
        w ^= w >> 19;
        w ^= t;
        vec[3] = w;
        return w * 2.3283064365386963e-10;
      };
    }

    return Xorshift;

  })();
  /*
      Improved Noise reference implementation
      @url http://mrl.nyu.edu/~perlin/noise/
      Created by Ken Perlin
  */

  PerlinNoise = (function() {

    function PerlinNoise(seed, octave) {
      var i, p, _i, _j, _p;
      this.octave = octave != null ? octave : 1;
      random = new Xorshift(seed).random;
      _p = [];
      for (i = _i = 0; _i < 256; i = ++_i) {
        _p[i] = floor(random() * 256);
      }
      p = new Array(512);
      for (i = _j = 0; _j < 512; i = ++_j) {
        p[i] = _p[i & 255];
      }
      this.p = p;
    }

    PerlinNoise.prototype._noise = function(x, y, z) {
      var A, AA, AB, B, BA, BB, X, Y, Z, p, u, v, w;
      if (y == null) {
        y = 0;
      }
      if (z == null) {
        z = 0;
      }
      X = floor(x) & 255;
      Y = floor(y) & 255;
      Z = floor(z) & 255;
      x -= floor(x);
      y -= floor(y);
      z -= floor(z);
      u = this.fade(x);
      v = this.fade(y);
      w = this.fade(z);
      p = this.p;
      A = p[X + 0] + Y;
      AA = p[A] + Z;
      AB = p[A + 1] + Z;
      B = p[X + 1] + Y;
      BA = p[B] + Z;
      BB = p[B + 1] + Z;
      return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA + 0], x + 0, y + 0, z + 0), this.grad(p[BA + 0], x - 1, y + 0, z + 0)), this.lerp(u, this.grad(p[AB + 0], x + 0, y - 1, z + 0), this.grad(p[BB + 0], x - 1, y - 1, z + 0))), this.lerp(v, this.lerp(u, this.grad(p[AA + 1], x + 0, y + 0, z - 1), this.grad(p[BA + 1], x - 1, y + 0, z - 1)), this.lerp(u, this.grad(p[AB + 1], x + 0, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))));
    };

    PerlinNoise.prototype.fade = function(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    };

    PerlinNoise.prototype.lerp = function(t, a, b) {
      return a + t * (b - a);
    };

    PerlinNoise.prototype.grad = function(hash, x, y, z) {
      var h, u, v;
      h = hash & 15;
      u = h < 8 ? x : y;
      v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };

    PerlinNoise.prototype.octaves = function(octave) {
      if (octave) {
        return this.octave = octave;
      } else {
        return this.octave;
      }
    };

    PerlinNoise.prototype.noise = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      switch (args.length) {
        case 1:
          return this.octaveNoise1.apply(this, arguments);
        case 2:
          return this.octaveNoise2.apply(this, arguments);
        case 3:
          return this.octaveNoise3.apply(this, arguments);
      }
    };

    PerlinNoise.prototype.octaveNoise1 = function(x) {
      var amp, i, result, _i, _ref;
      result = 0.0;
      amp = 1.0;
      for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result += this._noise(x) * amp;
        x *= 2.0;
        amp *= 0.5;
      }
      return result;
    };

    PerlinNoise.prototype.octaveNoise2 = function(x, y) {
      var amp, i, result, _i, _ref;
      result = 0.0;
      amp = 1.0;
      for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result += this._noise(x, y) * amp;
        x *= 2.0;
        y *= 2.0;
        amp *= 0.5;
      }
      return result;
    };

    PerlinNoise.prototype.octaveNoise3 = function(x, y, z) {
      var amp, i, result, _i, _ref;
      result = 0.0;
      amp = 1.0;
      for (i = _i = 0, _ref = this.octave; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result += this._noise(x, y, z) * amp;
        x *= 2.0;
        y *= 2.0;
        z *= 2.0;
        amp *= 0.5;
      }
      return result;
    };

    return PerlinNoise;

  })();
  Vector3 = (function() {

    function Vector3(x, y, z) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.z = z != null ? z : 0;
    }

    Vector3.prototype.zero = function() {
      return this.x = this.y = this.z = 0;
    };

    Vector3.prototype.sub = function(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
    };

    Vector3.prototype.add = function(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    };

    Vector3.prototype.copy = function(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    };

    Vector3.prototype.norm = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };

    Vector3.prototype.normalize = function() {
      var nrm;
      nrm = this.norm();
      if (nrm !== 0) {
        this.x /= nrm;
        this.y /= nrm;
        this.z /= nrm;
      }
      return this;
    };

    Vector3.prototype.multiply = function(v) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      return this;
    };

    Vector3.prototype.multiplyScalar = function(s) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    };

    Vector3.prototype.multiplyVectors = function(a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      return this.z = a.z * b.z;
    };

    Vector3.prototype.dot = function(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    Vector3.prototype.cross = function(v, w) {
      if (w) {
        return this.crossVector(v, w);
      }
      this.x = (this.y * v.z) - (this.z * v.y);
      this.y = (this.z * v.x) - (this.x * v.z);
      this.z = (this.x * v.y) - (this.y * v.x);
      return this;
    };

    Vector3.prototype.crossVector = function(v, w) {
      this.x = (w.y * v.z) - (w.z * v.y);
      this.y = (w.z * v.x) - (w.x * v.z);
      this.z = (w.x * v.y) - (w.y * v.x);
      return this;
    };

    Vector3.prototype.toString = function() {
      return "" + this.x + "," + this.y + "," + this.z;
    };

    return Vector3;

  })();
  M44 = (function() {

    function M44(cpy) {
      if (cpy) {
        this.copy(cpy);
      } else {
        this.ident();
      }
    }

    M44.prototype.ident = function() {
      this._12 = this._13 = this._14 = 0;
      this._21 = this._23 = this._24 = 0;
      this._31 = this._32 = this._34 = 0;
      this._41 = this._42 = this._43 = 0;
      this._11 = this._22 = this._33 = this._44 = 1;
      return this;
    };

    M44.prototype.copy = function(m) {
      this._11 = m._11;
      this._12 = m._12;
      this._13 = m._13;
      this._14 = m._14;
      this._21 = m._21;
      this._22 = m._22;
      this._23 = m._23;
      this._24 = m._24;
      this._31 = m._31;
      this._32 = m._32;
      this._33 = m._33;
      this._34 = m._34;
      this._41 = m._41;
      this._42 = m._42;
      this._43 = m._43;
      this._44 = m._44;
      return this;
    };

    M44.prototype.transVec3 = function(out, x, y, z) {
      out[0] = x * this._11 + y * this._21 + z * this._31 + this._41;
      out[1] = x * this._12 + y * this._22 + z * this._32 + this._42;
      out[2] = x * this._13 + y * this._23 + z * this._33 + this._43;
      return out[3] = x * this._14 + y * this._24 + z * this._34 + this._44;
    };

    M44.prototype.perspectiveLH = function(vw, vh, z_near, z_far) {
      this._11 = 2.0 * z_near / vw;
      this._12 = 0;
      this._13 = 0;
      this._14 = 0;
      this._21 = 0;
      this._22 = 2 * z_near / vh;
      this._23 = 0;
      this._24 = 0;
      this._31 = 0;
      this._32 = 0;
      this._33 = z_far / (z_far - z_near);
      this._34 = 0;
      this._41 = 0;
      this._42 = 0;
      this._43 = z_near * z_far / (z_near - z_far);
      return this._44 = 0;
    };

    M44.prototype.mul = function(A, B) {
      this._11 = A._11 * B._11 + A._12 * B._21 + A._13 * B._31 + A._14 * B._41;
      this._12 = A._11 * B._12 + A._12 * B._22 + A._13 * B._32 + A._14 * B._42;
      this._13 = A._11 * B._13 + A._12 * B._23 + A._13 * B._33 + A._14 * B._43;
      this._14 = A._11 * B._14 + A._12 * B._24 + A._13 * B._34 + A._14 * B._44;
      this._21 = A._21 * B._11 + A._22 * B._21 + A._23 * B._31 + A._24 * B._41;
      this._22 = A._21 * B._12 + A._22 * B._22 + A._23 * B._32 + A._24 * B._42;
      this._23 = A._21 * B._13 + A._22 * B._23 + A._23 * B._33 + A._24 * B._43;
      this._24 = A._21 * B._14 + A._22 * B._24 + A._23 * B._34 + A._24 * B._44;
      this._31 = A._31 * B._11 + A._32 * B._21 + A._33 * B._31 + A._34 * B._41;
      this._32 = A._31 * B._12 + A._32 * B._22 + A._33 * B._32 + A._34 * B._42;
      this._33 = A._31 * B._13 + A._32 * B._23 + A._33 * B._33 + A._34 * B._43;
      this._34 = A._31 * B._14 + A._32 * B._24 + A._33 * B._34 + A._34 * B._44;
      this._41 = A._41 * B._11 + A._42 * B._21 + A._43 * B._31 + A._44 * B._41;
      this._42 = A._41 * B._12 + A._42 * B._22 + A._43 * B._32 + A._44 * B._42;
      this._43 = A._41 * B._13 + A._42 * B._23 + A._43 * B._33 + A._44 * B._43;
      this._44 = A._41 * B._14 + A._42 * B._24 + A._43 * B._34 + A._44 * B._44;
      return this;
    };

    M44.prototype.translate = function(x, y, z) {
      this._11 = 1;
      this._12 = 0;
      this._13 = 0;
      this._14 = 0;
      this._21 = 0;
      this._22 = 1;
      this._23 = 0;
      this._24 = 0;
      this._31 = 0;
      this._32 = 0;
      this._33 = 1;
      this._34 = 0;
      this._41 = x;
      this._42 = y;
      this._43 = z;
      this._44 = 1;
      return this;
    };

    M44.prototype.rotX = function(r) {
      this._22 = Math.cos(r);
      this._23 = Math.sin(r);
      this._32 = -this._23;
      this._33 = this._22;
      this._12 = this._13 = this._14 = this._21 = this._24 = this._31 = this._34 = this._41 = this._42 = this._43 = 0;
      this._11 = this._44 = 1;
      return this;
    };

    M44.prototype.rotY = function(r) {
      this._11 = Math.cos(r);
      this._13 = Math.sin(r);
      this._31 = -this._13;
      this._33 = this._11;
      this._12 = this._14 = this._21 = this._23 = this._24 = this._32 = this._34 = this._41 = this._42 = this._43 = 0;
      this._22 = this._44 = 1;
      return this;
    };

    return M44;

  })();
  M22 = (function() {

    function M22() {
      this._11 = 1;
      this._12 = 0;
      this._21 = 0;
      this._22 = 1;
    }

    M22.prototype.getInvert = function() {
      var det, out;
      out = new M22;
      det = this._11 * this._22 - this._12 * this._21;
      if ((0.0001 > det && det > -0.0001)) {
        return null;
      }
      out._11 = this._22 / det;
      out._22 = this._11 / det;
      out._12 = -this._12 / det;
      out._21 = -this._21 / det;
      return out;
    };

    return M22;

  })();
  MeshMgr = (function() {

    function MeshMgr(g, img, mesh) {
      this.g = g;
      this.img = img;
      this.mesh = mesh;
      this.vertex = [];
    }

    MeshMgr.prototype.addVertex = function(x, y, ux, uy, corner) {
      return this.vertex.push(new Vertex(x, y, ux, uy, corner));
    };

    MeshMgr.prototype.addIndex = function(x, y) {
      return this.index.push(x, y);
    };

    MeshMgr.prototype.getMesh = function() {
      return this.vertex;
    };

    return MeshMgr;

  })();
  Vertex = (function() {

    function Vertex(x, y, ux, uy, corner) {
      this.x = x;
      this.y = y;
      this.ux = ux;
      this.uy = uy;
      this.corner = corner;
      this.ox = x;
      this.oy = y;
    }

    return Vertex;

  })();
  drawTriangles = function(g, img, vertecies, indecies, uvData) {
    var Ax, Ay, Bx, By, a, b, c, cv, d, h, i, i0, i1, i2, index, m, mi, tx, ty, uv0, uv0x, uv0y, uv1, uv1x, uv1y, uv2, uv2x, uv2y, v0, v0x, v0y, v1, v1x, v1y, v2, v2x, v2y, w, _Ax, _Ay, _Bx, _By, _g, _i, _len;
    cv = doc.createElement('canvas');
    _g = cv.getContext('2d');
    w = img.width;
    h = img.height;
    cv.width = w;
    cv.height = h;
    for (i = _i = 0, _len = indecies.length; _i < _len; i = _i += 3) {
      index = indecies[i];
      i0 = indecies[i + 0];
      i1 = indecies[i + 1];
      i2 = indecies[i + 2];
      v0 = vertecies[i0];
      v1 = vertecies[i1];
      v2 = vertecies[i2];
      uv0 = uvData[i0];
      uv1 = uvData[i1];
      uv2 = uvData[i2];
      v0x = v0.x;
      v0y = v0.y;
      v1x = v1.x;
      v1y = v1.y;
      v2x = v2.x;
      v2y = v2.y;
      uv0x = uv0.x;
      uv0y = uv0.y;
      uv1x = uv1.x;
      uv1y = uv1.y;
      uv2x = uv2.x;
      uv2y = uv2.y;
      _Ax = v1x - v0x;
      _Ay = v1y - v0y;
      _Bx = v2x - v0x;
      _By = v2y - v0y;
      Ax = (uv1x - uv0x) * w;
      Ay = (uv1y - uv0y) * h;
      Bx = (uv2x - uv0x) * w;
      By = (uv2y - uv0y) * h;
      m = new M22;
      m._11 = Ax;
      m._12 = Ay;
      m._21 = Bx;
      m._22 = By;
      mi = m.getInvert();
      if (mi === null) {
        return;
      }
      a = mi._11 * _Ax + mi._12 * _Bx;
      c = mi._21 * _Ax + mi._22 * _Bx;
      b = mi._11 * _Ay + mi._12 * _By;
      d = mi._21 * _Ay + mi._22 * _By;
      tx = v0x - (a * uv0x * w + c * uv0y * h);
      ty = v0y - (b * uv0x * w + d * uv0y * h);
      _g.save();
      _g.beginPath();
      _g.moveTo(v0x, v0y);
      _g.lineTo(v1x, v1y);
      _g.lineTo(v2x, v2y);
      _g.clip();
      _g.closePath();
      _g.setTransform(a, b, c, d, tx, ty);
      _g.drawImage(img, 0, 0);
      _g.restore();
    }
    g.clearRect(0, 0, w, h);
    return g.drawImage(cv, 0, 0);
  };
  interpolate = function(a, b, x) {
    var f;
    f = (1.0 - cos(x * 3.1415927)) * 0.5;
    return a * (1.0 - f) + b * f;
  };
  limit = function(val, _min, _max) {
    return max(_min, min(val, _max));
  };
  exports.limit = limit;
  exports.M44 = M44;
  exports.M22 = M22;
  exports.Vector3 = Vector3;
  exports.Point = Point;
  exports.XorEnc = XorEnc;
  exports.Xorshift = Xorshift;
  return exports.PerlinNoise = PerlinNoise;
})(window, window.document, f.math || (f.math = {}));
