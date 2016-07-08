import React from 'react';
import ReactDOM from 'react-dom';
import DnaBaseView from './dna_base_view';
import {Vector} from 'sylvester';

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
    var classes  = "dna-base-annotation";
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
    this.state = {
      screenCoordinates: this.getCoordinatesForScreen(this.props.sequenceParser)
    };
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.sequenceParser !== this.props.sequenceParser) {
      this.setState({
        screenCoordinates: this.getCoordinatesForScreen(nextProps.sequenceParser)
      });
    }
  };

  render () {
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var wrapperCls  = null;
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = this.state.screenCoordinates;
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();
    var self        = this;

    if (this.props.moving !== -1) {
      wrapperCls = 'dna-canvas-div-grabbing ';
    }

    var self = this;

    return (
      <div className={wrapperCls}>
      <svg width={width} height={height} ref='svg'>
        {coordinates.map(function (point, ii) {
            if (ii >= coordinates.length-1) {
              return;
            }
            return (<DnaBackbone point1={point} point2={coordinates[ii+1]} key={"backbone" + ii}/>);
        })}
        {connections.map(function (connection, ii) {
            var source = coordinates[connection.source];
            var target = coordinates[connection.target];
            return (<DnaPair source={source} target={target} key={"pair" + ii}/>);
        })}

        {coordinates.map(function (point, ii) {
            return (<DnaBaseView point={point} base={bases[ii]}
              bannedCursorWhenMoving={self.bannedCursorWhenMoving(ii)} key={"base" + ii}/>
            );
        })}

        <DnaAnnotation point={coordinates[0]} other1={coordinates[1]} other2={coordinates[coordinates.length-1]} text="5'"/>
        <DnaAnnotation point={coordinates[coordinates.length-1]} other1={coordinates[coordinates.length-2]} other2={coordinates[0]} text="3'"/>

        {this.getMovingBaseGraphichs()}

      </svg>
      </div>);
  };

  getMovingBaseGraphichs () {
    if (this.props.moving===-1) return;

    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) return;

    var bases = sequenceParser.getBases();
    var svg   = this.refs.svg;
    var rect  = svg.getBoundingClientRect();
    var point = Vector.create([this.props.movingX-rect.left, this.props.movingY-rect.top]);
    return (<DnaBaseView point={point} base={bases[this.props.moving]} selected={false} moving={false}
              bannedCursorWhenMoving={false} onMouseClick={null} onSelected={null}/>);
  };

  bannedCursorWhenMoving (index) {
    var moving = this.props.moving;
    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();

    if (!moving||moving<0) return false;
    if (moving === index) return false;

    var movingBase = bases[moving];
    var thisBase = bases[index];
    return !thisBase.canPairWith(movingBase);
  };

  getWindowWidth () {
    return window.innerWidth * 0.8;
  };

  getWindowHeight () {
    return window.innerHeight * 0.8;
  };

  getCoordinatesForScreen (sequenceParser) {
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = sequenceParser.getCoordinates();

    var min = Vector.create(coordinates[0].elements);
    var max = Vector.create(coordinates[0].elements);

    coordinates.forEach(function (vec) {
      min.elements[0] = Math.min(min.elements[0], vec.elements[0]);
      min.elements[1] = Math.min(min.elements[1], vec.elements[1]);
      max.elements[0] = Math.max(max.elements[0], vec.elements[0]);
      max.elements[1] = Math.max(max.elements[1], vec.elements[1]);
    });

    var rotatedCoordinates = coordinates;
    if ((max.elements[0]-min.elements[0]) < (max.elements[1]-min.elements[1])) {
      // Rotate by 90 deg if width is less than height. Most screens have larger width.
      rotatedCoordinates = coordinates.map(function(point) {
        return point.rotate(-0.5*Math.PI, min);
      });

      var t1 = min;
      var t2 = max;
      min = Vector.create([t1.elements[0], t1.elements[1]-(t2.elements[0]-t1.elements[0])]);
      max = Vector.create([t1.elements[0]+(t2.elements[1]-t1.elements[1]), t1.elements[1]]);
    }

    var scaleW = width  / (max.elements[0]-min.elements[0]);
    var scaleH = height / (max.elements[1]-min.elements[1]);
    var scale  = scaleW < scaleH ? scaleW : scaleH;

    var scaledCoordinates = rotatedCoordinates.map(function(point) {
      return point.multiply(scale*0.92);
    });

    // Remove the minVec and add a few to not clip the edge points.
    var min = min.multiply(scale*0.92); // to subtract.
    var buf = Vector.create([width*0.04, height*0.04]);
    var vec = buf.subtract(min);

    var transformedCoordinates = scaledCoordinates.map(function(point) {
      return point.add(vec);
    });
    return transformedCoordinates;
  };
};

export default Canvas;
