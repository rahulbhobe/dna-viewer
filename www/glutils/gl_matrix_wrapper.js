import {vec2 as Vec2, mat2d as Mat2d} from 'gl-matrix';

class Vector {
  constructor(x, y) {
    x = x || 0;
    y = y || 0;
    this.v = Vec2.fromValues(x, y);
  };

  add(o) {
    Vec2.add(this.v, this.v, o);
    return this;
  };

  subtract(o) {
    Vec2.subtract(this.v, this.v, o);
    return this;
  };

  transform(mat) {
    Vec2.transformMat2d(this.v, this.v, mat.m);
    return this;
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

  translate(x, y) {
    Mat2d.translate(this.m, this.m, Vec2.fromValues(x, y));
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

export {Matrix, Vector};
