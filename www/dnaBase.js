

var DnaBase = function(type, dbnType, subStructures) {
  this._type = type.toUpperCase();
  this._dbnType = dbnType;
  this._subStructures = subStructures;

  return this;
};


DnaBase.prototype.getType = function() {
  return this._type;
}

DnaBase.prototype.isUnpaired = function() {
  return (this._dbnType === '.');
}

DnaBase.prototype.canPairWithType = function(otherType) {
  if (this._type === 'N') {
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
}

DnaBase.prototype.canPairWith = function(other) {
  if (!this.canPairWithType(other.getType())) {
    return false;
  }
  return (this.isUnpaired() && other.isUnpaired());
}
