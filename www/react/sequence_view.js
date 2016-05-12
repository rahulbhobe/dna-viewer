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

  getDivTextArr: function () {
    var str = this.state.value;
    var sel = this.props.selected;
    if (sel === -1) {
      return [str, "", ""];
    }
    return [str.substring(0, sel), str.substring(sel, sel+1), str.substring(sel+1)];
  },

  render: function () {
    var formClass = "sequence-form";
    if (this.state.hasError) {
      formClass += " sequence-has-error-local";
    }

    var inpClass   =  this.state.editMode ? "" : "hidden";
    var divClass   = !this.state.editMode ? "" : "hidden";
    var divTextArr = this.getDivTextArr();

    return (<div>
              <form className={formClass}>
                <input type="text" className={inpClass} defaultValue={this.props.value} onChange={this.onChange} onBlur={this.onBlur} ref="inp" placeholder={this.props.placeholder} style={{width: '80%'}} ></input>
                <div className={divClass} onClick={this.onClick}>
                  {divTextArr[0]}
                  <span className="higlight-sequence-text">
                    {divTextArr[1]}
                  </span>
                  {divTextArr[2]}
                </div>
              </form>
            </div>);
  }
});

var SequenceView = React.createClass({
  render: function () {
    return (<div>
              <SequenceFormView value={debug_examples[0].seq} selected={this.props.selected} placeholder="Enter DNA sequence" />
              <SequenceFormView value={debug_examples[0].dbn} selected={this.props.selected} placeholder="Enter DBN" />
            </div>);
  }
});
