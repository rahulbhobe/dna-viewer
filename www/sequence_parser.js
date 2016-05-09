

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

    getStructuresForBranching : function() {
      return secondary.getStructuresForBranching();
    },

    getConnections : function() {
      return secondary.getConnections();
    },

    getSubStructureAtIndex: function (index) {
      secondary.getSubStructureAtIndex(index);
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
  var pairs = [
    {
      seq: 'TTGGGCTTGGGGCTCCCAGAATTT',
      dbn: '.((((((...))((...)))))).',
      res: [
        {
          openedAt : null,
          contains : [0, 1, 22, 23],
          closedAt : null,
        },

        {
          openedAt : 4,
          contains : [5, 11, 12, 18],
          closedAt : 19,
        },

        {
          openedAt : 6,
          contains : [7, 8, 9],
          closedAt : 10,
        },

        {
          openedAt : 13,
          contains : [14, 15, 16],
          closedAt : 17,
        },
      ],
    },
    {
      seq: 'TTGGGCTTGGGGAATTT',
      dbn: '.((((((...)))))).',
      res: [
        {
          openedAt : null,
          contains : [0, 1, 15, 16],
          closedAt : null,
        },

        {
          openedAt : 6,
          contains : [7, 8, 9],
          closedAt : 10,
        },
      ],
    },
  ];

  function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message;
    }
  };

  _(pairs).each(function (pair) {
    var subStructure = _(SequenceParser(pair.seq, pair.dbn).getStructuresForBranching()).map(function(structure) {
      return {
        openedAt : structure.openedAt(),
        contains : structure.getNodes(),
        closedAt : structure.closedAt(),
      };
    });
    assert(_.isEqual(subStructure, pair.res), "Output no longer matches");
    console.log(subStructure);
    console.log('Bases', SequenceParser(pair.seq, pair.dbn).getBases());
    console.log('Connections', SequenceParser(pair.seq, pair.dbn).getConnections());
  });
}, 2000);
