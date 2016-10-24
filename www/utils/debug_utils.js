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
});

class DebugUtils {
  static debug_examples = [
    {
      seq: 'GTTGCATACTATGCCATCGCAGCTGGTAACTACTACTCTGTCTATATGCAAACCTGCTGCAAGTATTGCCCATGCGTACATGA',
      dbn: '.(((((((...........(((...............))))....))))))..(((...).)).......((((....)))).'
    },
    {
      seq: 'TGCGGATTTAGCTCAGTTGGGAGAGCGCCAGACTGAAGATTTGGAGGTCCTGTGTTCGATCCACAGAATTCGCA',
      dbn: '..(((((((.((((........)))).((((.........)))))....(((((.......)))))))))))..'
    },
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
};

export default DebugUtils;
