import React from 'react';
import ReactDOM from 'react-dom';
import GridLayout from './grid_layout';
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
      var clsNames = classNames('sequence-change-button', 'sequence-form-div', {'sequence-change-button-hidden': !this.props.dirty});
      return (<div>
                <input type="image" className={clsNames} onClick={this.props.onClick} src={'/res/' + this.props.buttonText.toLowerCase() + '-button.png'}/>
              </div>);
  };
};

class SequenceView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      error: false
    };

    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onApply  = this.onApply.bind(this);
    this.isDirty  = this.isDirty.bind(this);
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      error: false
    });
  };

  isDirty () {
    if (this.props.seqTemp !== this.props.seqPerm) {
      return true;
    } else if (this.props.dbnTemp !== this.props.dbnPerm) {
      return true;
    }

    return false;
  };

  onChange (type, value) {
    var obj = {
      seq: this.props.seqTemp,
      dbn: this.props.dbnTemp
    };
    obj[type] = value;
    this.props.actions.setTempSequence(obj.seq, obj.dbn);
  };

  onCancel () {
    this.props.actions.setTempSequence(this.props.seqPerm, this.props.dbnPerm);
    this.setState({
      error: false
    });
  };

  onApply () {
    var sequenceParser = new SequenceParser(this.props.seqTemp, this.props.dbnTemp);
    if (sequenceParser.hasErrors()) {
      this.setState({error: true});
      return;
    }
    this.props.actions.setSequenceParser(sequenceParser);
  };

  getLayout() {
    return [
      {x:0,  y:0,  w:25,  h:1,  v: true,  d: (<SequenceFormView value={this.props.seqTemp} type="seq" error={this.state.error} onChange={this.onChange} placeholder="Enter DNA sequence" />)},
      {x:0,  y:1,  w:25,  h:1,  v: true,  d: (<SequenceFormView value={this.props.dbnTemp} type="dbn" error={this.state.error} onChange={this.onChange} placeholder="Enter DBN" />)},
      {x:25, y:0,  w:2,   h:2,  v: true,  d: (<SequenceChanges dirty={this.isDirty()} onClick={this.onCancel} buttonText={'Cancel'}/>)},
      {x:27, y:0,  w:2,   h:2,  v: true,  d: (<SequenceChanges dirty={this.isDirty()} onClick={this.onApply} buttonText={'Apply'}/>)}
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
