import React from 'react';
import DnaBaseView from './dna_base_view';
import DnaDraggedNode from './dna_dragged_node';
import {Vector} from 'sylvester';
import classNames from 'classnames';
import store from '../store/store';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';
import SequenceParser from '../src/sequence_parser';

class DnaBackbone extends React.Component {
  render () {
    var point1 = this.props.point1;
    var point2 = this.props.point2;
    return (<line x1={point1.elements[0]} y1={point1.elements[1]} x2={point2.elements[0]} y2={point2.elements[1]} className="dna-backbone dna-base-backbone" />);
  };
};

class DnaPair extends React.Component {
  render () {
    var source = this.props.source;
    var target = this.props.target;
    return (<line x1={source.elements[0]} y1={source.elements[1]} x2={target.elements[0]} y2={target.elements[1]} className="dna-pair dna-base-pair" />);
  };
};

class DnaAnnotation extends React.Component {
  render () {
    var text     = this.props.text;
    var textCls  = "dna-text dna-base-font";
    var location = this.getLocation();

    return (<g transform={"translate(" + location.elements[0] + ", " + location.elements[1] + ")"} >
              <text className={textCls} textAnchor="middle" dominantBaseline="central">{text}</text>
            </g>);
  };

  getLocation () {
    var point   = Vector.create(this.props.point);
    var other1  = Vector.create(this.props.other1);
    var other2  = Vector.create(this.props.other2);
    var vec1    = point.subtract(other1);
    var vec2    = point.subtract(other2);
    var bisect  = vec1.add(vec2);
    var drawAt  = point.add(bisect.toUnitVector().multiply(20));

    return drawAt;
  };
};

class Canvas extends React.Component {
  constructor (props) {
    super(props);

    this.getSvgRect       = this.getSvgRect.bind(this);
    this.onMouseMove      = this.onMouseMove.bind(this);
    this.onMouseUp        = this.onMouseUp.bind(this);
    this.onMouseDown      = this.onMouseDown.bind(this);
    this.onMouseLeave     = this.onMouseLeave.bind(this);
    this.onMouseWheel     = this.onMouseWheel.bind(this);
    this.onContextMenu    = this.onContextMenu.bind(this);
  };

  render () {
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var svgClass    = classNames('svg-class', 'svg-cursor-' + this.props.mouseActionDataType);
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = this.getCoordinatesForScreen(sequenceParser);
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();

    return (
      <svg className={svgClass} width={width} height={height} ref='svg' onContextMenu={this.onContextMenu} >
        {coordinates.map((point, ii) => {
            if (ii >= coordinates.length-1) {
              return;
            }
            return (<DnaBackbone point1={point} point2={coordinates[ii+1]} key={"backbone" + ii}/>);
        })}
        {connections.map((connection, ii) => {
            var source = coordinates[connection.source];
            var target = coordinates[connection.target];
            return (<DnaPair source={source} target={target} key={"pair" + ii}/>);
        })}

        {coordinates.map((point, ii) => {
            return (<DnaBaseView point={point} base={bases[ii]} ignoreDataIndex={false}
              bannedCursorWhenMoving={this.bannedCursorWhenMoving(ii)} key={"base" + ii}/>
            );
        })}

        <DnaAnnotation point={coordinates[0]} other1={coordinates[1]} other2={coordinates[coordinates.length-1]} text="5'"/>
        <DnaAnnotation point={coordinates[coordinates.length-1]} other1={coordinates[coordinates.length-2]} other2={coordinates[0]} text="3'"/>

        <DnaDraggedNode bases={bases}/>
      </svg>);
  };

  componentDidMount () {
    var svg = this.refs.svg;
    svg.addEventListener('mousemove',  this.onMouseMove, false);
    svg.addEventListener('mouseup',    this.onMouseUp, false);
    svg.addEventListener('mousedown',  this.onMouseDown, false);
    svg.addEventListener('mouseleave', this.onMouseLeave, false);
    svg.addEventListener('mousewheel', this.onMouseWheel, false);
  };

  componentWillUnmount () {
    var svg = this.refs.svg;
    svg.removeEventListener('mousemove',  this.onMouseMove, false);
    svg.removeEventListener('mouseup',    this.onMouseUp, false);
    svg.removeEventListener('mousedown',  this.onMouseDown, false);
    svg.removeEventListener('mouseleave', this.onMouseLeave, false);
    svg.removeEventListener('mousewheel', this.onMouseWheel, false);
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


    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();
    var base1 = bases[dragging];
    var base2 = bases[found];

    if (!base1.isUnpaired()) return;
    if (!base2.isUnpaired()) return;
    if (!base1.canPairWith(base2)) return;

    var {seq, dbn} = sequenceParser.getData();
    var min = Math.min(dragging, found);
    var max = Math.max(dragging, found);

    var newdbn =  dbn.substring(0, min) + '(' + dbn.substring(min+1, max) + ')' + dbn.substring(max+1);
    var sequenceParserNew = new SequenceParser(seq, newdbn);
    if (sequenceParser.hasErrors()) {
      return;
    }

    this.props.actions.setSequenceParser(sequenceParserNew);
  };

  onMouseLeave () {
    this.props.actions.resetDraggingNode();
    this.props.actions.resetMouseActionData();
  };

  onMouseWheel (event) {
    event.preventDefault();

    var wheelDistance = -1 * Math.round(event.wheelDeltaY/30);
    if (wheelDistance === 0) { return false; }
    var zoomFactor    = this.props.zoomFactor + wheelDistance;
    if (zoomFactor < 25)  { return false; }
    if (zoomFactor > 200) { return false; }
    this.props.actions.setZoomFactor(zoomFactor);
    return false;
  };

  handleRotate (event) {
    var data            = store.getState().mouseActionData;
    var startAngle      = data.startData.angle;
    var startPosition   = data.startData.position;
    var currentPosition = this.getPositionAtEvent(event);
    var midPoint        = Vector.create([this.getWindowWidth()*0.5, this.getWindowHeight()*0.5, 0])
    var startVec        = Vector.create([startPosition.x, startPosition.y, 0]).subtract(midPoint);
    var currentVec      = Vector.create([currentPosition.x, currentPosition.y, 0]).subtract(midPoint);
    var crossVec        = startVec.cross(currentVec);
    var sign            = crossVec.elements[2] > 0 ? -1 : 1;
    var angle           = sign * startVec.angleFrom(currentVec) * (360 / (2 * Math.PI));
    this.props.actions.setRotationAngle(startAngle + angle);
  };

  handlePan (event) {
    var data            = store.getState().mouseActionData;
    var oldOrigin       = data.startData.origin;
    var startPosition   = data.startData.position;
    var currentPosition = this.getPositionAtEvent(event);
    var startPnt        = Vector.create([startPosition.x, startPosition.y]);
    var currentPnt      = Vector.create([currentPosition.x, currentPosition.y]);
    var vec             = currentPnt.rotate(this.props.rotationAngle * 2 * Math.PI / 360, startPnt)
                            .subtract(startPnt)
                            .multiply(1 / (this.props.zoomFactor*0.01));
    var org             = Vector.create([oldOrigin.x, oldOrigin.y]).subtract(vec);
    this.props.actions.setOrigin({x: org.elements[0], y: org.elements[1]});
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

  isWindowSmall () {
    return (this.props.windowDimensions.width < 900);
  };

  getWindowWidth () {
    if (this.isWindowSmall()) {
      return this.props.windowDimensions.width;
    }
    return this.props.windowDimensions.width - 225 - 10;
  };

  getWindowHeight () {
    if (this.isWindowSmall()) {
      return this.props.windowDimensions.height - 30;
    }
    return this.props.windowDimensions.height - 30 - 150 - 5;
  };

  getCoordinatesForScreen (sequenceParser) {
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = sequenceParser.getCoordinates();

    var min = Vector.create(coordinates[0].elements);
    var max = Vector.create(coordinates[0].elements);

    coordinates.forEach((vec) => {
      min.elements[0] = Math.min(min.elements[0], vec.elements[0]);
      min.elements[1] = Math.min(min.elements[1], vec.elements[1]);
      max.elements[0] = Math.max(max.elements[0], vec.elements[0]);
      max.elements[1] = Math.max(max.elements[1], vec.elements[1]);
    });
    var mid = min.add(max).multiply(0.5);

    var rotatedCoordinates = coordinates;
    if ((max.elements[0]-min.elements[0]) < (max.elements[1]-min.elements[1])) {
      // Rotate by 90 deg if width is less than height. Most screens have larger width.
      rotatedCoordinates = coordinates.map((point) => {
        return point.rotate(-0.5*Math.PI, min);
      });

      var t1 = min;
      var t2 = max;
      min = Vector.create([t1.elements[0], t1.elements[1]-(t2.elements[0]-t1.elements[0])]);
      max = Vector.create([t1.elements[0]+(t2.elements[1]-t1.elements[1]), t1.elements[1]]);
      mid = min.add(max).multiply(0.5);
    }

    var scaleW = width  / (max.elements[0]-min.elements[0]);
    var scaleH = height / (max.elements[1]-min.elements[1]);
    var scale  = scaleW < scaleH ? scaleW : scaleH;

    var scaledCoordinates = rotatedCoordinates.map((point) => {
      return point.multiply(scale*0.92*this.props.zoomFactor*0.01);
    });
    mid = mid.multiply(scale*0.92*this.props.zoomFactor*0.01);

    var org = Vector.create([this.props.origin.x, this.props.origin.y]).multiply(this.props.zoomFactor*0.01);
    var newCoordinates = scaledCoordinates.map((point) => {
      return point.rotate((-2 * Math.PI * this.props.rotationAngle)/360, mid.add(org));
    });

    var scr = Vector.create([width*0.5, height*0.5])
    var vec = scr.subtract(mid).subtract(org);
    var transformedCoordinates = newCoordinates.map((point) => {
      return point.add(vec);
    });
    return transformedCoordinates;
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceParser: state.sequenceParser,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    mouseActionDataType: state.mouseActionData.type,
    windowDimensions: state.windowDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
