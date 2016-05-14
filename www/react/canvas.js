var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var $ = require('jquery');

var DnaBaseView = React.createClass({
  render: function () {
    var point   = this.props.point;
    var base    = this.props.base;
    var clsName = " dna-target-spot-" + base.getIndex() + " ";
    var classes = " dna-base dna-base-size " + clsName;
    var textCls = "dna-text dna-base-font " + clsName;

    classes += " " + 'dna-base-' + base.getType().toLowerCase();
    classes += this.props.selected ? " dna-base-selected" : "";
    classes += this.props.moving ? " dna-base-moving" : "";
    clsName += this.props.bannedCursorWhenMoving ? " dna-base-banned-pairing " : "";
    return (<g className={clsName}
              onMouseDown={this.onMouseClick}
              transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}>
            <circle className={classes} />
            <text className={textCls} textAnchor="middle" dominantBaseline="central"> {base.getType()}</text>
            </g>);
  },

  onMouseClick: function() {
    this.props.onMouseClick(this.props.base.getIndex());
  },

  onMouseOver: function() {
    this.props.onSelected(this.props.base.getIndex());
  },

  onMouseLeave: function() {
    this.props.onSelected(-1);
  }
});

var DnaBackbone = React.createClass({
  render: function () {
    var point1 = this.props.point1;
    var point2 = this.props.point2;
    return (<line x1={point1.elements[0]} y1={point1.elements[1]} x2={point2.elements[0]} y2={point2.elements[1]} className="dna-backbone dna-base-backbone" />);
  }
});

var DnaPair = React.createClass({
  render: function () {
    var source = this.props.source;
    var target = this.props.target;
    return (<line x1={source.elements[0]} y1={source.elements[1]} x2={target.elements[0]} y2={target.elements[1]} className="dna-pair dna-base-pair" />);
  }
});

var DnaAnnotation = React.createClass({
  render: function () {
    var text     = this.props.text;
    var classes  = "dna-base-annotation";
    var textCls  = "dna-text dna-base-font";
    var location = this.getLocation();

    return (<g transform={"translate(" + location.elements[0] + ", " + location.elements[1] + ")"} >
              <text className={textCls} textAnchor="middle" dominantBaseline="central">{text}</text>
            </g>);
  },

  getLocation: function () {
    var point   = Vector.create(this.props.point);
    var other1  = Vector.create(this.props.other1);
    var other2  = Vector.create(this.props.other2);
    var vec1    = point.subtract(other1);
    var vec2    = point.subtract(other2);
    var bisect  = vec1.add(vec2);
    var drawAt  = point.add(bisect.toUnitVector().multiply(20));

    return drawAt;
  }
});


var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var wrapperCls  = null;
    var width       = $(window).width() * 0.8;
    var height      = $(window).height() * 0.8;
    var coordinates = this.getCoordinatesForScreen([width, height]);
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();
    var self        = this;

    if (this.props.moving) {
      wrapperCls = 'dna-canvas-div-grabbing ';
    }

    var self = this;

    return (
      <div className={wrapperCls}>
      <svg width={width} height={height}>
        {_(coordinates).map(function (point, ii) {
            if (ii >= coordinates.length-1) {
              return;
            }
            return (<DnaBackbone point1={point} point2={coordinates[ii+1]} key={"backbone" + ii}/>);
        })}
        {_(connections).map(function (connection, ii) {
            var source = coordinates[connection.source];
            var target = coordinates[connection.target];
            return (<DnaPair source={source} target={target} key={"pair" + ii}/>);
        })}

        {_(coordinates).map(function (point, ii) {
            return (<DnaBaseView point={point} base={bases[ii]}
              selected={self.props.selected===ii} moving={self.props.moving===ii}
              bannedCursorWhenMoving={self.bannedCursorWhenMoving(ii)}
              onMouseClick={self.props.onMouseClick}
              onSelected={self.props.onSelected} key={"base" + ii}/>
            );
        })}

        <DnaAnnotation point={coordinates[0]} other1={coordinates[1]} other2={coordinates[coordinates.length-1]} text="5'"/>
        <DnaAnnotation point={coordinates[coordinates.length-1]} other1={coordinates[coordinates.length-2]} other2={coordinates[0]} text="3'"/>
      </svg>
      </div>);
  },

  bannedCursorWhenMoving: function(index) {
    var moving = this.props.moving;
    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();

    if (!moving||moving<0) return false;
    if (moving === index) return false;

    var movingBase = bases[moving];
    var thisBase = bases[index];
    return !thisBase.canPairWith(movingBase);
  },

  getCoordinatesForScreen: function(screenDimensions) {
    var sequenceParser = this.props.sequenceParser;
    var coordinates = sequenceParser.getCoordinates();

    var screenDiagonal = Math.sqrt((screenDimensions[0]*screenDimensions[0]) + (screenDimensions[1]*screenDimensions[1]));

    var min = Vector.create(coordinates[0].elements);
    var max = Vector.create(coordinates[0].elements);

    _(coordinates).each(function (vec) {
      min.elements[0] = Math.min(min.elements[0], vec.elements[0]);
      min.elements[1] = Math.min(min.elements[1], vec.elements[1]);
      max.elements[0] = Math.max(max.elements[0], vec.elements[0]);
      max.elements[1] = Math.max(max.elements[1], vec.elements[1]);
    });

    var currentDiagonal = min.distanceFrom(max);
    // Scale by 75 %.
    var scale = 0.75 * (screenDiagonal / currentDiagonal);

    var scaledCoordinates = _(coordinates).map(function(point) {
      return point.multiply(scale);
    });

    // Remove the minVec and add a few to not clip the edge points.
    var min = min.multiply(scale); // to subtract.
    var buf = Vector.create([1,1]).toUnitVector().multiply(0.05*screenDiagonal);
    var vec = buf.subtract(min);

    var transformedCoordinates = _(scaledCoordinates).map(function(point) {
      return point.add(vec);
    });
    return transformedCoordinates;
  }
});

module.exports = Canvas;
