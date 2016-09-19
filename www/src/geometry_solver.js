import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';

var GeometrySolver = function (sequenceParser) {
  var distance     = 100; // Distance between nodes. This is the common chord length on all circles.
                          // This is just a chosen base value. It will be normalized to screen coordinates
                          // when asked for it. We could not have pre guessed the structures size anyway.

  var coordinates = {};
  var subStructures = sequenceParser.getSubStructures();
  subStructures.forEach((subStructure) => {
    var theta  = (2 * Math.PI) / subStructure.getNumNodes(true);
    var radius = (distance/2) / Math.sin(theta/2);
    var center = Vector.create(0, 0);

    var subCoordinates = {};
    subStructure.getNodes(true).forEach((node, idx) => {
      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(Vector.create(radius, 0)));
      matrixTransforms.append(m => m.rotate((idx+0.5)*theta));
      subCoordinates[node] = matrixTransforms.transformPoint(center);
    });

    let opened = subStructure.openedAt();
    let closed = subStructure.closedAt();
    if ((opened===null) && (closed===null)) {
      coordinates = Object.assign(coordinates, subCoordinates);
    } else {
      var subOpened = subCoordinates[opened];
      var subClosed = subCoordinates[closed];

      let matrixTransforms = MatrixTransformations.create();
      matrixTransforms.append(m => m.translate(coordinates[opened].subtract(subOpened)));

      let subClosed = matrixTransforms.transformPoint(subClosed);
      let angle =  subClosed.subtract(coordinates[opened]).angleFrom(coordinates[closed].subtract(coordinates[opened]));
      matrixTransforms.append(m => m.translate(coordinates[opened].negate()));
      matrixTransforms.append(m => m.rotate(angle));
      matrixTransforms.append(m => m.translate(coordinates[opened]));

      for (let node in subCoordinates)
      {
        subCoordinates[node] = matrixTransforms.transformPoint(subCoordinates[node]);
      }
      coordinates = Object.assign(coordinates, subCoordinates);
    }
  });

  return {
    getCoordinates : function() {
      return Object.keys(coordinates).map(point => coordinates[point]);
    }
  };
};

export default GeometrySolver;
