
var DnaBaseView = React.createClass({
  render: function () {
    var point   = this.props.point;
    var base    = this.props.base;
    var classes = "dna-base dna-base-" + base.getType().toLowerCase();
    return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
              <circle className={classes} />
              <text className="dna-text" textAnchor="middle" dominantBaseline="central"> {base.getType()}</text>
            </g>);
  }
});


var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    var coordinates = sequenceParser.getCoordinates();
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();

    return (
      <svg width='1500' height='900'>
        {_(coordinates).map(function (point, ii) {
            if (ii >= coordinates.length-1) {
              return;
            }
            return (<line x1={point.elements[0]} y1={point.elements[1]} x2={coordinates[ii+1].elements[0]} y2={coordinates[ii+1].elements[1] className="dna-backbone"} />);
          })}
        {_(connections).map(function (connection) {
            var source = coordinates[connection.source];
            var target = coordinates[connection.target];
            return (<line x1={source.elements[0]} y1={source.elements[1]} x2={target.elements[0]} y2={target.elements[1]} stroke="lightblue" className="dna-pair"/>);
          })}

        {_(coordinates).map(function (point, ii) {
            return (<DnaBaseView point={point} base={bases[ii]}/>);
          })}
      </svg>);
  }
});

$(document).ready(function () {
  var pair = debug_examples[0];
  var sequenceParser = SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <Canvas sequenceParser={sequenceParser}/>,
    document.getElementById('canvas-div')
  );
});
