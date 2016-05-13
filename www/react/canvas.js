var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var $ = require('jquery');

var DnaBaseView = React.createClass({
  render: function () {
    var point   = this.props.point;
    var base    = this.props.base;
    var classes = " dna-base dna-base-size";
    var textCls = "dna-text dna-base-font";

    classes += " " + 'dna-base-' + base.getType().toLowerCase();
    classes += this.props.selected ? " dna-base-selected" : "";
    return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              <circle className={classes} />
              <text className={textCls} textAnchor="middle" dominantBaseline="central"> {base.getType()}</text>
            </g>);
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

    var coordinates = sequenceParser.getCoordinates();
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();
    var width       = $(window).width() * 0.8;
    var height      = $(window).height() * 0.8;
    var self        = this;
    var begin       = coordinates[0];
    var end         = coordinates[1];

    return (
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
            return (<DnaBaseView point={point} base={bases[ii]} selected={self.props.selected===ii} onSelected={self.props.onSelected} key={"base" + ii}/>);
        })}

        <DnaAnnotation point={coordinates[0]} other1={coordinates[1]} other2={coordinates[coordinates.length-1]} text="5'"/>
        <DnaAnnotation point={coordinates[coordinates.length-1]} other1={coordinates[coordinates.length-2]} other2={coordinates[0]} text="3'"/>
      </svg>);
  }
});

module.exports = Canvas;
