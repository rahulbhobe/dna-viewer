var GeometrySolver = function (sequenceParser) {
  var distance     = 35; // Distance between nodes.

  var getThetaFromBase = function (base) {
    var subStructure = sequenceParser.getSubStructureAtIndex(base.getIndex());
    return (2 * Math.PI) / subStructure.getNumNodes(true);
  };

  var getRadiusFromTheta = function (theta) {
    return (distance*0.5) / Math.sin(theta/2);
  };

  var getDistanceToMoveCenter = function (theta) {
    return 0.5 * distance / Math.tan(theta/2);
  };

  var centerPosition = Vector.create([700, 400]); // Start position for the center.

  var prevPoint = null;
  var prevBase = null;
  var prevTheta = null;
  var coordinates = [];
  _(sequenceParser.getBases()).each(function (base) {
    var thisTheta = getThetaFromBase(base);
    prevPoint = prevPoint || centerPosition.add(Vector.create([0, -1]).multiply(getRadiusFromTheta(thisTheta)));

    if (prevBase && !prevBase.isUnpaired()) {
      var kkk = getDistanceToMoveCenter(thisTheta) + getDistanceToMoveCenter(prevTheta);
      var point = prevPoint.rotate(prevTheta/2, centerPosition);
      var vec   = point.subtract(centerPosition).toUnitVector().multiply(kkk);
      centerPosition = centerPosition.add(vec);
    }

    var thisPoint = prevPoint.rotate(thisTheta, centerPosition);
    coordinates.push(thisPoint);
    prevPoint = thisPoint; // For next iteration.
    prevBase = base;
    prevTheta = thisTheta;
  });

  return {
    getCoordinates : function() {
      return coordinates;
    }
  };
};
