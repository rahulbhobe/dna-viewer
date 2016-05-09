var SecondaryStructure = function() {
  // All structures created by the helper.
  this._subStructures     = [];

  // Keeps track of nesting.
  this._curStructures  = [this.newStructure(true)];

  // Index of the node in the sequence to its SubStructure.
  this._indexToSubStruct = {};
  return this;
};

SecondaryStructure.prototype.newStructure = function(isRoot) {
  var structure = new SubStructure(isRoot);
  this._subStructures.push(structure);
  return structure;
};

SecondaryStructure.prototype.onOpen = function(nodeIndex) {
  this._curStructures[this._curStructures.length-1].append(nodeIndex);
  this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];

  this._curStructures.push(this.newStructure(false));
  this._curStructures[this._curStructures.length-1].openedAt(nodeIndex);
};

SecondaryStructure.prototype.onVisitNode = function(nodeIndex) {
  this._curStructures[this._curStructures.length-1].append(nodeIndex);
  this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];
};

SecondaryStructure.prototype.onClose = function(nodeIndex) {
  this._indexToSubStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];

  var structure = this._curStructures.pop();
  structure.closedAt(nodeIndex);
  this._curStructures[this._curStructures.length-1].append(nodeIndex);
};

SecondaryStructure.prototype.getStructures = function() {
  return this._subStructures;
};

SecondaryStructure.prototype.getConnections = function() {
  var structures = this._subStructures.slice(1); // Don't need root;
  return _(structures).map(function (structure) {
    return {
      source: structure.openedAt(),
      target: structure.closedAt()
    };
  });
};

SecondaryStructure.prototype.getSubStructureAtIndex = function(index) {
  return this._indexToSubStruct[index];
}
