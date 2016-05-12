var GATTACA = React.createClass({
  render: function () {
    return (<div>
              <Canvas sequenceParser={this.props.sequenceParser} />
              <SequenceView onSequenceChanged={this.onSequenceChanged} selected={10}/>
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
  },

  onSequenceChanged: function() {
    this.forceUpdate();
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
