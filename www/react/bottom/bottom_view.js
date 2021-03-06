import React from 'react';
import GridLayout from '../main/grid_layout';
import SequenceData from '../../core/sequence_data';
import SequenceFormView from './sequence_form_view';
import SequenceChanges from './sequence_changes';
import classNames from 'classnames';
import Dimensions from '../../utils/dimensions';
import ReduxUtils from '../../utils/redux_utils';

class BottomView extends React.Component {
  constructor (props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
    this.onApply  = this.onApply.bind(this);
    this.isDirty  = this.isDirty.bind(this);
  };

  isDirty () {
    if (this.props.seqTemp !== this.props.seqPerm) {
      return true;
    } else if (this.props.dbnTemp !== this.props.dbnPerm) {
      return true;
    }
    return false;
  };

  onCancel () {
    this.props.actions.setTempSequence(this.props.seqPerm, this.props.dbnPerm);
    this.props.actions.resetSequenceViewHasErrors();
  };

  onApply () {
    let sequenceData = new SequenceData(this.props.seqTemp, this.props.dbnTemp);
    if (sequenceData.hasErrors()) {
      this.props.actions.setSequenceViewHasErrors(true);
      return;
    }
    this.props.actions.setSequenceData(sequenceData);
    this.props.actions.resetSequenceViewHasErrors();
  };

  getLayout() {
    return [
      {x:0,  y:0,  w:25,  h:2,  v: true,            i: 'SequenceFormViewSeq'},
      {x:0,  y:2,  w:25,  h:2,  v: true,            i: 'SequenceFormViewDbn'},
      {x:25, y:0,  w:2,   h:4,  v: this.isDirty(),  i: 'SequenceChangesCancel'},
      {x:27, y:0,  w:2,   h:4,  v: this.isDirty(),  i: 'SequenceChangesApply'}
    ];
  };

  render () {
    let properties = {
      cols: 29,
      rowHeight: Dimensions.DNA_VIEWER_ROW_HEIGHT,
      width: window.innerWidth
    };

    return (<div className="sequence-form-wrapper-div">
              <GridLayout properties={properties} layout={this.getLayout()} >
                <SequenceFormView key='SequenceFormViewSeq'   type="seq" placeholder="Enter DNA sequence" />
                <SequenceFormView key='SequenceFormViewDbn'   type="dbn" placeholder="Enter DBN" />
                <SequenceChanges  key='SequenceChangesCancel' onClick={this.onCancel} buttonText={'Cancel'}/>
                <SequenceChanges  key='SequenceChangesApply'  onClick={this.onApply} buttonText={'Apply'}/>
              </GridLayout>
            </div>);
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    seqPerm: state.sequenceData.getData().seq,
    dbnPerm: state.sequenceData.getData().dbn,
    seqTemp: state.tempSequence.seq,
    dbnTemp: state.tempSequence.dbn,
    canvasDimensions: state.canvasDimensions
  };
};

export default ReduxUtils.connect(mapStateToProps, true)(BottomView);
