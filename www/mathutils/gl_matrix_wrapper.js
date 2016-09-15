import {vec2 as Vec2, vec3 as Vec3, mat2d as Mat2d} from 'gl-matrix';

class Vector {
  constructor(x, y) {
    x = x || 0;
    y = y || 0;
    this.v = Vec2.fromValues(x, y);
  };

  static create(x, y) {
    return new Vector(x, y);
  };

  clone() {
    var r = Vector.create();
    Vec2.copy(r.v, this.v);
    return r;
  };

  add(b) {
    var r = Vector.create();
    Vec2.add(r.v, this.v, b.v);
    return r;
  };

  subtract(b) {
    var r = Vector.create();
    Vec2.subtract(r.v, this.v, b.v);
    return r;
  };

  scale(val) {
    var r = Vector.create();
    Vec2.scale(r.v, this.v, val);
    return r;
  };

  negate() {
    var r = Vector.create();
    Vec2.negate(r.v, this.v);
    return r;
  };

  normalize() {
    var r = Vector.create();
    Vec2.normalize(r.v, this.v);
    return r;
  };

  min(b) {
    var r = Vector.create();
    Vec2.min(r.v, this.v, b.v);
    return r;
  };

  max(b) {
    var r = Vector.create();
    Vec2.max(r.v, this.v, b.v);
    return r;
  };

  angleFrom(b) {
    var c = Vec3.fromValues(0, 0, 0);
    Vec2.cross(c, this.v, b.v);
    var sign = c[2] > 0 ? 1 : -1;
    var cos  = this.dot(b) / (this.length() * b.length());
    return sign * Math.acos(cos);
  };

  length() {
    return Vec2.length(this.v);
  };

  dot(b) {
    return Vec2.dot(this.v, b.v);
  };

  rotate(rad, b) {
    var matrixTransformations = MatrixTransformations.create();

    var n = b.scale(-1);
    matrixTransformations.append(m => m.translate(n));
    matrixTransformations.append(m => m.rotate(rad));
    matrixTransformations.append(m => m.translate(b));
    return matrixTransformations.transformPoint(this);
  };

  transform(mat) {
    var r = Vector.create();
    Vec2.transformMat2d(r.v, this.v, mat.m);
    return r;
  };

  asObj() {
    return {
      x: this.v[0],
      y: this.v[1]
    };
  };

  asArr() {
    return [
      this.v[0],
      this.v[1]
    ];
  };
};

class Matrix {
  constructor() {
    this.m = Mat2d.create();
  };

  static create() {
    return new Matrix();
  };

  translate(point) {
    Mat2d.translate(this.m, this.m, point.v);
    return this;
  };

  rotate(rad) {
    Mat2d.rotate(this.m, this.m, rad);
    return this;
  };

  scale(val) {
    Mat2d.scale(this.m, this.m, Vec2.fromValues(val, val));
    return this;
  };
};

class MatrixTransformations {
  constructor() {
    this.t = [];
  };

  static create() {
    return new MatrixTransformations();
  };

  append(t) {
    this.t.push(t);
  };

  transformPoint(point) {
    var matrix = this.t.reduceRight((matrix, trf)=>trf(matrix), Matrix.create());
    return point.transform(matrix);
  };
};

export {Vector, Matrix, MatrixTransformations};