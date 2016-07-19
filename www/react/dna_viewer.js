import React from 'react';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_map';

class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
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
    this.props.actions.setWindowDimensions(window.innerWidth, window.innerHeight);
  };

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  };
};

export default connect(null, mapDispatchToProps)(DnaViewer);