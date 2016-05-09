var NestedStructureHelper = function() {
  // All structures created by the helper.
  this._structures     = [];

  // Keeps track of nesting.
  this._curStructures  = [this.newStructure(true)];

  this._indexToStruct = {};
  return this;
};

NestedStructureHelper.prototype.newStructure = function(isRoot) {
  var structure = new SubStructure(isRoot);
  this._structures.push(structure);
  return structure;
};

NestedStructureHelper.prototype.onOpen = function(nodeIndex) {
  this.onVisitNode(nodeIndex);
  this._curStructures.push(this.newStructure(false));
  this._curStructures[this._curStructures.length-1].openedAt(nodeIndex);
};

NestedStructureHelper.prototype.onVisitNode = function(nodeIndex) {
  this._curStructures[this._curStructures.length-1].append(nodeIndex);
  this._indexToStruct[nodeIndex] = this._curStructures[this._curStructures.length-1];
};

NestedStructureHelper.prototype.onClose = function(nodeIndex) {
  var structure = this._curStructures.pop();
  structure.closedAt(nodeIndex);
  this.onVisitNode(nodeIndex);
};

NestedStructureHelper.prototype.getStructures = function() {
  return this._structures;
};

NestedStructureHelper.prototype.getStructuresForBranching = function() {
  return _(this._structures).filter(function (structure) {
    return structure.hasBranches();
  });
};

NestedStructureHelper.prototype.getConnections = function() {
  var structures = this._structures.slice(1); // Don't need root;
  return _(structures).map(function (structure) {
    return {
      source: structure.openedAt(),
      target: structure.closedAt()
    };
  });
};

NestedStructureHelper.prototype.visitSavedStructures = function(callback) {
  _(this._structures).each(function(structure) {
    callback(structure);
  });
};

NestedStructureHelper.prototype.getSubStructureAtIndex = function(index) {
  return this_._indexToStruct[index];
}
