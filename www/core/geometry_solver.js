import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';

class GeometrySolver {
  constructor (sequenceData) {
    this._points  = [];
    this._centers = [];
    this._min = null;
    this._max = null;
    this.solve(sequenceData);
  };

  solve (sequenceData) {
    let chordLength  = 100; // Distance between nodes. This is the common chord length on all circles.
                            // This is just a chosen base value. It will be normalized to screen coordinates
                            // when asked for it. We could not have pre guessed the structures size anyway.

    let subStructures = sequenceData.getSubStructures();
    subStructures.forEach((subStructure) => {
      let theta  = AngleConverter.toRad(360) / subStructure.getNumNodes(true);
      let radius = (chordLength/2) / Math.sin(theta/2);
      let center = Vector.create(0, 0);

      let subPoints = subStructure.getNodes(true).map((node, idx) => {
        let matrixTransforms = MatrixTransformations.create();
        matrixTransforms.append(m => m.translate(Vector.create(0, -1*radius)));
        matrixTransforms.append(m => m.rotate((idx+0.5)*theta));
        return matrixTransforms.transformPoint(center);
      });

      let opened = subStructure.openedAt();
      let closed = subStructure.closedAt();
      if ((opened!==null) && (closed!==null)) {
        let subOpened = subPoints[0];
        let subClosed = subPoints[subPoints.length-1];

        let matrixTransforms = MatrixTransformations.create();
        matrixTransforms.append(m => m.translate(this._points[opened].subtract(subOpened)));

        subClosed = matrixTransforms.transformPoint(subClosed);
        let angle =  subClosed.subtract(this._points[opened]).angleFrom(this._points[closed].subtract(this._points[opened]));
        matrixTransforms.append(m => m.translate(this._points[opened].negate()));
        matrixTransforms.append(m => m.rotate(angle));
        matrixTransforms.append(m => m.translate(this._points[opened]));

        subPoints = subPoints.map(point => matrixTransforms.transformPoint(point));
        center    = matrixTransforms.transformPoint(center);
      }
      subStructure.getNodes(true).forEach((node, idx) => {
        this._points[node] = subPoints[idx];
      });
      this._centers.push(center);
    });

    this._min = this._points.reduce((min, pnt) => min.min(pnt), Vector.create(   Number.MAX_VALUE,    Number.MAX_VALUE));
    this._max = this._points.reduce((max, pnt) => max.max(pnt), Vector.create(-1*Number.MAX_VALUE, -1*Number.MAX_VALUE));

    let matrixTransforms = MatrixTransformations.create();

    let negMid = this._min.add(this._max).scale(0.5).negate();
    matrixTransforms.append(m => m.translate(negMid));

    // let {x: diffW, y: diffH} = max.subtract(min).asObj();
    // if (diffW < diffH) {
    //   // Rotate by 90 deg if width is less than height. Most screens have larger width.
    //   matrixTransforms.append(m => m.rotate(AngleConverter.toRad(-90)));
    //   [diffW, diffH] = [diffH, diffW];
    // }

    this._points  = this._points.map(point   => matrixTransforms.transformPoint(point));
    this._centers = this._centers.map(center => matrixTransforms.transformPoint(center));
  };

  getCoordinates (width, height, modelTransforms) {
    let {x: diffW, y: diffH} = this._max.subtract(this._min).asObj();
    let scaleW = width  / diffW;
    let scaleH = height / diffH;
    let scale  = scaleW < scaleH ? scaleW : scaleH;
    let matrixTransforms = MatrixTransformations.create();

    matrixTransforms.append(m => m.scale(scale*0.92));

    modelTransforms = modelTransforms || MatrixTransformations.create();
    matrixTransforms.appendFromOther(modelTransforms);

    let scrMid = Vector.create(width, height).scale(0.5);
    matrixTransforms.append(m => m.translate(scrMid));

    return {
      points:  this._points.map(point   => matrixTransforms.transformPoint(point)),
      centers: this._centers.map(center => matrixTransforms.transformPoint(center))
    };
  };
};

export default GeometrySolver;
