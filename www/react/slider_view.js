import React from 'react';
import ReactSlider from 'react-slider';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

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

var mapStateToProps = (state, ownProps) => {
  return {
    zoomFactor: state.zoomFactor
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SliderView);
