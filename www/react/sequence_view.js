import React from 'react';
import ReactDOM from 'react-dom';
import DebugUtils from '../src/debug';
import SettingsData from './settings_data';
import SequenceParser from '../src/sequence_parser';
import store from '../store/store';

class SequenceLetter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hover: false,
      dragging: false
    };

    this.onMouseOver    = this.onMouseOver.bind(this);
    this.onMouseLeave   = this.onMouseLeave.bind(this);
    this.onStoreChanged = this.onStoreChanged.bind(this);
  };

  onStoreChanged () {
    var {hover, dragging} = store.getState();
    this.setState({
      hover: hover===this.props.index,
      dragging: dragging===this.props.index
    });
  };

  componentDidMount () {
    this.unsubscribe = store.subscribe(this.onStoreChanged);
  };

  componentWillUnmount () {
    this.unsubscribe();
  };

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.hover !== this.state.hover) {
      return true;
    }
    if (nextState.dragging !== this.state.dragging) {
      return true;
    }
    return false;
  };

  componentWillUpdate () {

  }

  render () {
    var clsName = this.state.hover || this.state.dragging ? "higlight-sequence-text" : "";
    return (<span className={clsName} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              {this.props.letter}
            </span>);
  };

  onMouseOver () {
    this.props.onSelected(this.props.index);
  };

  onMouseLeave () {
    this.props.onSelected(-1);
  };
};

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
    var formClass = "sequence-form dna-base-font ";
    if (this.props.error) {
      formClass += " sequence-has-error";
    }

    var inpClass   =  this.state.editMode ? "" : "hidden";
    var divClass   = !this.state.editMode ? "" : "hidden";
    divClass += " sequence-form-div";

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
      var clsNames = "apply-changes-button sequence-form sequence-form-div";
      if (!this.props.dirty) {
        clsNames += " apply-changes-hidden ";
      }
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
      dirty: false,
      error: false
    };

    this.onChange = this.onChange.bind(this);
    this.onApply  = this.onApply.bind(this);
  };

  componentWillReceiveProps (nextProps) {
    if (this.state.dirty) {
      if (!nextProps.updateSequence) {
        return;
      }
    }

    this.setState({
      seq: nextProps.seq,
      dbn: nextProps.dbn,
      dirty: false,
      error: false
    });
  };

  onChange (type, value) {
    var obj = {
      dirty: true
    };
    obj[type] = value;
    this.setState(obj);
  };

  onApply () {
    var sequenceParser = new SequenceParser(this.state.seq, this.state.dbn);
    if (sequenceParser.hasErrors()) {
      this.setState({error: true});
      return;
    }
    this.props.onSequenceChanged(this.state.seq, this.state.dbn);
    this.setState({
      error: false,
      dirty: false
    });
  };

  render () {
    return (<div className="sequence-form-wrapper-div">
              <SequenceFormView value={this.state.seq} type="seq" error={this.state.error}
                onSelected={this.props.onSelected} onChange={this.onChange}
                placeholder="Enter DNA sequence" />
              <SequenceFormView value={this.state.dbn} type="dbn" error={this.state.error}
                onSelected={this.props.onSelected} onChange={this.onChange}
                placeholder="Enter DBN" />
              <ApplyChanges dirty={this.state.dirty} onApply={this.onApply} />
            </div>);
  };
};

export default SequenceView;
