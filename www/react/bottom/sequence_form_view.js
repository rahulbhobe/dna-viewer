import React from 'react';
import ReactDOM from 'react-dom';
import SequenceLetter from './sequence_letter';
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
      var inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
    }
  };

  onChange (evt) {
    var value = evt.target.value.toUpperCase();
    var obj = {
      seq: this.props.seqTemp,
      dbn: this.props.dbnTemp
    };
    obj[this.props.type] = value;
    this.props.actions.setTempSequence(obj.seq, obj.dbn);
  };

  getValueForView () {
    var obj = {
      seq: this.props.seqTemp,
      dbn: this.props.dbnTemp
    };
    return obj[this.props.type];
  };

  onBlur () {
    ReactDOM.findDOMNode(this.refs.inp).value = this.getValueForView();
    this.setState({editMode: false});
  };

  onClick () {
    this.setState({editMode: true});
    var inputBox = ReactDOM.findDOMNode(this.refs.inp);
    inputBox.focus();
    inputBox.select();
  };

  render () {
    var formClass = classNames('dna-base-font', {'sequence-has-error': this.props.hasErrors});
    var inpClass = classNames({'hidden': !this.state.editMode});
    var divClass = classNames({'hidden':  this.state.editMode}, 'sequence-form-div');

    var str = this.getValueForView();
    var letterDivs = [];
    for (var ii=0; ii<str.length; ii++) {
      letterDivs.push((<SequenceLetter letter={str[ii]} index={ii}
                        onSelected={this.props.onSelected}
                        key={"letter_" + ii}/>));
    }

    return (<div className='sequence-form'>
              <form className={formClass}>
                <input type="text" className={inpClass} value={this.getValueForView()}
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

var mapStateToProps = (state, ownProps) => {
  return {
    seqTemp:   state.tempSequence.seq,
    dbnTemp:   state.tempSequence.dbn,
    hasErrors: state.sequenceViewHasErrors
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceFormView);