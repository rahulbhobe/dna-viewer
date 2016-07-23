import React from 'react';
import AngleInput from 'angle-input/react';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class AngleView extends React.Component {
  constructor (props) {
    super(props);
    this.onChange  = this.onChange.bind(this);
  };

  render () {
    return (  <AngleInput className='angle-input' value={this.props.rotationAngle} onChange={this.onChange} onInput={this.onChange} />);
  };

  onChange (value) {
    this.props.actions.setRotationAngle(value);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    rotationAngle: state.rotationAngle
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AngleView);
