document.addEventListener("DOMContentLoaded", function(event) {
  function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message;
    }
  };

  // _(debug_examples).each(function (pair) {
  //   var sequenceParser = new SequenceParser(pair.seq, pair.dbn);
  //   console.log('Bases', sequenceParser.getBases());
  //   console.log('Connections', sequenceParser.getConnections());
  //   console.log('Coordinates', sequenceParser.getCoordinates());
  // });
});

var DebugUtils = {};

DebugUtils.debug_examples = [
  {
    seq: 'TTGGGGGGACTGGGGCTCCCATTCGTTGCCTTTATAAATCCTTGCAAGCCAATTAACAGGTTGGTGAGGGGCTTGGGTGAAAAGGTGCTTAAGACTCCGT',
    dbn: '...(((((.(...).)))))........(((((.....((..(.((((((..(((.((...)).)))..)))))).).)))))))...............'
  },
  {
    seq: 'CAGCACGACACTAGCAGTCAGTGTCAGACTGCATACAGCACGACACTAGCAGTCAGTGTCAGACTGCATACAGCACGACACTAGCAGTCAGTGTCAGACTGCATA',
    dbn: '..(((((...(((((...(((((...(((((.....)))))...))))).....(((((...(((((.....)))))...))))).....)))))...)))))..'
  },
  {
    seq: 'TTGGGCTTGGGGCTCCCAGAATTT',
    dbn: '.((((((...))((...)))))).'
  },
  {
    seq: 'TTGGGCTTGGGGAATTT',
    dbn: '.((((((...)))))).'
  },
  {
    seq: 'AAGGTTTCAAGGAACCGGGGGCCACGGGAAAAATTTTTTTTTAAAA',
    dbn: '.(...((....(...(((.....)))..((((...)))))...)))'
  }
];

export default DebugUtils;
