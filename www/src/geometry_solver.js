import _ from 'underscore';

var GeometrySolver = function (sequenceParser) {
  var distance     = 100; // Distance between nodes.
                          // Common chord length on all circles.
                          // Some base value. This will be normalized to screen coordinates
                          // when asked for it. Could not have pre guessed the structures size any way.

  var getThetaFromBase = function (base) {
    var subStructure = sequenceParser.getSubStructureAtIndex(base.getIndex());
    return (2 * Math.PI) / subStructure.getNumNodes(true);
  };

  var getRadiusFromTheta = function (theta) {
    // Chord length is "distance" and "theta" is the angle at the center.
    // (distance/2) / sin(theta/2)
    return (distance*0.5) / Math.sin(theta/2);
  };

  var getDistanceToChord = function (theta) {
    // Chord length is "distance" and "theta" is the angle at the center.
    // Need the distance to chord from center.
    // (radius) * cos(theta/2)
    return getRadiusFromTheta(theta) * Math.cos(theta/2);
  };

  var centerPosition = Vector.create([0, 0]); // Start position for the center.

  var moveCenter = false;
  var prevPoint  = null;
  var prevTheta  = null;
  var coordinates = [];
  _(sequenceParser.getBases()).each(function (base) {
    var thisTheta = getThetaFromBase(base);

    if (moveCenter) {
      // Two intersecting circles with common chord length "distance".
      var distanceBetweenCenters = getDistanceToChord(thisTheta) + getDistanceToChord(prevTheta);
      var point = prevPoint.rotate(prevTheta/2, centerPosition); // Rotate to align with the "other" circle.
      var vec   = point.subtract(centerPosition).toUnitVector().multiply(distanceBetweenCenters);
      centerPosition = centerPosition.add(vec);
    }

    var thisPoint = null;
    if (prevPoint) {
      thisPoint = prevPoint.rotate(thisTheta, centerPosition);
    } else {
      // Start point. Center is chosen (see above). Radius is known. Create a point at a chosen angle.
      thisPoint = centerPosition.add(Vector.create([0, -1]).multiply(getRadiusFromTheta(thisTheta)));
    }

    coordinates.push(thisPoint);
    prevPoint = thisPoint; // For next iteration.
    prevTheta = thisTheta;
    moveCenter = !base.isUnpaired(); // Done with current "structure". May visit back after completing "inner" structures.
  });

  return {
    getCoordinates : function() {
      return coordinates;
    }
  };
};

export default GeometrySolver;
