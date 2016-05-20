var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var Canvas = require('./canvas');
var SettingsView = require('./settings_view');
var SequenceView = require('./sequence_view');
var ShareLink = require('./share_link');
var DebugUtils = require('../src/debug');
var SequenceParser = require('../src/sequence_parser');
var _ = require('underscore');

var DnaStructure = React.createClass({
  getInitialState: function() {
    return {
      selected: null,
      moving: null,
      seq: this.props.seq,
      dbn: this.props.dbn,
      sequenceParser: this.props.sequenceParser,
      windowWidth: window.innerWidth
    };
  },

  render: function () {
    return (<div>
              <ShareLink seq={this.state.seq} dbn={this.state.dbn}/>
              <Canvas sequenceParser={this.state.sequenceParser}
                selected={this.state.selected} moving={this.state.moving}
                onSelected={this.onSelected} onMouseClick={this.onMoving}>
              </Canvas>
              <SequenceView onSequenceChanged={this.onSequenceChanged}
                seq={this.state.seq} dbn={this.state.dbn}
                selected={this.state.selected} moving={this.state.moving}
                onSelected={this.onSelected}>
              </SequenceView>
              <SettingsView/>
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
  },

  onMoving: function(moving) {
    this.setState({moving: moving});
    if (moving >= 0) {
      document.addEventListener('mouseup', this.onMouseUp, false);
    }
  },

  onMouseUp: function(event) {
    document.removeEventListener('mouseup', this.onMouseUp, false);
    var moving = this.state.moving;
    this.setState({moving: null});

    var found = null;
    _(event.target.classList).each(function (cls){
      if (cls.includes('dna-target-spot-')) {
        found = parseInt(cls.substring('dna-target-spot-'.length));
      }
    });

    if (!found) return;
    if (moving==found) return;

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
  }
});


$(document).ready(function () {
  var getDataFromDiv = function () {
    var seq = $("#data-div").data("seq");
    var dbn = $("#data-div").data("dbn");

    if (!seq || !dbn) return;

    return {
      seq: seq,
      dbn: dbn
    };
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
    <DnaStructure sequenceParser={sequenceParser} seq={obj.seq} dbn={obj.dbn}/>,
    document.getElementById('body-div')
  );
});

module.exports = DnaStructure;