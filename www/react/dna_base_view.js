import React from 'react';
import * as d3 from 'd3';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {mapDispatchToProps} from '../store/action_dispatcher';

class DnaBaseView extends React.Component {
  constructor (props) {
    super(props);

    this.onMouseOver  = this.onMouseOver.bind(this);
    this.onMouseOut   = this.onMouseOut.bind(this);
    this.dragStarted  = this.dragStarted.bind(this);
    this.dragProgress = this.dragProgress.bind(this);
    this.dragEnded    = this.dragEnded.bind(this);
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
                    .on('start', this.dragStarted)
                    .on('drag', this.dragProgress)
                    .on('end', this.dragEnded));
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

  dragStarted () {
    let simulation = this.props.simulation;
    let node       = this.props.node;
    if (!d3.event.active) simulation.alphaTarget(0.3).alphaDecay(0.03).restart();
    node.fx = node.x;
    node.fy = node.y;
    this.props.actions.resetHoverNode();
    this.props.actions.setDraggingNode(this.props.index);
  };

  dragProgress () {
    let node  = this.props.node;
    node.fx   = d3.event.x;
    node.fy   = d3.event.y;
    let other = this.getOtherNodeIndexAtEvent()
    this.props.actions.setHoverNode(other);
  };

  dragEnded () {
    let simulation = this.props.simulation;
    let node       = this.props.node;
    if (!d3.event.active) simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
    this.props.actions.resetDraggingNode();
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
      index: index,
      x: animated[index].x.toFixed(2),
      y: animated[index].y.toFixed(2),
      node: animated[index],
      simulation: state.simulatedData.simulation,
      type: bases[index].getType(),
      hover: state.hover === index,
      dragging: state.dragging === index
    };
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DnaBaseView);
