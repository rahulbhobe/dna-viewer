

var DnaBase = function(dnaType, dbnType, subStructures) {
  this._dnaType = dnaType.toUpperCase();
  this._dbnType = dbnType;
  this._subStructures = subStructures;

  return this;
};


DnaBase.prototype.getType = function() {
  return this._dnaType;
}

DnaBase.prototype.canPairWith = function(other) {
  if (this._dnaType === 'N') {
    return true;
  }

  if (this._dnaType === 'A') {
    return other === 'T';
  } else if (this._dnaType === 'T') {
    return other === 'A';
  } else if (this._dnaType === 'C') {
    return other === 'G';
  } else if (this._dnaType === 'G') {
    return other === 'C';
  }

  return false;
}
