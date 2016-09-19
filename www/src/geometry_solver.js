import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';

var GeometrySolver = function (sequenceParser) {
  var distance     = 100; // Distance between nodes. This is the common chord length on all circles.
                          // This is just a chosen base value. It will be normalized to screen coordinates
                          // when asked for it. We could not have pre guessed the structures size anyway.

  var coordinates = [];
  var subStructures = sequenceParser.getSubStructures();
  subStructures.forEach((subStructure) => {
    var theta  = (2 * Math.PI) / subStructure.getNumNodes(true);
    var radius = (distance/2) / Math.sin(theta/2);
    var center = Vector.create(0, 0);

    var subCoordinates = subStructure.getNodes(true).map((node, idx) => {
      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(Vector.create(radius, 0)));
      matrixTransforms.append(m => m.rotate((idx+0.5)*theta));
      return matrixTransforms.transformPoint(center);
    });

    let opened = subStructure.openedAt();
    let closed = subStructure.closedAt();
    if ((opened!==null) && (closed!==null)) {
      var subOpened = subCoordinates[0];
      var subClosed = subCoordinates[subCoordinates.length-1];

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

  return {
    getCoordinates : function() {
      return coordinates;
    }
  };
};

export default GeometrySolver;
