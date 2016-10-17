import React from 'react';
import DnaBaseView from './dna_base_view';
import DnaAnchorView from './dna_anchor_view';
import DnaBackboneView from './dna_backbone_view';
import DnaPairView from './dna_pair_view';
import DnaAnnotationView from './dna_annotation_view';
import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';
import classNames from 'classnames';
import store from '../store/store';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';
import SequenceParser from '../src/sequence_parser';

class Canvas extends React.Component {
  constructor (props) {
    super(props);

    this.getSvgRect = this.getSvgRect.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onMouseWheelDoc = this.onMouseWheelDoc.bind(this);
  };

  render () {
    let sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    let svgClass         = classNames('svg-class', 'svg-cursor-' + this.props.mouseActionDataType);
    let width            = this.getWindowWidth();
    let height           = this.getWindowHeight();
    let {numBases}       = this.props;
    let {numConnections} = this.props;

    return (
      <svg className={svgClass} width={width} height={height} ref='svg' onContextMenu={this.onContextMenu} >
        <g>{Array.from(Array(numBases-1).keys()).map((index) => (<DnaBackboneView key={'backbone' + index} index={index} />))}</g>

        <g>{Array.from(Array(numConnections).keys()).map((index) => (<DnaPairView key={'pair' + index} index={index} />))}</g>

        <g>{Array.from(Array(numBases).keys()).map((index) => (<DnaAnchorView key={'anchor' + index} index={index} />))}</g>

        <g>{Array.from(Array(numBases).keys()).map((index) => (<DnaBaseView key={'base' + index} index={index} canvas={this} />))}</g>

        <DnaAnnotationView type='start'/>
        <DnaAnnotationView type='end'/>

      </svg>);
  };

  componentDidMount () {
    var svg = this.refs.svg;
    svg.addEventListener('mousemove', this.onMouseMove, false);
    svg.addEventListener('mouseup', this.onMouseUp, false);
    svg.addEventListener('mousedown', this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);
    svg.addEventListener('mousewheel', this.onMouseWheel, false);
    document.addEventListener('keydown', this.onKeydown, false);
    document.addEventListener('mousewheel', this.onMouseWheelDoc, false);
  };

  componentWillUnmount () {
    var svg = this.refs.svg;
    svg.removeEventListener('mousemove', this.onMouseMove, false);
    svg.removeEventListener('mouseup', this.onMouseUp, false);
    svg.removeEventListener('mousedown', this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
    svg.removeEventListener('mousewheel', this.onMouseWheel, false);
    document.removeEventListener('keydown', this.onKeydown, false);
    document.removeEventListener('mousewheel', this.onMouseWheelDoc, false);
  };

  getPositionAtEvent (event) {
    var boundingRect   = this.getSvgRect();
    return {
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top
    };
  };

  getNodesAtLocation (x, y) {
    var svg         = this.refs.svg;
    var hitTestRect = svg.createSVGRect();

    hitTestRect.x = x;
    hitTestRect.y = y;
    hitTestRect.width  = 1;
    hitTestRect.height = 1;

    return Array.from(svg.getIntersectionList(hitTestRect, null)).map((elem) => {
      if (elem.tagName !== 'circle') { return; }
      return parseInt(elem.getAttribute('data-index'));
    }).filter(Number);
  };

  onContextMenu (event) {
    event.preventDefault();
    return false;
  };

  onMouseWheelDoc (event) {
    event.preventDefault();
    return false;
  };

  onMouseDown (event) {
    var dataType = 'none';
    var data     = {};

    if (!event.shiftKey) {
      dataType = 'pan';
      data.origin = this.props.origin;
    } else {
      dataType = 'rotate';
      data.angle = this.props.rotationAngle;
    }

    this.props.actions.setCurrentMousePosition(this.getPositionAtEvent(event));
    this.props.actions.setMouseActionData(dataType, this.getPositionAtEvent(event), data);
  };

  onMouseMove (event) {
    this.props.actions.setCurrentMousePosition(this.getPositionAtEvent(event));

    var data = store.getState().mouseActionData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }
  };

  onMouseUp (event) {
    var data     = store.getState().mouseActionData;

    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }
    this.props.actions.resetMouseActionData();
  };

  onMouseLeave () {
    this.props.actions.resetMouseActionData();
  };

  onMouseWheel (event) {
    event.preventDefault();

    var wheelDistance = Math.round(event.wheelDeltaY/30);
    if (wheelDistance === 0) { return false; }
    var zoomFactor    = this.props.zoomFactor + wheelDistance;
    if (zoomFactor < 25) {
      zoomFactor = 25;
    } else if (zoomFactor > 200) {
      zoomFactor = 200;
    }
    if (zoomFactor === this.props.zoomFactor) { return false; }
    this.props.actions.setZoomFactor(zoomFactor);
    return false;
  };

  onKeydown (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
    if (event.keyCode !== 27) {
      return;
    }

    var data     = store.getState().mouseActionData;
    if (data.type === 'pan') {
      this.cancelPan();
    } else if (data.type === 'rotate') {
      this.cancelRotate();
    }
    this.props.actions.resetMouseActionData();
  };

  handleRotate (event) {
    var data            = store.getState().mouseActionData;
    var startAngle      = data.startData.angle;
    var startPosition   = data.startData.position;
    var currentPosition = this.getPositionAtEvent(event);
    var midPoint        = Vector.create(this.getWindowWidth()*0.5, this.getWindowHeight()*0.5);
    var startVec        = Vector.create(startPosition.x, startPosition.y).subtract(midPoint);
    var currentVec      = Vector.create(currentPosition.x, currentPosition.y).subtract(midPoint);
    var angle           = AngleConverter.toDeg(currentVec.angleFrom(startVec));
    this.props.actions.setRotationAngle(startAngle + angle);
  };

  cancelRotate () {
    var data = store.getState().mouseActionData;
    this.props.actions.setRotationAngle(data.startData.angle);
  };

  handlePan (event) {
    var data            = store.getState().mouseActionData;
    var oldOrigin       = data.startData.origin;
    var startPosition   = data.startData.position;
    var currentPosition = this.getPositionAtEvent(event);
    var startPnt        = Vector.create(startPosition.x, startPosition.y);
    var currentPnt      = Vector.create(currentPosition.x, currentPosition.y);

    var matrixTrfs      = MatrixTransformations.create();
    matrixTrfs.append(m => m.rotate(AngleConverter.toRad(this.props.rotationAngle)));
    matrixTrfs.append(m => m.scale(1 / (this.props.zoomFactor*0.01)));

    var moveVec = matrixTrfs.transformPoint(currentPnt.subtract(startPnt));
    var org = Vector.create(oldOrigin.x, oldOrigin.y).subtract(moveVec);
    this.props.actions.setOrigin(org.asObj());
  };

  cancelPan () {
    var data = store.getState().mouseActionData;
    this.props.actions.setOrigin(data.startData.origin);
  };

  getSvgRect () {
    var svg = this.refs.svg;
    return svg.getBoundingClientRect();
  };

  getWindowWidth () {
    return this.props.dimensions.width;
  };

  getWindowHeight () {
    return this.props.dimensions.height;
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceParser: state.sequenceParser,
    numBases: state.sequenceParser.getBases().length,
    numConnections: state.sequenceParser.getConnections().length,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    mouseActionDataType: state.mouseActionData.type,
    dimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
