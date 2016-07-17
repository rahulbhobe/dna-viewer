import React from 'react';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import SequenceParser from '../src/sequence_parser';

class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      seq: this.props.seq,
      dbn: this.props.dbn,
      sequenceParser: this.props.sequenceParser,
      windowWidth: window.innerWidth,
      updateSequence: false
    };

    this.handleResize      = this.handleResize.bind(this);
    this.onSequenceChanged = this.onSequenceChanged.bind(this);
  };

  render () {
    return (<div>
              <ShareLink seq={this.state.seq} dbn={this.state.dbn}/>
              <Canvas ref='canvas' sequenceParser={this.state.sequenceParser} onSequenceChanged={this.onSequenceChanged} seq={this.state.seq} dbn={this.state.dbn}/>
              <SequenceView ref='sequence' onSequenceChanged={this.onSequenceChanged}
                seq={this.state.seq} dbn={this.state.dbn} updateSequence={this.state.updateSequence}>
              </SequenceView>
              <SettingsView/>
            </div>);
  };

  handleResize (e) {
    this.setState({
      windowWidth: window.innerWidth,
      updateSequence: false
    });
  };

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  };

  onSequenceChanged (seq, dbn) {
    this.setState({
      sequenceParser: new SequenceParser(seq, dbn),
      seq: seq,
      dbn: dbn,
      updateSequence: true
    });
  };
};

export default DnaViewer;
