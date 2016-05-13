var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Canvas = require('./canvas');
var SettingsView = require('./settings_view');
var SequenceView = require('./sequence_view');
var DebugUtils = require('../src/debug');
var SequenceParser = require('../src/sequence_parser');

var GATTACA = React.createClass({
  getInitialState: function() {
    return {
      selected: null,
      seq: this.props.seq,
      dbn: this.props.dbn,
      sequenceParser: this.props.sequenceParser,
      windowWidth: window.innerWidth
    };
  },

  render: function () {
    return (<div>
              <Canvas sequenceParser={this.state.sequenceParser} selected={this.state.selected} onSelected={this.onSelected}/>
              <SequenceView onSequenceChanged={this.onSequenceChanged} seq={this.state.seq} dbn={this.state.dbn} selected={this.state.selected} onSelected={this.onSelected}/>
              <SettingsView />
            </div>);
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  onSequenceChanged: function(seq, dbn) {
    this.setState({
      sequenceParser: new SequenceParser(seq, dbn),
      seq: seq,
      dbn: dbn
    });
  },

  onSelected: function(selected) {
    this.setState({selected: selected});
  }
});


$(document).ready(function () {
  var pair = DebugUtils.debug_examples[0];
  var sequenceParser = new SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <GATTACA sequenceParser={sequenceParser} seq={pair.seq} dbn={pair.dbn}/>,
    document.getElementById('body-div')
  );
});

module.exports = GATTACA;