var GeometrySolver = function(sequenceParser) {
  var distance     = 35; // Distance between nodes.

  var getThetaFromStructure = function(subStructure) {
    return (2 * Math.PI) / subStructure.getNumNodes(true);
  };

  var getDistanceToMoveCenter = function(subStructure) {
    var theta = getThetaFromStructure(subStructure);
    return 0.5 * distance / Math.tan(theta/2);
  };

  var centerPosition = Vector.create([700, 400]); // Start position for the center.

  var prevSubStructure = sequenceParser.getSubStructureAtIndex(0);
  // Dummy start point (will end up being the last point in the entire traversal - by design).
  var previousPoint  = centerPosition.add(Vector.create([0, -1]).multiply((distance * 0.5) / Math.sin(getThetaFromStructure(prevSubStructure) / 2)));

  var prevBase = null;
  var coordinates = [];
  _(sequenceParser.getBases()).each(function (base) {
    var thisSubStructure = sequenceParser.getSubStructureAtIndex(base.getIndex());

    if (prevBase && !prevBase.isUnpaired()) {
      var kkk = getDistanceToMoveCenter(thisSubStructure) + getDistanceToMoveCenter(prevSubStructure);
      angle = getThetaFromStructure(prevSubStructure) / 2;
      var point = previousPoint.rotate(angle, centerPosition);
      var vec   = point.subtract(centerPosition).toUnitVector().multiply(kkk);
      centerPosition = centerPosition.add(vec);
    } else {
      var ddddd = 11111;
    }

    var thisPoint = previousPoint.rotate(getThetaFromStructure(thisSubStructure), centerPosition);
    coordinates.push(thisPoint);
    previousPoint = thisPoint; // For next iteration.
    prevSubStructure = thisSubStructure;
    prevBase = base;
  });

  return {
    getCoordinates : function() {
      return coordinates;
    }
  };
};
