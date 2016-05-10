

var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;


    var coordinates = sequenceParser.getCoordinates();

    var circles = _(coordinates).map(function (point) {
      return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
                <circle cx={0} cy={0} r={5} fill="red" />
              </g>);
    });

    return (
      <svg width='1500' height='900'>
        {circles}
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
