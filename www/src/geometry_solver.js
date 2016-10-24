import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';

var GeometrySolver = function (sequenceParser) {
  let chordLength  = 100; // Distance between nodes. This is the common chord length on all circles.
                          // This is just a chosen base value. It will be normalized to screen coordinates
                          // when asked for it. We could not have pre guessed the structures size anyway.

  var points  = [];
  var centers = [];
  let subStructures = sequenceParser.getSubStructures();
  subStructures.forEach((subStructure) => {
    let theta  = AngleConverter.toRad(360) / subStructure.getNumNodes(true);
    let radius = (chordLength/2) / Math.sin(theta/2);
    let center = Vector.create(0, 0);

    let subPoints = subStructure.getNodes(true).map((node, idx) => {
      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(Vector.create(radius, 0)));
      matrixTransforms.append(m => m.rotate((idx+0.5)*theta));
      return matrixTransforms.transformPoint(center);
    });

    let opened = subStructure.openedAt();
    let closed = subStructure.closedAt();
    if ((opened!==null) && (closed!==null)) {
      let subOpened = subPoints[0];
      let subClosed = subPoints[subPoints.length-1];

      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(points[opened].subtract(subOpened)));

      subClosed = matrixTransforms.transformPoint(subClosed);
      let angle =  subClosed.subtract(points[opened]).angleFrom(points[closed].subtract(points[opened]));
      matrixTransforms.append(m => m.translate(points[opened].negate()));
      matrixTransforms.append(m => m.rotate(angle));
      matrixTransforms.append(m => m.translate(points[opened]));

      subPoints = subPoints.map(point => matrixTransforms.transformPoint(point));
      center    = matrixTransforms.transformPoint(center);
    }
    subStructure.getNodes(true).forEach((node, idx) => {
      points[node] = subPoints[idx];
    });
    centers.push(center);
  });

  let min = points.reduce((min, vec) => min.min(vec), Vector.create(   Number.MAX_VALUE,    Number.MAX_VALUE));
  let max = points.reduce((max, vec) => max.max(vec), Vector.create(-1*Number.MAX_VALUE, -1*Number.MAX_VALUE));

  let matrixTransforms = MatrixTransformations.create();

  let negMid = min.add(max).scale(0.5).negate();
  matrixTransforms.append(m => m.translate(negMid));

  var {x: diffW, y: diffH} = max.subtract(min).asObj();
  if (diffW < diffH) {
    // Rotate by 90 deg if width is less than height. Most screens have larger width.
    matrixTransforms.append(m => m.rotate(AngleConverter.toRad(-90)));
    [diffW, diffH] = [diffH, diffW];
  }

  points = points.map((point) => {
    return matrixTransforms.transformPoint(point);
  });

  return {
    getCoordinates : (width, height, modelTransforms) => {
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
        points:  points.map(point   => matrixTransforms.transformPoint(point)),
        centers: centers.map(center => matrixTransforms.transformPoint(center))
      };
    }
  };
};

export default GeometrySolver;
