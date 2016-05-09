var GeometrySolver = function(sequenceParser) {
  var distance     = 100; // Distance between nodes.

  var getThetaFromStructure = function(subStructure) {
    var length = subStructure.getNodes().length;
    if (subStructure.openedAt() !== null) {
      length++;
    }
    if (subStructure.closedAt() !== null) {
      length++;
    }
    return (2 * Math.PI) / length;
  };

  var getDistanceToMoveCenter = function(subStructure) {
    var theta = getThetaFromStructure(subStructure);
    return 0.5 * distance / Math.tan(theta/2);
  };

  var centerPosition = Vector.create([800, 200]); // Start position for the center.

  var prevSubStructure = sequenceParser.getSubStructureAtIndex(0);
  // Dummy start point (will end up being the last point in the entire traversal - by design).
  var previousPoint  = centerPosition.add(Vector.create([0, -1]).multiply((distance * 0.5) / Math.sin(getThetaFromStructure(prevSubStructure) / 2)));

  var prevBase = null;
  var coordinates = [];
  var centers = [];
  var bases  = sequenceParser.getBases();
  _(bases).each(function (base) {
    var thisSubStructure = sequenceParser.getSubStructureAtIndex(base.getIndex());

    if (base._dbnType === ')') {
      var junk = 000;
    }

    var dddTest = centerPosition.distanceFrom(previousPoint);
    if (prevBase && !prevBase.isUnpaired()) {
      var kkk = getDistanceToMoveCenter(thisSubStructure) + getDistanceToMoveCenter(prevSubStructure);
      angle = getThetaFromStructure(prevSubStructure) / 2;
      var point = previousPoint.rotate(angle, centerPosition);
      var vec   = point.subtract(centerPosition).toUnitVector().multiply(kkk);
      centerPosition = centerPosition.add(vec);
    } else {
      var ddddd = 11111;
    }
    var dddTest = centerPosition.distanceFrom(previousPoint);


    var thisPoint = previousPoint.rotate(getThetaFromStructure(thisSubStructure), centerPosition);
    coordinates.push(thisPoint);
    centers.push(centerPosition);
    previousPoint = thisPoint; // For next iteration.
    prevSubStructure = thisSubStructure;
    prevBase = base;
  });

  return {
    getCoordinates : function() {
      return coordinates;
    },

    getCenters : function() {
      return centers;
    }
  };
};
