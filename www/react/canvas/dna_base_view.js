import React from 'react';
import * as d3 from 'd3';
import SequenceUtils from '../../utils/sequence_utils';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class DnaBaseView extends React.Component {
  constructor (props) {
    super(props);

    this.onMouseOver    = this.onMouseOver.bind(this);
    this.onMouseOut     = this.onMouseOut.bind(this);
    this.onDragStarted  = this.onDragStarted.bind(this);
    this.onDragging     = this.onDragging.bind(this);
    this.onDragEnded    = this.onDragEnded.bind(this);
  };


  render () {
    if (this.props.ignore) return null;
    let {x, y, index, type} = this.props;
    var classes =  classNames('dna-base', 'dna-base-size', 'dna-base-' + type.toLowerCase(), {
                                'dna-base-highlighted': this.props.hover || this.props.dragging
                              });
    var textCls = classNames('dna-text', 'dna-base-font');
    var clsName = classNames({'dna-base-banned-pairing': this.props.bannedCursorWhenMoving});

    return (<g className={clsName} ref='gnode' transform={'translate(' + x + ', ' + y + ')'}>
              <circle className={classes} data-index={index} />
              <text className={textCls} textAnchor='middle' dominantBaseline='central'>{type}</text>
            </g>);
  };

  componentDidMount () {
    this.registerCallbacks();
  };

  componentDidUpdate () {
    this.registerCallbacks();
  };

  registerCallbacks () {
    let gnode = this.refs.gnode;
    if (!gnode) return;

    d3.select(gnode).call(d3.drag()
                    .on('start', this.onDragStarted)
                    .on('drag', this.onDragging)
                    .on('end', this.onDragEnded));
    d3.select(gnode).on('mouseover', this.onMouseOver);
    d3.select(gnode).on('mouseout',  this.onMouseOut);
  };

  onMouseOver () {
    this.props.actions.setHoverNode(this.props.index);
  };

  onMouseOut () {
    this.props.actions.resetHoverNode();
  };

  getOtherNodeIndexAtEvent () {
    let canvas = this.props.canvas;
    let {x, y} = d3.event;
    let nodes  = canvas.getNodesAtLocation(x, y).filter(node => node!==this.props.index);
    if (nodes.length===0) return -1;
    return nodes[0];
  };

  onDragStarted () {
    let simulation = this.props.simulation;
    let node       = this.props.node;
    if (!d3.event.active) simulation.alphaTarget(0.3).alphaDecay(0.03).restart();
    node.fx = node.x;
    node.fy = node.y;
    this.props.actions.resetHoverNode();
    this.props.actions.setDraggingNode(this.props.index);
  };

  onDragging () {
    let node  = this.props.node;
    node.fx   = d3.event.x;
    node.fy   = d3.event.y;
    let other = this.getOtherNodeIndexAtEvent()
    this.props.actions.setHoverNode(other);
  };

  onDragEnded () {
    let simulation = this.props.simulation;
    let node       = this.props.node;
    if (!d3.event.active) simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
    this.props.actions.resetDraggingNode();
    this.props.actions.resetHoverNode();

    var other  = this.getOtherNodeIndexAtEvent();
    if (other===-1) { return; }

    var sequenceParser = SequenceUtils.getJoinedSequence(this.props.sequenceParser, this.props.index, other);
    if (!sequenceParser) {
      return;
    }

    let {seq, dbn} = sequenceParser.getData();
    this.props.actions.setSequenceParser(sequenceParser);
    this.props.actions.setTempSequence(seq, dbn);
  };

  bannedCursorWhenMoving (other) {
    let index = this.props.index;
    let sequenceParser = this.props.sequenceParser;
    let bases = sequenceParser.getBases();

    if (other<0) return false;

    let draggingBase = bases[dragging];
    let thisBase = bases[index];
    return !thisBase.canPairWith(draggingBase);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let index = initialOwnProps.index;

  return (state) => {
    let animated = state.simulatedData.animated;
    let bases    = state.sequenceParser.getBases();
    if (index >= animated.length) return {ignore: true};
    if (index >= bases.length)    return {ignore: true};
    return {
      x: animated[index].x.toFixed(2),
      y: animated[index].y.toFixed(2),
      node: animated[index],
      simulation: state.simulatedData.simulation,
      type: bases[index].getType(),
      hover: state.hover === index,
      dragging: state.dragging === index,
      sequenceParser: state.sequenceParser
    };
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DnaBaseView);
