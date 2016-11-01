import React from 'react';
import DnaBaseView from './dna_base_view';
import DnaAnchorView from './dna_anchor_view';
import DnaBackboneView from './dna_backbone_view';
import DnaPairView from './dna_pair_view';
import DnaAnnotationView from './dna_annotation_view';
import {Vector, MatrixTransformations} from '../../mathutils/gl_matrix_wrapper';
import AngleConverter from '../../mathutils/angle_converter';
import Dimensions from '../../utils/dimensions';
import ArrayUtils from '../../utils/array_utils';
import classNames from 'classnames';
import store from '../../store/store';
import debounce from 'debounce';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

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
    this.onResize = this.onResize.bind(this);
    this.resetEventDataDebounce = debounce(this.resetEventDataDebounce.bind(this), 200);
  };

  render () {
    let sequenceData = this.props.sequenceData;
    if (sequenceData.hasErrors()) {
      return null;
    }

    let svgClass         = classNames('svg-class', 'svg-cursor-' + this.props.cursorType);
    let {numBases}       = this.props;
    let {numConnections} = this.props;

    return (
      <svg className={svgClass} width={this.getWindowWidth()} height={this.getWindowHeight()} ref='svg' onContextMenu={this.onContextMenu} >

        <g> {ArrayUtils.range(numBases-1).map((index) => (<DnaBackboneView key={'backbone' + index} index={index} />))} </g>

        <g> {ArrayUtils.range(numConnections).map((index) => (<DnaPairView key={'pair' + index} index={index} />))} </g>

        <g> {ArrayUtils.range(numBases).map((index) => (<DnaAnchorView key={'anchor' + index} index={index} />))} </g>

        <g> {ArrayUtils.orderedRange(numBases, this.props.dragging).map((index) => (<DnaBaseView key={'base' + index} index={index} canvas={this} />))} </g>

        <g> <DnaAnnotationView type='start'/> <DnaAnnotationView type='end'/> </g>

      </svg>);
  };

  componentDidMount () {
    let svg = this.refs.svg;
    svg.addEventListener('mousemove', this.onMouseMove, false);
    svg.addEventListener('mouseup', this.onMouseUp, false);
    svg.addEventListener('mousedown', this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);
    svg.addEventListener('mousewheel', this.onMouseWheel, false);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('keydown', this.onKeydown, false);
    document.addEventListener('mousewheel', this.onMouseWheelDoc, false);
  };

  componentWillUnmount () {
    let svg = this.refs.svg;
    svg.removeEventListener('mousemove', this.onMouseMove, false);
    svg.removeEventListener('mouseup', this.onMouseUp, false);
    svg.removeEventListener('mousedown', this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
    svg.removeEventListener('mousewheel', this.onMouseWheel, false);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('keydown', this.onKeydown, false);
    document.removeEventListener('mousewheel', this.onMouseWheelDoc, false);
  };

  setCanvasDimensions () {
    let {width, height}  = Dimensions.calculateCanvasDimensions();
    this.props.actions.setCanvasDimensions(width, height);
  };

  getPositionAtEvent (event) {
    let boundingRect   = this.getSvgRect();
    return {
      x: event.clientX - boundingRect.left,
      y: event.clientY - boundingRect.top
    };
  };

  getNodesAtLocation (x, y) {
    let svg         = this.refs.svg;
    let hitTestRect = svg.createSVGRect();

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
    let dataType = 'none';
    let data     = {};

    if (!event.shiftKey) {
      dataType = 'pan';
      data.origin = this.props.origin;
    } else {
      dataType = 'rotate';
      data.angle = this.props.rotationAngle;
    }

    this.props.actions.setEventData(dataType, this.getPositionAtEvent(event), data);
  };

  onMouseMove (event) {
    let data = store.getState().eventData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }
  };

  onMouseUp (event) {
    let data     = store.getState().eventData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }
    this.props.actions.resetEventData();
  };

  onMouseLeave () {
    this.props.actions.resetEventData();
  };

  onMouseWheel (event) {
    event.preventDefault();

    let dataType  = 'none';
    let data      = {};
    let wheelDistance = Math.round(event.wheelDeltaY/30);
    let zoomFactor    = this.props.zoomFactor + wheelDistance;
    if (zoomFactor < 25) {
      zoomFactor = 25;
    } else if (zoomFactor > 200) {
      zoomFactor = 200;
    }

    if (wheelDistance > 0) {
      dataType = 'zoomin';
      data.zoomFactor = this.props.zoomFactor;
    } else if (wheelDistance < 0) {
      dataType = 'zoomout';
      data.zoomFactor = this.props.zoomFactor;
    }

    if (zoomFactor !== this.props.zoomFactor) {
      this.props.actions.setEventData(dataType, this.getPositionAtEvent(event), data);
      this.props.actions.setZoomFactor(zoomFactor);
    }
    this.resetEventDataDebounce();
    return false;
  };

  resetEventDataDebounce () {
    this.props.actions.resetEventData();
  };

  onResize (e) {
    this.props.actions.setEventData('resize', {x: -1, y: -1}, {canvasDimensions: this.props.canvasDimensions});
    this.resetEventDataDebounce();
    this.setCanvasDimensions();
  };

  onKeydown (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
    if (event.keyCode !== 27) {
      return;
    }

    let data     = store.getState().eventData;
    if (data.type === 'pan') {
      this.cancelPan();
    } else if (data.type === 'rotate') {
      this.cancelRotate();
    }
    this.props.actions.resetEventData();
  };

  handleRotate (event) {
    let data            = store.getState().eventData;
    let startAngle      = data.startData.angle;
    let startPosition   = data.startData.position;
    let currentPosition = this.getPositionAtEvent(event);
    let midPoint        = Vector.create(this.getWindowWidth()*0.5, this.getWindowHeight()*0.5);
    let startVec        = Vector.create(startPosition.x, startPosition.y).subtract(midPoint);
    let currentVec      = Vector.create(currentPosition.x, currentPosition.y).subtract(midPoint);
    let angle           = AngleConverter.toDeg(currentVec.angleFrom(startVec));
    this.props.actions.setRotationAngle(startAngle + angle);
  };

  cancelRotate () {
    let data = store.getState().eventData;
    this.props.actions.setRotationAngle(data.startData.angle);
  };

  handlePan (event) {
    let data            = store.getState().eventData;
    let oldOrigin       = data.startData.origin;
    let startPosition   = data.startData.position;
    let currentPosition = this.getPositionAtEvent(event);
    let startPnt        = Vector.create(startPosition.x, startPosition.y);
    let currentPnt      = Vector.create(currentPosition.x, currentPosition.y);

    let matrixTrfs      = MatrixTransformations.create();
    matrixTrfs.append(m => m.rotate(AngleConverter.toRad(this.props.rotationAngle)));
    matrixTrfs.append(m => m.scale(1 / (this.props.zoomFactor*0.01)));

    let moveVec = matrixTrfs.transformPoint(currentPnt.subtract(startPnt));
    let org = Vector.create(oldOrigin.x, oldOrigin.y).subtract(moveVec);
    this.props.actions.setOrigin(org.asObj());
  };

  cancelPan () {
    let data = store.getState().eventData;
    this.props.actions.setOrigin(data.startData.origin);
  };

  getSvgRect () {
    let svg = this.refs.svg;
    return svg.getBoundingClientRect();
  };

  getWindowWidth () {
    return this.props.dimensions.width;
  };

  getWindowHeight () {
    return this.props.dimensions.height;
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    sequenceData: state.sequenceData,
    dragging: state.dragging,
    numBases: state.sequenceData.getBases().length,
    numConnections: state.sequenceData.getConnections().length,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    cursorType: state.canvasCursorType,
    dimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
