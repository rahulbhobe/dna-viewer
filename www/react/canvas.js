

var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;


    var coordinates = sequenceParser.getCoordinates();
    var centers = sequenceParser.getCenters();

    var circles = _(coordinates).map(function (point) {
      return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
                <circle cx={0} cy={0} r={5} fill="brown" />
              </g>);
    });

    var centers = _(centers).map(function (point) {
      return (<g transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
                <circle cx={0} cy={0} r={5} fill="white" />
              </g>);
    });

    return (
      <svg width='1500' height='900'>
        {circles}
        {centers}
      </svg>);
  }
});

$(document).ready(function () {
  var pair = {
    seq: 'TTGGGGGGACTGGGGCTCCCATTCGTTGCCTTTATAAATCCTTGCAAGCCAATTAACAGGTTGGTGAGGGGCTTGGGTGAAAAGGTGCTTAAGACTCCGT',
    dbn: '...(((((.(...).)))))........(((((.....((..(.((((((..(((.((...)).)))..)))))).).)))))))...............'
  };

  var sequenceParser = SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <Canvas sequenceParser={sequenceParser}/>,
    document.getElementById('canvas-div')
  );
});
