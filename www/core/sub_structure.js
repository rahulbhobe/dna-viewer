class SubStructure {
  constructor () {
    this._openedAt  = null;
    this._closedAt  = null;
    this._contains  = []; // Indices of the nodes in the current level only.
                          // Does not contain list of recursively nested ones.
  };

  getNodes (includeEnds) {
    let ret = this._contains.slice();

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

  getNumNodes (includeEnds) {
    return this.getNodes(includeEnds).length;
  };

  append (val) {
    return this._contains.push(val);
  };

  openedAt (val) {
    if (val !== undefined) {
      this._openedAt = val;
    }
    return this._openedAt;
  };

  closedAt (val) {
    if (val !== undefined) {
      this._closedAt = val;
    }
    return this._closedAt;
  };
};

export default SubStructure;
