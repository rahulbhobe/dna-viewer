import React from 'react';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../store/action_creators';

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

var mapDispatchToProps = function (dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(null, mapDispatchToProps)(DnaViewer);