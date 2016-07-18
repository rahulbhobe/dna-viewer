import React from 'react';
import ReactSlider from 'react-slider';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../store/action_creators';

class SliderView extends React.Component {
  constructor (props) {
    super(props);
    this.onChange  = this.onChange.bind(this);
  };

  render () {
    return (  <ReactSlider className='slider-zoom' withBars min={25} max={200} pearling value={this.props.zoomFactor} onChange={this.onChange} />);
  };

  onChange (value) {
    this.props.actions.setZoomFactor(value);
  };
};

var mapStateToProps = function(state, ownProps) {
  return {
    zoomFactor: state.zoomFactor
  };
};

var mapDispatchToProps = function (dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(SliderView);
