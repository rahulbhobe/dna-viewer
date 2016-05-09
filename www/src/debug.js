// Debug code.
$(document).ready(function () {
  var pairs = [
    {
      seq: 'TTGGGCTTGGGGCTCCCAGAATTT',
      dbn: '.((((((...))((...)))))).'
    },
    {
      seq: 'TTGGGCTTGGGGAATTT',
      dbn: '.((((((...)))))).'
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
    var sequenceParser = new SequenceParser(pair.seq, pair.dbn);
    console.log('Bases', sequenceParser.getBases());
    console.log('Connections', sequenceParser.getConnections());
    console.log('Coordinates', sequenceParser.getCoordinates());
  });
});
