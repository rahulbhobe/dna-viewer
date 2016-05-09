var SubStructure = function(isRoot) {
  this._isRoot    = isRoot || false;
  this._openedAt  = null;
  this._closedAt  = null;
  this._contains  = []; // Indices of the nested nodes.
  return this;
};

SubStructure.prototype.isRoot = function() {
  return this._isRoot; 
};

SubStructure.prototype.getNodes = function() {
  return this._contains; 
};

SubStructure.prototype.append = function(val) {
  return this._contains.push(val); 
};

SubStructure.prototype.openedAt = function(val) {
  if (val !== undefined) {
    this._openedAt = val;
  }
  return this._openedAt;
};

SubStructure.prototype.closedAt = function(val) {
  if (val !== undefined) {
    this._closedAt = val;
  }
  return this._closedAt;
};

SubStructure.prototype.hasBranches = function() {
  return this._contains.length >= 3;
};