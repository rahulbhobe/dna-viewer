import SubStructure from './sub_structure';

class SecondaryStructure {
  constructor () {
    // All structures created by the helper.
    this._subStructures     = [];

    // Keeps track of nesting.
    this._curStructures  = [this.newStructure()];

    // Index of the node in the sequence to its SubStructure.
    this._indexToSubStruct = {};
  };

  newStructure () {
    let structure = new SubStructure();
    this._subStructures.push(structure);
    return structure;
  };

  onOpen (nodeIndex) {
    this._curStructures[this._curStructures.length-1].append(nodeIndex);
    this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];

    this._curStructures.push(this.newStructure());
    this._curStructures[this._curStructures.length-1].openedAt(nodeIndex);
  };

  onVisitNode (nodeIndex) {
    this._curStructures[this._curStructures.length-1].append(nodeIndex);
    this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];
  };

  onClose (nodeIndex) {
    this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];

    let structure = this._curStructures.pop();
    structure.closedAt(nodeIndex);
    this._curStructures[this._curStructures.length-1].append(nodeIndex);
  };

  onStack = function() {
    return this._curStructures.length;
  };

  getStructures () {
    return this._subStructures;
  };

  getConnections () {
    let structures = this.getStructures().slice(1); // Don't need root;
    return structures.map((structure) => {
      return {
        source: structure.openedAt(),
        target: structure.closedAt()
      };
    });
  };

  getSubStructureAtIndex (index) {
    return this._indexToSubStruct[index];
  };
};

export default SecondaryStructure;
