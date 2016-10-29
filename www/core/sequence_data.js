import SecondaryStructure from './secondary_structure';
import DnaBase from './dna_base';
import GeometrySolver from './geometry_solver';
import ErrorUtils from '../utils/error_utils';

class SequenceData {
  constructor (seq, dbn) {
    ErrorUtils.assert(seq.length===dbn.length, "Sequence has invalid length");

    this._error = null;
    this._data = {seq, dbn};
    this._bases = [];
    this._secondary = new SecondaryStructure();
    for (var ii=0; ii<seq.length; ii++) {
      var dnaType = seq.charAt(ii);
      var dbnType = dbn.charAt(ii);

      ErrorUtils.assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
      ErrorUtils.assert(['.', '(', ')'].indexOf(dbnType)!==-1);

      if (dbnType === '(') {
        this._secondary.onOpen(ii);
      } else if (dbnType === ')') {
        if (this._secondary.onStack()<=1) {
          // Error handling
          this._error = ErrorUtils.errorObject("Tried to close too early at index", ii);
          return;
        }

        this._secondary.onClose(ii);
      } else {
        this._secondary.onVisitNode(ii);
      }

      this._bases.push(new DnaBase(ii, dnaType, dbnType));
    }

    {
      // Error handling.
      if (this._secondary.onStack()!==1) {
        this._error = ErrorUtils.errorObject("Missing closing brackets ", this._secondary._curStructures[1].openedAt());
        return;
      }
    }
  };

  getData () {
    return this._data;
  };

  getBases () {
    return this._bases;
  };

  getConnections () {
    return this._secondary.getConnections();
  };

  getSubStructures () {
    return this._secondary.getStructures();
  };

  getSubStructureAtIndex (index) {
    return this._secondary.getSubStructureAtIndex(index);
  };

  getCoordinates (width, height, modelTransforms) {
    return new GeometrySolver(this).getCoordinates(width, height, modelTransforms);
  };

  hasErrors () {
    return this._error !== null;
  };

  getErrorIndex () {
    return this._error ? this._error.getErrorIndex() : null;
  };
};

export default SequenceData;
