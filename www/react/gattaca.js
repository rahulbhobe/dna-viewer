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
    };
  },

  render: function () {
    return (<div>
              <Canvas sequenceParser={this.props.sequenceParser} selected={this.state.selected} onSelected={this.onSelected}/>
              <SequenceView onSequenceChanged={this.onSequenceChanged} selected={this.state.selected} onSelected={this.onSelected}/>
            </div>);
  },

  getInitialState: function() {
    return {windowWidth: window.innerWidth};
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

  onSequenceChanged: function() {
    this.forceUpdate();
  },

  onSelected: function(selected) {
    this.setState({selected: selected});
  }
});


$(document).ready(function () {
  var pair = DebugUtils.debug_examples[0];
  var sequenceParser = SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <GATTACA sequenceParser={sequenceParser}/>,
    document.getElementById('body-div')
  );
});

module.exports = GATTACA;