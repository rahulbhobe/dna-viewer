import SequenceData from '../core/sequence_data';

class SequenceUtils {
  static canJoinNodes (sequenceData, node1, node2) {
    if (node1 === -1)    return false;
    if (node2 === -1)    return false;
    if (node1 === node2) return false;

    let bases = sequenceData.getBases();
    let base1 = bases[node1];
    let base2 = bases[node2];

    if (!base1.isUnpaired()) return false;
    if (!base2.isUnpaired()) return false;

    return base1.canPairWith(base2);
  };

  static getJoinedSequence (sequenceData, node1, node2) {
    if (!sequenceData) return null;

    if (!this.canJoinNodes(sequenceData, node1, node2)) return null;

    let {seq, dbn} = sequenceData.getData();
    let min = Math.min(node1, node2);
    let max = Math.max(node1, node2);

    let newdbn =  dbn.substring(0, min) + '(' + dbn.substring(min+1, max) + ')' + dbn.substring(max+1);
    let sequenceDataNew = new SequenceData(seq, newdbn);
    if (sequenceDataNew.hasErrors()) {
      return null;
    }

    return sequenceDataNew;
  };
};

export default SequenceUtils;