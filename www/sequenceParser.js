

var SequenceParser = function(seq, dbn) {

  // Helper functions:
  function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message;
    }
  };

  var errorObject = function(msg) {
    return {
      hasErrors: function() {
        return msg;
      },

      getError: function() {
        return msg;
      }
    };
  };

  var getSubstructureName = function (level) {
    var name = 'root';
    // Iterate to length - 1. We want the parent level.
    for (var ii=0; ii<level.length-1; ii++) {
      name += '_' + level[ii];
    }
    return name;
  };

  assert(seq.length===dbn.length, "Sequence has invalid length");


  var errorMsg = null;
  var bases = [];
  var trackNodesInSubStructure = {'root': []}; // Keeps track of which nodes can 'possibly' go to a structure.
  var curStructureLevel = [-1]; // Keeps track of nesting.
  for (var ii=0; ii<seq.length; ii++) {
    var dnaType = seq.charAt(ii);
    var dbnType = dbn.charAt(ii);

    assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
    assert(['.', '(', ')'].indexOf(dbnType)!==-1);

    // Add one
    curStructureLevel[curStructureLevel.length-1]++;

    // Add current node to current parent substructure.
    var subStructures = [];
    var sub = getSubstructureName(curStructureLevel);
    subStructures.push(sub);
    trackNodesInSubStructure[sub].push(ii); // Add current node.
    if (dbnType === '(') {
      // Add another level.
      curStructureLevel.push(0);

      // Since it is connected to the next structure:
      var sub = getSubstructureName(curStructureLevel);
      subStructures.push(sub);
      trackNodesInSubStructure[sub] = [];      // Created after creating new level.
      trackNodesInSubStructure[sub].push(ii); // Add current node (again).
    } else if (dbnType === ')') {
      if (curStructureLevel <= 1) {
        // Can't be root.
        return errorObject("Tried to close too early at index " + ii);
      }
      // Remove current level.
      curStructureLevel.pop();
      curStructureLevel[curStructureLevel.length-1]++;

      // Since it is connected to the next structure:
      var sub = getSubstructureName(curStructureLevel);
      subStructures.push(sub);
      trackNodesInSubStructure[sub].push(ii); // Add current node (again).
    }

    bases.push(new DnaBase(dnaType, dbnType, subStructures));
  }

  if (curStructureLevel.length !== 1) {
    return errorObject("Missing closing brackets.");
  }

  return {
    getSubstructure : function() {
      var validSubStructures = {};
      _(trackNodesInSubStructure).each(function (val, name) {
        var hasAtleast = 5;
        if (name === 'root') {
          hasAtleast = 3;
        }
        if (val.length >= hasAtleast){
          validSubStructures[name] = val;
        }
      });
      return validSubStructures;
    },

    getBases : function() {
      return bases;
    },

    hasErrors : function() {
      return false;
    },

    getError : function() {
      return null;
    },

  };
};

setTimeout(function() {
  // Debug code.
  console.log(SequenceParser('TTGGGCTTGGGGCTCCCAGAATTT', '.((((((...))((...)))))).').getSubstructure());
  console.log(SequenceParser('TTGGGCTTGGGGCTCCCAGAATTT', '.((((((...))((...)))))).').getBases());
  console.log(SequenceParser('TTGGGCTTGGGGAATTT', '.((((((...)))))).').getSubstructure());
}, 2000);
