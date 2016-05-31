var React = require('react');
var ReactDOM = require('react-dom');
var DebugUtils = require('../src/debug');
var SettingsData = require('./settings_data');
var SequenceParser = require('../src/sequence_parser');

var SequenceLetter = React.createClass({
  getInitialState: function() {
    return {
      selected: false,
      moving: false
    };
  },

  render: function () {
    var clsName = this.state.selected || this.state.moving ? "higlight-sequence-text" : "";
    return (<span className={clsName} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              {this.props.letter}
            </span>);
  },

  onMouseOver: function () {
    this.props.onSelected(this.props.index);
  },

  onMouseLeave: function() {
    this.props.onSelected(-1);
  }
});

var SequenceFormView = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      editMode: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.value === nextProps.value) {
      return;
    }
    this.setState({
      value: nextProps.value
    });
  },

  componentDidUpdate: function() {
    if (this.state.editMode) {
      var inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
    }
  },

  onChange: function (evt) {
    var value = evt.target.value.toUpperCase();
    this.setState({value: value});
    this.props.onChange(this.props.type, value);
  },

  onBlur: function () {
    ReactDOM.findDOMNode(this.refs.inp).value = this.state.value;
    this.setState({editMode: false});
  },

  onClick: function () {
    this.setState({editMode: true});
    var inputBox = ReactDOM.findDOMNode(this.refs.inp);
    inputBox.focus();
    inputBox.select();
  },

  render: function () {
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
      letterDivs.push((<SequenceLetter ref={'letterref' + ii} letter={str[ii]} index={ii}
                        onSelected={this.props.onSelected}
                        key={"letter_" + ii}/>));
    }

    return (<div>
              <form className={formClass}>
                <input type="text" className={inpClass} defaultValue={this.props.value}
                  onChange={this.onChange} onBlur={this.onBlur}
                  ref="inp" placeholder={this.props.placeholder}
                  style={{width: '100%'}} >
                </input>
                <div className={divClass} onClick={this.onClick} >
                  {letterDivs}
                </div>
              </form>
            </div>);
  }
});

var ApplyChanges = React.createClass({
    render: function () {
      var clsNames = "apply-changes-button sequence-form sequence-form-div";
      if (!this.props.dirty) {
        clsNames += " apply-changes-hidden ";
      }
      return (<div>
                <button type="button" className={clsNames} onClick={this.props.onApply}>Apply</button>
              </div>);
  }
});

var SequenceView = React.createClass({
  getInitialState: function () {
    return {
      seq: this.props.seq,
      dbn: this.props.dbn,
      dirty: false,
      error: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
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
  },

  onChange: function (type, value) {
    var obj = {
      dirty: true
    };
    obj[type] = value;
    this.setState(obj);
  },

  onApply: function () {
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
  },

  setSelected: function(index, val) {
    var  obj = {selected: val};
    var  seq = this.refs.seqview.refs['letterref' + index];
    var  dbn = this.refs.dbnview.refs['letterref' + index];
    if (seq) {
      seq.setState(obj);
    }
    if (dbn) {
      dbn.setState(obj);
    }
  },

  setMoving: function(index, val) {
    var  obj = {moving: val};
    var  seq = this.refs.seqview.refs['letterref' + index];
    var  dbn = this.refs.dbnview.refs['letterref' + index];
    if (seq) {
      seq.setState(obj);
    }
    if (dbn) {
      dbn.setState(obj);
    }
  },

  render: function () {
    return (<div className="sequence-form-wrapper-div">
              <SequenceFormView ref='seqview' value={this.state.seq} type="seq" error={this.state.error}
                onSelected={this.props.onSelected} onChange={this.onChange}
                placeholder="Enter DNA sequence" />
              <SequenceFormView ref='dbnview' value={this.state.dbn} type="dbn" error={this.state.error}
                onSelected={this.props.onSelected} onChange={this.onChange}
                placeholder="Enter DBN" />
              <ApplyChanges dirty={this.state.dirty} onApply={this.onApply} />
            </div>);
  }
});

module.exports = SequenceView;
