import React from 'react';
import ReactDOM from 'react-dom';
import SequenceLetter from './sequence_letter';
import ArrayUtils from '../../utils/array_utils';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class SequenceFormView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      editMode: false
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur   = this.onBlur.bind(this);
    this.onClick  = this.onClick.bind(this);
  };

  componentDidUpdate () {
    if (this.state.editMode) {
      let inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
    }
  };

  onChange (evt) {
    let value = evt.target.value;
    let obj = {
      seq: this.props.seqTemp,
      dbn: this.props.dbnTemp
    };
    obj[this.props.type] = value;
    this.props.actions.setTempSequence(obj.seq, obj.dbn);
  };

  getValueForView () {
    let obj = {
      seq: this.props.seqTemp,
      dbn: this.props.dbnTemp
    };
    return obj[this.props.type];
  };

  onBlur () {
    ReactDOM.findDOMNode(this.refs.inp).value = this.getValueForView();
    this.setState({editMode: false});
    let obj = {
      seq: this.props.seqTemp.toUpperCase(),
      dbn: this.props.dbnTemp.toUpperCase()
    };
    this.props.actions.setTempSequence(obj.seq, obj.dbn);
  };

  onClick () {
    this.setState({editMode: true});
    let inputBox = ReactDOM.findDOMNode(this.refs.inp);
    inputBox.focus();
    inputBox.select();
  };

  render () {
    let formClass = classNames('dna-base-font', {'sequence-has-error': this.props.hasErrors});
    let inpClass  = classNames('sequence-form-input', {'hidden': !this.state.editMode});
    let divClass  = classNames({'hidden':  this.state.editMode}, 'sequence-form-div');
    let str = this.getValueForView();

    return (<div className='sequence-form'>
              <form className={formClass}>
                <input type="text" className={inpClass} value={this.getValueForView()}
                  onChange={this.onChange} onBlur={this.onBlur}
                  ref="inp" placeholder={this.props.placeholder}
                  style={{width: '100%'}} >
                </input>
                <div className={divClass} onClick={this.onClick} >
                  {ArrayUtils.range(str.length).map(idx => (<SequenceLetter letter={str[idx]} index={idx} onSelected={this.props.onSelected} key={"letter_" + idx}/>))}
                </div>
              </form>
            </div>);
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    seqTemp:   state.tempSequence.seq,
    dbnTemp:   state.tempSequence.dbn,
    hasErrors: state.sequenceViewHasErrors
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceFormView);
