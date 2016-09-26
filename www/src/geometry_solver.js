import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';

var GeometrySolver = function (sequenceParser) {
  let chordLength  = 100; // Distance between nodes. This is the common chord length on all circles.
                          // This is just a chosen base value. It will be normalized to screen coordinates
                          // when asked for it. We could not have pre guessed the structures size anyway.

  var coordinates = [];
  let subStructures = sequenceParser.getSubStructures();
  subStructures.forEach((subStructure) => {
    let theta  = AngleConverter.toRad(360) / subStructure.getNumNodes(true);
    let radius = (chordLength/2) / Math.sin(theta/2);
    let center = Vector.create(0, 0);

    let subCoordinates = subStructure.getNodes(true).map((node, idx) => {
      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(Vector.create(radius, 0)));
      matrixTransforms.append(m => m.rotate((idx+0.5)*theta));
      return matrixTransforms.transformPoint(center);
    });

    let opened = subStructure.openedAt();
    let closed = subStructure.closedAt();
    if ((opened!==null) && (closed!==null)) {
      let subOpened = subCoordinates[0];
      let subClosed = subCoordinates[subCoordinates.length-1];

      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(coordinates[opened].subtract(subOpened)));

      let subClosed = matrixTransforms.transformPoint(subClosed);
      let angle =  subClosed.subtract(coordinates[opened]).angleFrom(coordinates[closed].subtract(coordinates[opened]));
      matrixTransforms.append(m => m.translate(coordinates[opened].negate()));
      matrixTransforms.append(m => m.rotate(angle));
      matrixTransforms.append(m => m.translate(coordinates[opened]));

      subCoordinates = subCoordinates.map(point => matrixTransforms.transformPoint(point));
    }
    subStructure.getNodes(true).forEach((node, idx) => {
      coordinates[node] = subCoordinates[idx];
    });
  });

  let min = coordinates.reduce((min, vec) => min.min(vec), Vector.create(   Number.MAX_VALUE,    Number.MAX_VALUE));
  let max = coordinates.reduce((max, vec) => max.max(vec), Vector.create(-1*Number.MAX_VALUE, -1*Number.MAX_VALUE));

  let matrixTransforms = MatrixTransformations.create();

  let negMid = min.add(max).scale(0.5).negate();
  matrixTransforms.append(m => m.translate(negMid));

  var {x: diffW, y: diffH} = max.subtract(min).asObj();
  if (diffW < diffH) {
    // Rotate by 90 deg if width is less than height. Most screens have larger width.
    matrixTransforms.append(m => m.rotate(AngleConverter.toRad(-90)));
    [diffW, diffH] = [diffH, diffW];
  }

  coordinates = coordinates.map((point) => {
    return matrixTransforms.transformPoint(point);
  });

  return {
    getCoordinates : (width, height, modelTransforms) => {
      let scaleW = width  / diffW;
      let scaleH = height / diffH;
      let scale  = scaleW < scaleH ? scaleW : scaleH;
      let matrixTransforms = MatrixTransformations.create();

      matrixTransforms.append(m => m.scale(scale*0.92));

      matrixTransforms.appendFromOther(modelTransforms);

      let scrMid = Vector.create(width, height).scale(0.5);
      matrixTransforms.append(m => m.translate(scrMid));

      return coordinates.map((point) => {
        return matrixTransforms.transformPoint(point);
      });
    }
  };
};

export default GeometrySolver;
