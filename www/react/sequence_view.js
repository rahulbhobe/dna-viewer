var SequenceView = React.createClass({
  getInitialState: function () {
    return {
      hasError: false,
      seq: debug_examples[0].seq,
      dbn: debug_examples[0].dbn,
      selected: 50
    };
  },

  componentDidMount: function () {
    this.refs.seq.selectionStart = this.state.selected;
    this.refs.seq.selectionEnd   = this.state.selected+1;
  },

  sequenceChange: function (evt) {
    this.setState({ seq: evt.target.value.toUpperCase()});
  },

  dbnChange: function (evt) {
    this.setState({ dbn: evt.target.value});
  },

  onBlur: function () {
    ReactDOM.findDOMNode(this.refs.seq).value = this.state.seq;
    ReactDOM.findDOMNode(this.refs.dbn).value = this.state.dbn;
  },

  render: function () {

    var formClass = "sequence-form";
    if (this.state.hasError) {
      formClass += " has-error-local";
    }

    return (<div>
              <form className={formClass}>
                <input type="text" defaultValue={this.state.seq} onChange={this.sequenceChange} onBlur={this.onBlur} ref="seq" placeholder="Enter DNA Sequence" size="120" ></input>
              </form>
              <form className={formClass}>
                <input type="text" defaultValue={this.state.dbn} onChange={this.dbnChange} onBlur={this.onBlur} ref="dbn" placeholder="Enter DBN" size="120" ></input>
              </form>
            </div>);
  }
});
