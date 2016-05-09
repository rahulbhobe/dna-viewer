

var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    var bases = sequenceParser.getBases();
    var base0 = bases[0];

    var subStructure = sequenceParser.getSubStructureAtIndex(base0.getIndex());
    var numNodes = subStructure.getNodes().length;

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
