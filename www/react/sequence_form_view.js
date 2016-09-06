import React from 'react';
import ReactDOM from 'react-dom';
import SequenceLetter from './sequence_letter';
import classNames from 'classnames';

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

export default SequenceFormView;
