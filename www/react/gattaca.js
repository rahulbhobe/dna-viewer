var GATTACA = React.createClass({
  getInitialState: function() {
    return {
      selected: null,
    };
  },

  render: function () {
    return (<div>
              <Canvas sequenceParser={this.props.sequenceParser} selected={this.state.selected} onSelected={this.onSelected}/>
              <SettingsView />
              <SequenceView onSequenceChanged={this.onSequenceChanged} selected={this.state.selected} onSelected={this.onSelected}/>
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
  },

  onSelected: function(selected) {
    this.setState({selected: selected});
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
