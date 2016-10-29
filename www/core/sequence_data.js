import SecondaryStructure from './secondary_structure';
import DnaBase from './dna_base';
import GeometrySolver from './geometry_solver';
import ArrayUtils from '../utils/array_utils';
import ErrorUtils from '../utils/error_utils';

class SequenceData {
  constructor (seq, dbn) {
    ErrorUtils.assert(seq.length===dbn.length, "Sequence has invalid length");

    this._error = null;
    this._data = {seq, dbn};
    this._bases = [];
    this._secondary = null;
    this.parse();
  }

  parse () {
    let secondary = new SecondaryStructure();
    let {seq, dbn} = this._data;
    let bases = ArrayUtils.range(seq.length).map((idx) => {
      let dnaType = seq.charAt(idx);
      let dbnType = dbn.charAt(idx);

      ErrorUtils.assert(['A', 'C', 'G', 'T', 'N'].indexOf(dnaType.toUpperCase())!==-1);
      ErrorUtils.assert(['.', '(', ')'].indexOf(dbnType)!==-1);

      if (dbnType === '(') {
        secondary.onOpen(idx);
      } else if (dbnType === ')') {
        if (secondary.onStack()<=1) {
          // Error handling
          this._error = ErrorUtils.errorObject("Tried to close too early at index", idx);
          return;
        }

        secondary.onClose(idx);
      } else {
        secondary.onVisitNode(idx);
      }

      return new DnaBase(idx, dnaType, dbnType);
    });

    {
      // Error handling.
      if (secondary.onStack()!==1) {
        this._error = ErrorUtils.errorObject("Missing closing brackets ", secondary._curStructures[1].openedAt());
        return;
      }
    }

    this._bases = bases;
    this._secondary = secondary;
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
