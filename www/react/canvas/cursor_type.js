import React from 'react';
import SequenceUtils from '../../utils/sequence_utils';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class CursorType extends React.Component {
  render () {
    return null;
  };

  componentDidUpdate () {
    this.setCursor();
  };

  setCursor () {
    let dragging = this.props.dragging;
    let hover    = this.props.hover;
    let dataType = this.props.eventDataType;

    if ((dragging!==-1)&&(hover!==-1)) {
      if (SequenceUtils.canJoinNodes(this.props.sequenceData, dragging, hover)) {
        this.props.actions.setCanvasCursor('drop');
      } else {
        this.props.actions.setCanvasCursor('banned');
      }
    } else if (dragging!==-1) {
      this.props.actions.setCanvasCursor('dragging');
    } else if (hover!==-1) {
      this.props.actions.setCanvasCursor('hover');
    } else {
      this.props.actions.setCanvasCursor(dataType);
    }
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    sequenceData: state.sequenceData,
    dragging: state.dragging,
    hover: state.hover,
    eventDataType: state.eventData.type
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CursorType);
