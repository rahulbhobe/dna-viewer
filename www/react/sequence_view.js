import React from 'react';
import GridLayout from './grid_layout';
import SequenceParser from '../src/sequence_parser';
import SequenceFormView from './sequence_form_view';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class SequenceChanges extends React.Component {
    render () {
      var clsNames = classNames('sequence-change-button', 'sequence-form-div');
      return (<div>
                <input type="image" className={clsNames} onClick={this.props.onClick} src={'/res/' + this.props.buttonText.toLowerCase() + '-button.png'}/>
              </div>);
  };
};

class SequenceView extends React.Component {
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
    var sequenceParser = new SequenceParser(this.props.seqTemp, this.props.dbnTemp);
    if (sequenceParser.hasErrors()) {
      this.props.actions.setSequenceViewHasErrors(true);
      return;
    }
    this.props.actions.setSequenceParser(sequenceParser);
    this.props.actions.resetSequenceViewHasErrors();
  };

  getLayout() {
    return [
      {x:0,  y:0,  w:25,  h:1,  v: true,            d: (<SequenceFormView type="seq" placeholder="Enter DNA sequence" />)},
      {x:0,  y:1,  w:25,  h:1,  v: true,            d: (<SequenceFormView type="dbn" placeholder="Enter DBN" />)},
      {x:25, y:0,  w:2,   h:2,  v: this.isDirty(),  d: (<SequenceChanges dirty={this.isDirty()} onClick={this.onCancel} buttonText={'Cancel'}/>)},
      {x:27, y:0,  w:2,   h:2,  v: this.isDirty(),  d: (<SequenceChanges dirty={this.isDirty()} onClick={this.onApply} buttonText={'Apply'}/>)}
    ];
  };

  render () {
    var properties = {
      cols: 29,
      rowHeight: 32*2,
      width: window.innerWidth
    };

    return (<div className="sequence-form-wrapper-div">
              <GridLayout properties={properties} layout={this.getLayout()} />
            </div>);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    seqPerm: state.sequenceParser.getData().seq,
    dbnPerm: state.sequenceParser.getData().dbn,
    seqTemp: state.tempSequence.seq,
    dbnTemp: state.tempSequence.dbn,
    canvasDimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceView);
