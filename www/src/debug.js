// Debug code.
$(document).ready(function () {
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
});