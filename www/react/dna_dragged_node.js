import React from 'react';
import {connect} from 'react-redux';
import DnaBaseView from './dna_base_view';
import {Vector} from 'sylvester';

class DnaDraggedNode extends React.Component {
  render () {
    if (this.props.dragging < 0) {
      return null;
    }
    var rect  = this.props.getRect();
    var point = Vector.create([this.props.mouseX-rect.left, this.props.mouseY-rect.top]);
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
