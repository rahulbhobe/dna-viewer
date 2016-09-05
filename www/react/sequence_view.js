import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';
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
    var formClass = classNames('dna-base-font', {'sequence-has-error': this.props.error});
    var inpClass = classNames({'hidden': !this.state.editMode});
    var divClass = classNames({'hidden':  this.state.editMode}, 'sequence-form-div');

    var str = this.state.value;
    var letterDivs = [];
    for (var ii=0; ii<str.length; ii++) {
      letterDivs.push((<SequenceLetter letter={str[ii]} index={ii}
                        onSelected={this.props.onSelected}
                        key={"letter_" + ii}/>));
    }

    return (<div className='sequence-form'>
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

class SequenceChanges extends React.Component {
    render () {
      var clsNames = classNames('sequence-change-button', 'sequence-change-' + this.props.buttonText.toLowerCase(), 'sequence-form-div', {'sequence-change-button-hidden': !this.props.dirty});
      return (<div>
                <button type="button" className={clsNames} onClick={this.props.onClick}>{this.props.buttonText}</button>
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
    this.onCancel = this.onCancel.bind(this);
    this.onApply  = this.onApply.bind(this);
    this.isDirty  = this.isDirty.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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

  onCancel () {
    this.setState({
      seq: this.props.seq,
      dbn: this.props.dbn,
      error: false
    });
  };

  onApply () {
    var sequenceParser = new SequenceParser(this.state.seq, this.state.dbn);
    if (sequenceParser.hasErrors()) {
      this.setState({error: true});
      return;
    }
    this.props.actions.setSequenceParser(sequenceParser);
  };

  getLayout() {
    return [
      {x:0,  y:0,  w:25,  h:1,  i: 'SequenceFormViewSEQ'},
      {x:0,  y:1,  w:25,  h:1,  i: 'SequenceFormViewDBN'},
      {x:25, y:0,  w:2,   h:2,  i: 'SequenceChangesCancel'},
      {x:27, y:0,  w:2,   h:2,  i: 'SequenceChangesApply'},
    ];
  };

  render () {
    var properties = {
      className: "layout",
      isDraggable: false,
      isResizable: false,
      cols: 29,
      rowHeight: 32*2,
      width: window.innerWidth,
      margin: [0, 0],
      verticalCompact: false
    };

    return (<div className="sequence-form-wrapper-div">
              <ReactGridLayout layout={this.getLayout()}{...properties}>
                <div key='SequenceFormViewSEQ'>
                  <SequenceFormView value={this.state.seq} type="seq" error={this.state.error}
                    onChange={this.onChange} placeholder="Enter DNA sequence" />
                </div>
                <div key='SequenceFormViewDBN'>
                  <SequenceFormView value={this.state.dbn} type="dbn" error={this.state.error}
                    onChange={this.onChange} placeholder="Enter DBN" />
                </div>
                <div key='SequenceChangesCancel'>
                  <SequenceChanges dirty={this.isDirty()} onClick={this.onCancel} buttonText={'Cancel'}/>
                </div>
                <div key='SequenceChangesApply'>
                  <SequenceChanges dirty={this.isDirty()} onClick={this.onApply} buttonText={'Apply'}/>
                </div>
              </ReactGridLayout>
            </div>);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    seq: state.sequenceParser.getData().seq,
    dbn: state.sequenceParser.getData().dbn,
    canvasDimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceView);
