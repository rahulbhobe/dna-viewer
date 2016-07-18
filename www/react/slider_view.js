import React from 'react';
import ReactSlider from 'react-slider'

class SliderView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 100
    };
    this.onChange  = this.onChange.bind(this);
  };

  render () {
    return (  <ReactSlider className='slider-zoom' withBars min={0} max={200} pearling value={this.state.value} onChange={this.onChange} />);
  };

  onChange (value) {
    this.setState({ value: value });
  };
};

export default SliderView;
