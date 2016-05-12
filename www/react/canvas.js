
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

var DnaBackbone = React.createClass({
  render: function () {
    var point1 = this.props.point1;
    var point2 = this.props.point2;
    return (<line x1={point1.elements[0]} y1={point1.elements[1]} x2={point2.elements[0]} y2={point2.elements[1]} className="dna-backbone" />);
  }
});

var DnaPair = React.createClass({
  render: function () {
    var source = this.props.source;
    var target = this.props.target;
    return (<line x1={source.elements[0]} y1={source.elements[1]} x2={target.elements[0]} y2={target.elements[1]} className="dna-pair" />);
  }
});

var Canvas = React.createClass({
  render: function () {
    var sequenceParser = this.props.sequenceParser;
    var coordinates = sequenceParser.getCoordinates();
    var bases       = sequenceParser.getBases();
    var connections = sequenceParser.getConnections();
    var width       = $(window).width() * 0.8;
    var height      = $(window).height() * 0.8;

    return (
      <svg width={width} height={height}>
        {_(coordinates).map(function (point, ii) {
            if (ii >= coordinates.length-1) {
              return;
            }
            return (<DnaBackbone point1={point} point2={coordinates[ii+1]}/>);
          })}
        {_(connections).map(function (connection) {
            var source = coordinates[connection.source];
            var target = coordinates[connection.target];
            return (<DnaPair source={source} target={target}/>);
          })}

        {_(coordinates).map(function (point, ii) {
            return (<DnaBaseView point={point} base={bases[ii]}/>);
          })}
      </svg>);
  }
});

var SequenceView = React.createClass({
  getInitialState: function () {
    return {
      hasError: false,
      seq: debug_examples[0].seq,
      dbn: debug_examples[0].dbn
    };
  },

  render: function () {

    var formClass = "sequence-form";
    if (this.state.hasError) {
      formClass += " has-error-local";
    }

    return (<div>
              <form className={formClass}>
                <input type="text" onChange={this.sequenceChange} placeholder="Enter DNA Sequence" value={this.state.seq} size="120" maxlength="80%"></input>
              </form>
              <form className={formClass}>
                <input type="text" onChange={this.dbnChange} placeholder="Enter DBN" value={this.state.dbn} size="120" maxlength="80%"></input>
              </form>
            </div>);
  }
});


var GATTACA = React.createClass({
  render: function () {
    return (<div>
              <Canvas sequenceParser={this.props.sequenceParser} />
              <SequenceView />
            </div>);
  },

  getInitialState: function() {
    return {windowWidth: window.innerWidth};
  },

  handleResize: function(e) {
    this.setState({windowWidth: window.innerWidth});
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  }
});


$(document).ready(function () {
  var pair = debug_examples[0];
  var sequenceParser = SequenceParser(pair.seq, pair.dbn);

  ReactDOM.render(
    <GATTACA sequenceParser={sequenceParser}/>,
    document.getElementById('body-div')
  );
});
