import React from 'react';
import {connect} from 'react-redux';
import DnaBaseView from './dna_base_view';
import {Vector} from '../mathutils/gl_matrix_wrapper';

class DnaDraggedNode extends React.Component {
  render () {
    if (this.props.dragging < 0) {
      return null;
    }
    var point = Vector.create(this.props.mouseX, this.props.mouseY);
    return (<DnaBaseView point={point} base={this.props.bases[this.props.dragging]} isDraggedNode={true} bannedCursorWhenMoving={false}/>);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    mouseX: state.currentMousePosition.x,
    mouseY: state.currentMousePosition.y,
    dragging: state.dragging
  }
};

export default connect(mapStateToProps)(DnaDraggedNode);
