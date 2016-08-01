import React from 'react';
import ReactDOM from 'react-dom';
import SettingsData from './settings_data';
import SequenceParser from '../src/sequence_parser';
import SequenceLetter from './sequence_letter';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class SequenceFormView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      editMode: false
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur   = this.onBlur.bind(this);
    this.onClick  = this.onClick.bind(this);
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value
    });
  };

  componentDidUpdate () {
    if (this.state.editMode) {
      var inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
    }
  };

  onChange (evt) {
    var value = evt.target.value.toUpperCase();
    this.setState({value: value});
    this.props.onChange(this.props.type, value);
  };

  onBlur () {
    ReactDOM.findDOMNode(this.refs.inp).value = this.state.value;
    this.setState({editMode: false});
  };

  onClick () {
    this.setState({editMode: true});
    var inputBox = ReactDOM.findDOMNode(this.refs.inp);
    inputBox.focus();
    inputBox.select();
  };

  render () {
    var formClass = classNames('sequence-form', 'dna-base-font', {'sequence-has-error': this.props.error});
    var inpClass = classNames({'hidden': !this.state.editMode});
    var divClass = classNames({'hidden':  this.state.editMode}, 'sequence-form-div');

    var str = this.state.value;
    var letterDivs = [];
    for (var ii=0; ii<str.length; ii++) {
      letterDivs.push((<SequenceLetter letter={str[ii]} index={ii}
                        onSelected={this.props.onSelected}
                        key={"letter_" + ii}/>));
    }

    return (<div>
              <form className={formClass}>
                <input type="text" className={inpClass} value={this.state.value}
                  onChange={this.onChange} onBlur={this.onBlur}
                  ref="inp" placeholder={this.props.placeholder}
                  style={{width: '100%'}} >
                </input>
                <div className={divClass} onClick={this.onClick} >
                  {letterDivs}
                </div>
              </form>
            </div>);
  };
};


class ApplyChanges extends React.Component {
    render () {
      var clsNames = classNames('apply-changes-button', 'sequence-form', 'sequence-form-div', {'apply-changes-hidden': !this.props.dirty});
      return (<div>
                <button type="button" className={clsNames} onClick={this.props.onApply}>Apply</button>
              </div>);
  };
};

class SequenceView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      seq: this.props.seq,
      dbn: this.props.dbn,
      error: false
    };

    this.onChange = this.onChange.bind(this);
    this.onApply  = this.onApply.bind(this);
    this.isDirty  = this.isDirty.bind(this);
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      seq: nextProps.seq,
      dbn: nextProps.dbn,
      error: false
    });
  };

  isDirty () {
    if (this.props.seq !== this.state.seq) {
      return true;
    } else if (this.props.dbn !== this.state.dbn) {
      return true;
    }

    return false;
  };

  onChange (type, value) {
    this.setState({[type]: value});
  };

  onApply () {
    var sequenceParser = new SequenceParser(this.state.seq, this.state.dbn);
    if (sequenceParser.hasErrors()) {
      this.setState({error: true});
      return;
    }
    this.props.actions.setSequenceParser(sequenceParser);
  };

  render () {
    return (<div className="sequence-form-wrapper-div">
              <SequenceFormView value={this.state.seq} type="seq" error={this.state.error}
                onChange={this.onChange} placeholder="Enter DNA sequence" />
              <SequenceFormView value={this.state.dbn} type="dbn" error={this.state.error}
                onChange={this.onChange} placeholder="Enter DBN" />
              <ApplyChanges dirty={this.isDirty()} onApply={this.onApply} />
            </div>);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    seq: state.sequenceParser.getData().seq,
    dbn: state.sequenceParser.getData().dbn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceView);
