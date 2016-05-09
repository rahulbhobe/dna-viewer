var SequenceParser = function(seq, dbn) {

  assert(seq.length===dbn.length, "Sequence has invalid length");

  var errorMsg = null;
  var bases = [];
  var secondary = new SecondaryStructure();
  for (var ii=0; ii<seq.length; ii++) {
    var dnaType = seq.charAt(ii);
    var dbnType = dbn.charAt(ii);

    assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
    assert(['.', '(', ')'].indexOf(dbnType)!==-1);

    if (dbnType === '(') {
      secondary.onOpen(ii);
    } else if (dbnType === ')') {
      // if (curStructureLevel <= 1) {
      //   // Can't be root.
      //   return errorObject("Tried to close too early at index " + ii);
      // }
      secondary.onClose(ii);
    } else {
      secondary.onVisitNode(ii);
    }

    bases.push(new DnaBase(ii, dnaType, dbnType));
  }


  // if (curStructureLevel.length !== 1) {
  //   return errorObject("Missing closing brackets.");
  // }

  return {
    getBases : function() {
      return bases;
    },

    getConnections : function() {
      return secondary.getConnections();
    },

    getSubStructureAtIndex: function (index) {
      return secondary.getSubStructureAtIndex(index);
    },

    getCoordinates: function() {
      return new GeometrySolver(this).getCoordinates();
    },

    hasErrors : function() {
      return false;
    },

    getError : function() {
      return null;
    }
  };
};
