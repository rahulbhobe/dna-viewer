import SequenceParser from '../src/sequence_parser';

class SequenceUtils {
  static getJoinedSequence (sequenceParser, node1, node2) {
    if (!sequenceParser) return null;
    if (node1 === -1)    return null;
    if (node2 === -1)    return null;

    let bases    = sequenceParser.getBases();
    let base1    = bases[node1];
    let base2    = bases[node2];

    if (!base1.isUnpaired()) return null;
    if (!base2.isUnpaired()) return null;
    if (!base1.canPairWith(base2)) return null;

    let {seq, dbn} = sequenceParser.getData();
    let min = Math.min(node1, node2);
    let max = Math.max(node1, node2);

    let newdbn =  dbn.substring(0, min) + '(' + dbn.substring(min+1, max) + ')' + dbn.substring(max+1);
    let sequenceParserNew = new SequenceParser(seq, newdbn);
    if (sequenceParserNew.hasErrors()) {
      return null;
    }

    return sequenceParserNew;
  };
};

export default SequenceUtils;