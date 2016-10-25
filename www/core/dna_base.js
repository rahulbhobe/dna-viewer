class DnaBase {
  constructor (index, type, dbnType) {
    this._index = index; // Index in the sequence. (This is like id. Everything is index based.)
    this._type = type.toUpperCase();
    this._dbnType = dbnType;
    return this;
  };

  getIndex () {
    return this._index;
  };

  getType () {
    return this._type;
  };

  isUnpaired () {
    return (this._dbnType === '.');
  };

  canPairWithType (otherType) {
    if (this._type === 'N') {
      return true;
    }
    if (otherType === 'N') {
      return true;
    }

    if (this._type === 'A') {
      return otherType === 'T';
    } else if (this._type === 'T') {
      return otherType === 'A';
    } else if (this._type === 'C') {
      return otherType === 'G';
    } else if (this._type === 'G') {
      return otherType === 'C';
    }

    return false;
  };

  canPairWith (other) {
    if (!this.canPairWithType(other.getType())) {
      return false;
    }
    return (this.isUnpaired() && other.isUnpaired());
  };
}

export default DnaBase;
