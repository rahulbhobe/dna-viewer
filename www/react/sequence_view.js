var SequenceFormView = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.value,
      editMode: false
    };
  },

  componentDidUpdate: function() {
    if (this.state.editMode) {
      var inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
      inputBox.select();
    }
  },

  onChange: function (evt) {
    this.setState({ value: evt.target.value.toUpperCase()});
  },

  onBlur: function () {
    ReactDOM.findDOMNode(this.refs.inp).value = this.state.value;
    this.setState({editMode: false});
  },

  onClick: function () {
    this.setState({editMode: true});
  },

  render: function () {
    var formClass = "sequence-form";
    if (this.state.hasError) {
      formClass += " sequence-has-error-local";
    }

    var inpClass =  this.state.editMode ? "" : "hidden";
    var divClass = !this.state.editMode ? "" : "hidden";

    return (<div>
              <form className={formClass}>
                <input type="text" className={inpClass} defaultValue={this.props.value} onChange={this.onChange} onBlur={this.onBlur} ref="inp" placeholder={this.props.placeholder} style={{width: '80%'}} ></input>
                <div className={divClass} onClick={this.onClick}>{this.state.value}</div>
              </form>
            </div>);
  }
});

var SequenceView = React.createClass({
  render: function () {
    return (<div>
              <SequenceFormView value={debug_examples[0].seq} placeholder="Enter DNA sequence" />
              <SequenceFormView value={debug_examples[0].dbn} placeholder="Enter DBN" />
            </div>);
  }
});
