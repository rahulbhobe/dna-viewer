import React from 'react';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';

class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
    };

    this.handleResize = this.handleResize.bind(this);
  };

  render () {
    return (<div>
              <ShareLink />
              <Canvas />
              <SequenceView />
              <SettingsView />
            </div>);
  };

  handleResize (e) {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  };
};

export default DnaViewer;
