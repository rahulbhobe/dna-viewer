

var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();
    var base0 = bases[0];

    var subStructure = sequenceParser.getSubStructureAtIndex(base0.getIndex());
    var numNodes = subStructure.getNodes().length;

    var red    = Vector.create([800, 100]);
    var vec    = Vector.create([0, -1]);
    var green  = red.add(vec.multiply(50));
    var blue   = green.rotate(Math.PI/4, red);
    var yellow = green.rotate((3*Math.PI)/4, red);
    var orange = green.rotate((5*Math.PI)/4, red);

    return (
      <svg width='1500' height='900'>
        <g transform="translate(500, 100)">
          <circle cx={0} cy={0} r={4} fill="red" />
          <g transform="translate(0, -50)">
            <circle cx={0} cy={0} r={4} fill="green" />
            <g transform="rotate(45, 0, 50)">
              <circle cx={0} cy={0} r={4} fill="blue" />
            </g>
            <g transform="rotate(135, 0, 50)">
              <circle cx={0} cy={0} r={4} fill="yellow" />
            </g>
            <g transform="rotate(225, 0, 50)">
              <circle cx={0} cy={0} r={4} fill="orange" />
            </g>
          </g>
        </g>

        <g transform={"translate(" + red.elements[0] + ", " + red.elements[1] + ")"}>
          <circle cx={0} cy={0} r={8} fill="red" />
        </g>
        <g transform={"translate(" + green.elements[0] + ", " + green.elements[1] + ")"}>
          <circle cx={0} cy={0} r={8} fill="green" />
        </g>
        <g transform={"translate(" + blue.elements[0] + ", " + blue.elements[1] + ")"}>
          <circle cx={0} cy={0} r={8} fill="blue" />
        </g>
        <g transform={"translate(" + yellow.elements[0] + ", " + yellow.elements[1] + ")"}>
          <circle cx={0} cy={0} r={8} fill="yellow" />
        </g>
        <g transform={"translate(" + orange.elements[0] + ", " + orange.elements[1] + ")"}>
          <circle cx={0} cy={0} r={8} fill="orange" />
        </g>

      </svg>);
  }
});

$(document).ready(function () {
  var pair = {
    seq: 'TTGGGCTTGGGGCTCCCAGAATTT',
    dbn: '.((((((...))((...)))))).'
  };

  var sequenceParser = SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <Canvas sequenceParser={sequenceParser}/>,
    document.getElementById('canvas-div')
  );
});
