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
    return (<DnaBaseView point={point} base={this.props.bases[this.props.dragging]} ignoreDataIndex={true} bannedCursorWhenMoving={false}/>);
  };
};

var mapStateToProps = function(state, ownProps) {
  return {
    mouseX: state.mousePosition.x,
    mouseY: state.mousePosition.y,
    dragging: state.dragging
  }
};

export default connect(mapStateToProps)(DnaDraggedNode);
