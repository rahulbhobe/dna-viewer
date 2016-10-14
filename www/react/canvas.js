import React from 'react';
import DnaBaseView from './dna_base_view';
import DnaLineView from './dna_line_view';
import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';
import classNames from 'classnames';
import store from '../store/store';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';
import SequenceParser from '../src/sequence_parser';
import SequenceUtils from '../utils/sequence_utils';

class DnaAnnotation extends React.Component {
  render () {
    var text     = this.props.text;
    var textCls  = "dna-text dna-base-font";
    var location = this.getLocation().asObj();

    return (<g transform={"translate(" + location.x + ", " + location.y + ")"} >
              <text className={textCls} textAnchor="middle" dominantBaseline="central">{text}</text>
            </g>);
  };

  getLocation () {
    var point   = this.props.point.clone();
    var other1  = this.props.other1.clone();
    var other2  = this.props.other2.clone();
    var vec1    = point.subtract(other1);
    var vec2    = point.subtract(other2);
    var bisect  = vec1.add(vec2);
    var drawAt  = point.add(bisect.normalize().scale(20));

    return drawAt;
  };
};

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
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var svgClass    = classNames('svg-class', 'svg-cursor-' + this.props.mouseActionDataType);
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = this.getCoordinatesForScreen();
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();

    return (
      <svg className={svgClass} width={width} height={height} ref='svg' onContextMenu={this.onContextMenu} >
        {bases.map((base, ii) => {
            if (ii >= bases.length-1) {
              return;
            }
            return (<DnaLineView key={'backbone' + ii} type='backbone' source={ii} target={ii+1}/>);
        })}
        {connections.map((connection, ii) => {
            let {source, target} = connection;
            return (<DnaLineView key={'pair' + ii} type='pair' source={source} target={target}/>);
        })}

        {bases.map((base, ii) => {
            return (<DnaBaseView key={'base' + ii} index={ii} bannedCursorWhenMoving={this.bannedCursorWhenMoving(ii)} />
            );
        })}

        <DnaAnnotation point={coordinates[0]} other1={coordinates[1]} other2={coordinates[coordinates.length-1]} text="5'"/>
        <DnaAnnotation point={coordinates[coordinates.length-1]} other1={coordinates[coordinates.length-2]} other2={coordinates[0]} text="3'"/>

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

  getNodeAtEvent (event) {
    var svg    = this.refs.svg;
    var found  = -1;
    var hitTestRect    = svg.createSVGRect();
    var screenPosition = this.getPositionAtEvent(event);

    hitTestRect.x = screenPosition.x;
    hitTestRect.y = screenPosition.y;
    hitTestRect.width   = 1;
    hitTestRect.height  = 1;

    svg.getIntersectionList(hitTestRect, null).forEach((elem) => {
      if (elem.tagName !== 'circle') { return; }
      if (found !== -1) { return };
      found = parseInt(elem.getAttribute('data-index'));
    });
    return found;
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
    var dragging = this.getNodeAtEvent(event);
    var dataType = 'none';
    var data     = {};
    if (dragging!==-1) {
      dataType = 'dragging';
      this.props.actions.setDraggingNode(dragging);
    } else if (!event.shiftKey) {
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
    var selected = this.getNodeAtEvent(event);
    this.props.actions.setHoverNode(selected);
    this.props.actions.setCurrentMousePosition(this.getPositionAtEvent(event));

    var data = store.getState().mouseActionData;
    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }
  };

  onMouseUp (event) {
    var dragging = store.getState().dragging;
    var data     = store.getState().mouseActionData;

    if (data.type === 'pan') {
      this.handlePan(event);
    } else if (data.type === 'rotate') {
      this.handleRotate(event);
    }

    this.props.actions.resetDraggingNode();
    this.props.actions.resetMouseActionData();

    var found  = this.getNodeAtEvent(event);
    if (found===-1) { return; }
    if (dragging===-1) { return; }
    if (found===dragging) return;


    var sequenceParserNew = SequenceUtils.getJoinedSequence(this.props.sequenceParser, dragging, found);
    if (!sequenceParserNew) {
      return;
    }

    let {seq, dbn} = sequenceParserNew.getData();
    this.props.actions.setSequenceParser(sequenceParserNew);
    this.props.actions.setTempSequence(seq, dbn);
  };

  onMouseLeave () {
    this.props.actions.resetDraggingNode();
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

    this.props.actions.resetDraggingNode();
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

  bannedCursorWhenMoving (index) {
    var dragging = store.getState().dragging;
    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();

    if (dragging<0) return false;
    if (dragging === index) return false;

    var draggingBase = bases[dragging];
    var thisBase = bases[index];
    return !thisBase.canPairWith(draggingBase);
  };

  getWindowWidth () {
    return this.props.dimensions.width;
  };

  getWindowHeight () {
    return this.props.dimensions.height;
  };

  getModelTransformations () {
    var matrixTransforms = MatrixTransformations.create();

    var negOrg = Vector.create(this.props.origin.x, this.props.origin.y).negate();
    matrixTransforms.append(m => m.translate(negOrg));
    matrixTransforms.append(m => m.scale(this.props.zoomFactor*0.01));
    matrixTransforms.append(m => m.rotate(AngleConverter.toRad(-1 * this.props.rotationAngle)));

    return matrixTransforms;
  };

  getCoordinatesForScreen () {
    var width          = this.getWindowWidth();
    var height         = this.getWindowHeight();
    var sequenceParser = this.props.sequenceParser;
    return sequenceParser.getCoordinates(width, height, this.getModelTransformations());
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceParser: state.sequenceParser,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    mouseActionDataType: state.mouseActionData.type,
    dimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
