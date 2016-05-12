var SequenceLetter = React.createClass({
  render: function () {
    var clsName = this.props.selected ? "higlight-sequence-text" : "";
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

  componentDidUpdate: function() {
    if (this.state.editMode) {
      var inputBox = ReactDOM.findDOMNode(this.refs.inp);
      inputBox.focus();
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
    var inputBox = ReactDOM.findDOMNode(this.refs.inp);
    inputBox.focus();
    inputBox.select();
  },

  render: function () {
    var formClass = "sequence-form";
    if (this.state.hasError) {
      formClass += " sequence-has-error-local";
    }

    var inpClass   =  this.state.editMode ? "" : "hidden";
    var divClass   = !this.state.editMode ? "" : "hidden";
    divClass += " sequence-form-div";

    var str = this.state.value;
    var letterDivs = [];
    for (var ii=0; ii<str.length; ii++) {
      letterDivs.push((<SequenceLetter letter={str[ii]} index={ii} selected={this.props.selected===ii} onSelected={this.props.onSelected}/>));
    }


    return (<div>
              <form className={formClass}>
                <input type="text" className={inpClass} defaultValue={this.props.value} onChange={this.onChange} onBlur={this.onBlur} ref="inp" placeholder={this.props.placeholder} style={{width: '100%'}} ></input>
                <div className={divClass} onClick={this.onClick} >
                  {letterDivs}
                </div>
              </form>
            </div>);
  }
});

var SequenceView = React.createClass({
  render: function () {
    return (<div>
              <SequenceFormView value={debug_examples[0].seq} selected={this.props.selected} onSelected={this.props.onSelected} placeholder="Enter DNA sequence" />
              <SequenceFormView value={debug_examples[0].dbn} selected={this.props.selected} onSelected={this.props.onSelected} placeholder="Enter DBN" />
            </div>);
  }
});
