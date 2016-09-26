import SecondaryStructure from './secondary_structure';
import DnaBase from './dna_base';
import GeometrySolver from './geometry_solver';
import Utils from './utils';

var SequenceParser = function(seq, dbn) {

  Utils.assert(seq.length===dbn.length, "Sequence has invalid length");

  var errorMsg = null;
  var bases = [];
  var secondary = new SecondaryStructure();
  for (var ii=0; ii<seq.length; ii++) {
    var dnaType = seq.charAt(ii);
    var dbnType = dbn.charAt(ii);

    Utils.assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
    Utils.assert(['.', '(', ')'].indexOf(dbnType)!==-1);

    if (dbnType === '(') {
      secondary.onOpen(ii);
    } else if (dbnType === ')') {
      if (secondary.onStack()<=1) {
        // Error handling
        return Utils.errorObject("Tried to close too early at index", ii);
      }

      secondary.onClose(ii);
    } else {
      secondary.onVisitNode(ii);
    }

    bases.push(new DnaBase(ii, dnaType, dbnType));
  }

  {
    // Error handling.
    if (secondary.onStack()!==1) {
      return Utils.errorObject("Missing closing brackets ", secondary._curStructures[1].openedAt());
    }
  }

  return {
    getData : function () {
      return {
        seq,
        dbn
      };
    },

    getBases : function() {
      return bases;
    },

    getConnections : function() {
      return secondary.getConnections();
    },

    getSubStructures : function() {
      return secondary.getStructures();
    },

    getSubStructureAtIndex: function (index) {
      return secondary.getSubStructureAtIndex(index);
    },

    getCoordinates: function(width, height, modelTransforms) {
      return new GeometrySolver(this).getCoordinates(width, height, modelTransforms);
    },

    hasErrors : function() {
      return false;
    },

    getErrorIndex: function() {
      return null;
    }
  };
};

export default SequenceParser;
