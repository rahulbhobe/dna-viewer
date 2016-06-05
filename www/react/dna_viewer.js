var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Canvas = require('./canvas');
import SettingsView from './settings_view';
var SequenceView = require('./sequence_view');
import ShareLink from './share_link';
var DebugUtils = require('../src/debug');
var SequenceParser = require('../src/sequence_parser');
var _ = require('underscore');

var DnaViewer = React.createClass({
  getInitialState: function() {
    return {
      selected: -1,
      moving: -1,
      movingX: null,
      movingY: null,
      seq: this.props.seq,
      dbn: this.props.dbn,
      sequenceParser: this.props.sequenceParser,
      windowWidth: window.innerWidth,
      updateSequence: false
    };
  },

  render: function () {
    return (<div>
              <ShareLink seq={this.state.seq} dbn={this.state.dbn}/>
              <Canvas ref='canvas' sequenceParser={this.state.sequenceParser}
                moving={this.moving} movingX={this.state.movingX} movingY={this.state.movingY}>
              </Canvas>
              <SequenceView ref='sequence' onSequenceChanged={this.onSequenceChanged}
                seq={this.state.seq} dbn={this.state.dbn} updateSequence={this.state.updateSequence}
                onSelected={this.onSelected}>
              </SequenceView>
              <SettingsView/>
            </div>);
  },

  handleResize: function(e) {
    this.setState({
      windowWidth: window.innerWidth,
      updateSequence: false
    });
  },

  componentWillMount: function() {
    this.moving = -1;
    this.selected = -1;
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);

    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    svg.addEventListener('mousemove', this.onMouseMove, false);
    svg.addEventListener('mouseup',   this.onMouseUp, false);
    svg.addEventListener('mousedown', this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);

    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    svg.removeEventListener('mousemove', this.onMouseMove, false);
    svg.removeEventListener('mouseup',   this.onMouseUp, false);
    svg.removeEventListener('mousedown', this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
  },

  onSequenceChanged: function(seq, dbn) {
    this.setState({
      sequenceParser: new SequenceParser(seq, dbn),
      seq: seq,
      dbn: dbn,
      updateSequence: true
    });
  },

  setStateForBaseViewAtIndex: function(index, stateObj) {
    if (index === -1) { return; } // Can happen.

    var canvas   = this.refs.canvas;
    var baseView = canvas.refs['baseref' + index];
    if (!baseView) { return; } // Can happen.
    baseView.setState(stateObj);
  },

  onSelected: function(selected) {
    var previous = this.selected;

    if (previous===selected) { return; }

    this.setStateForBaseViewAtIndex(previous, {selected: false});
    this.refs.sequence.setStateForIndex(previous, {selected: false});

    this.setStateForBaseViewAtIndex(selected, {selected: true});
    this.refs.sequence.setStateForIndex(selected, {selected: true});

    this.selected = selected;
  },

  onMoving: function(moving) {
    this.setStateForBaseViewAtIndex(moving, {moving: true});
    this.refs.sequence.setStateForIndex(moving, {moving: true});
    this.moving = moving;
  },

  getIndexAtClientPosition: function(clientX, clientY) {
    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    var found  = -1;

    var boundingRect   = svg.getBoundingClientRect();
    var hitTestRect    = svg.createSVGRect();

    hitTestRect.x = clientX - boundingRect.left;
    hitTestRect.y = clientY - boundingRect.top;
    hitTestRect.width   = 1;
    hitTestRect.height  = 1;

    _(svg.getIntersectionList(hitTestRect, null)).each(function (elem) {
      if (elem.tagName !== 'circle') { return; }
      found = parseInt(elem.getAttribute('data-index'));
    });
    return found;
  },

  onMouseDown: function(event) {
    var moving = this.getIndexAtClientPosition(event.clientX, event.clientY);
    this.onMoving(moving);
  },

  onMouseMove: function(event) {
    var selected = this.getIndexAtClientPosition(event.clientX, event.clientY);
    this.onSelected(selected);

    if (this.state.moving === -1) { return; }

    this.setState({
      movingX: event.x,
      movingY: event.y,
      updateSequence: false
    });
  },

  onMouseUp: function(event) {
    var moving = this.moving;

    if (moving === -1) { return; }

    this.setStateForBaseViewAtIndex(moving, {moving: false});
    this.refs.sequence.setStateForIndex(moving, {moving: false});

    this.moving = -1;
    this.setState({
      movingX: null,
      movingY: null,
      updateSequence: false
    });

    var found = this.getIndexAtClientPosition(event.clientX, event.clientY);

    if (found===-1) return;
    if (found===moving) return;

    var sequenceParser = this.state.sequenceParser;
    var bases = sequenceParser.getBases();
    var base1 = bases[moving];
    var base2 = bases[found];

    if (!base1.isUnpaired()) return;
    if (!base2.isUnpaired()) return;
    if (!base1.canPairWith(base2)) return;

    var seq = this.state.seq;
    var dbn = this.state.dbn;
    var min = Math.min(moving, found);
    var max = Math.max(moving, found);

    var newdbn =  dbn.substring(0, min) + '(' + dbn.substring(min+1, max) + ')' + dbn.substring(max+1);
    var sequenceParserNew = new SequenceParser(seq, newdbn);
    if (sequenceParser.hasErrors()) {
      return;
    }

    this.onSequenceChanged(seq, newdbn);
  },

  onMouseLeave: function() {
    var moving = this.moving;

    if (moving === -1) { return; }

    this.setStateForBaseViewAtIndex(moving, {moving: false});
    this.refs.sequence.setStateForIndex(moving, {moving: false});

    this.moving = -1;
  }
});


$(document).ready(function () {
  var getDataFromDiv = function () {
    return $("#data-div").data("data");
  };

  var sequenceParser = null;
  var obj = getDataFromDiv();
  if (obj && ("seq" in obj) && ("dbn" in obj)) {
    sequenceParser = new SequenceParser(obj.seq, obj.dbn);
    if (sequenceParser.hasErrors()) {
      sequenceParser = null;
    }
  }

  if (!sequenceParser) {
    obj = DebugUtils.debug_examples[0];
    sequenceParser = new SequenceParser(obj.seq, obj.dbn);
  }

  ReactDOM.render(
    <DnaViewer sequenceParser={sequenceParser} seq={obj.seq} dbn={obj.dbn}/>,
    document.getElementById('body-div')
  );
});

module.exports = DnaViewer;