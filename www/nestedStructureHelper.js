var NestedStructureHelper = function() {
  // All structures created by the helper.
  this._structures     = [];

  // Keeps track of nesting.
  this._curStructures  = [this.newStructure(true)];
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
