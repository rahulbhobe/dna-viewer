import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import DebugUtils from '../src/debug';
import SequenceParser from '../src/sequence_parser';
import store from '../store/store';
import * as actions from '../store/actions';
import request from 'request';
import promisify from 'es6-promisify';


class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
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

    this.onMouseMove       = this.onMouseMove.bind(this);
    this.onMouseUp         = this.onMouseUp.bind(this);
    this.onMouseDown       = this.onMouseDown.bind(this);
    this.onMouseLeave      = this.onMouseLeave.bind(this);
    this.handleResize      = this.handleResize.bind(this);
    this.onSequenceChanged = this.onSequenceChanged.bind(this);
    this.onSelected        = this.onSelected.bind(this);
    this.onMoving          = this.onMoving.bind(this);
  };

  render () {
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
  };

  handleResize (e) {
    this.setState({
      windowWidth: window.innerWidth,
      updateSequence: false
    });
  };

  componentWillMount () {
    this.moving = -1;
    this.selected = -1;
  };

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);

    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    svg.addEventListener('mousemove',  this.onMouseMove, false);
    svg.addEventListener('mouseup',    this.onMouseUp, false);
    svg.addEventListener('mousedown',  this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);

    console.log('store: ', store.getState());
    store.subscribe(()=>{
      console.log('store: ', store.getState());
    });
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);

    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    svg.removeEventListener('mousemove',  this.onMouseMove, false);
    svg.removeEventListener('mouseup',    this.onMouseUp, false);
    svg.removeEventListener('mousedown',  this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
  };

  onSequenceChanged (seq, dbn) {
    this.setState({
      sequenceParser: new SequenceParser(seq, dbn),
      seq: seq,
      dbn: dbn,
      updateSequence: true
    });
  };

  setStateForBaseViewAtIndex (index, stateObj) {
    if (index === -1) { return; } // Can happen.

    var canvas   = this.refs.canvas;
    var baseView = canvas.refs['baseref' + index];
    if (!baseView) { return; } // Can happen.
    baseView.setState(stateObj);
  };

  onSelected (selected) {
    var previous = this.selected;

    if (previous===selected) { return; }

    store.dispatch(actions.hoverNodeReset());
    this.setStateForBaseViewAtIndex(previous, {selected: false});
    this.refs.sequence.setStateForIndex(previous, {selected: false});

    store.dispatch(actions.hoverNodeSet(selected));
    this.setStateForBaseViewAtIndex(selected, {selected: true});
    this.refs.sequence.setStateForIndex(selected, {selected: true});

    this.selected = selected;
  };

  onMoving (moving) {
    store.dispatch(actions.draggingNodeSet(moving));
    this.setStateForBaseViewAtIndex(moving, {moving: true});
    this.refs.sequence.setStateForIndex(moving, {moving: true});
    this.moving = moving;
  };

  getIndexAtClientPosition (clientX, clientY) {
    var canvas = this.refs.canvas;
    var svg    = canvas.refs.svg;
    var found  = -1;

    var boundingRect   = svg.getBoundingClientRect();
    var hitTestRect    = svg.createSVGRect();

    hitTestRect.x = clientX - boundingRect.left;
    hitTestRect.y = clientY - boundingRect.top;
    hitTestRect.width   = 1;
    hitTestRect.height  = 1;

    svg.getIntersectionList(hitTestRect, null).forEach(function (elem) {
      if (elem.tagName !== 'circle') { return; }
      found = parseInt(elem.getAttribute('data-index'));
    });
    return found;
  };

  onMouseDown (event) {
    var moving = this.getIndexAtClientPosition(event.clientX, event.clientY);
    this.onMoving(moving);
  };

  onMouseMove (event) {
    var selected = this.getIndexAtClientPosition(event.clientX, event.clientY);
    this.onSelected(selected);

    if (this.state.moving === -1) { return; }

    this.setState({
      movingX: event.x,
      movingY: event.y,
      updateSequence: false
    });
  };

  onMouseUp (event) {
    var moving = this.moving;

    if (moving === -1) { return; }

    store.dispatch(actions.draggingNodeReset());
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
  };

  onMouseLeave () {
    var moving = this.moving;

    if (moving === -1) { return; }

    store.dispatch(actions.draggingNodeReset());
    this.setStateForBaseViewAtIndex(moving, {moving: false});
    this.refs.sequence.setStateForIndex(moving, {moving: false});

    this.moving = -1;
  };
};


document.addEventListener("DOMContentLoaded", function(event) {
  var getData = function() {
    var defaultRet = new Promise(function(resolve) {
      resolve(DebugUtils.debug_examples[0]);
    });

    var url = window.location.pathname.substring(1);
    if (!url) {
      return defaultRet;
    }

    var data = {url};
    return promisify(request.post)(window.location.origin + '/data', {form: data})
    .then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    }).catch((err) => {
      console.log(err);
      return defaultRet;
    });
  };

  getData()
  .then(function(obj) {
    var sequenceParser = new SequenceParser(obj.seq, obj.dbn);
    ReactDOM.render(
      <DnaViewer sequenceParser={sequenceParser} seq={obj.seq} dbn={obj.dbn}/>,
      document.getElementById('body-div')
    );
  });
});

export default DnaViewer;
