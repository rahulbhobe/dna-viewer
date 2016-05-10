var SubStructure = function() {
  this._openedAt  = null;
  this._closedAt  = null;
  this._contains  = []; // Indices of the nodes in the current level only.
                        // Does not contain list of recursively nested ones.
  return this;
};

SubStructure.prototype.getNodes = function(includeEnds) {
  var ret = this._contains.slice();

  if (!includeEnds) {
    return ret;
  }

  if (this.openedAt() !== null) {
    ret.unshift(this.openedAt())
  }
  if (this.closedAt() !== null) {
    ret.push(this.closedAt())
  }

  return ret; 
};

SubStructure.prototype.getNumNodes = function(includeEnds) {
  return this.getNodes(includeEnds).length;
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
