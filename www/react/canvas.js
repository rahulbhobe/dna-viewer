
var DnaBaseView = React.createClass({
  render: function () {
    var point = this.props.point;
    var base  = this.props.base;
    return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
              <circle cx={0} cy={0} r={20} fill="red" />
              <text x={-4} y={4} > {base.getType()}</text>
            </g>);
  }
});


var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    var coordinates = sequenceParser.getCoordinates();
    var bases       = sequenceParser.getBases();

    return (
      <svg width='1500' height='900'>
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
