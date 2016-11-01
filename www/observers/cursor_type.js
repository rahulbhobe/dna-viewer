import SequenceUtils from '../utils/sequence_utils';
import ObserverUtils from '../utils/observer_utils';

let mapStateToProps = (state, ownProps) => {
  return {
    sequenceData: state.sequenceData,
    dragging: state.dragging,
    hover: state.hover,
    eventDataType: state.eventData.type
  };
};

let setCursor = (props, state) => {
  let dragging = state.dragging;
  let hover    = state.hover;
  let dataType = state.eventDataType;

  if ((dragging!==-1)&&(hover!==-1)) {
    if (SequenceUtils.canJoinNodes(state.sequenceData, dragging, hover)) {
      props.actions.setCanvasCursor('drop');
    } else {
      props.actions.setCanvasCursor('banned');
    }
  } else if (dragging!==-1) {
    props.actions.setCanvasCursor('dragging');
  } else if (hover!==-1) {
    props.actions.setCanvasCursor('hover');
  } else {
    props.actions.setCanvasCursor(dataType);
  }
};

ObserverUtils.registerObserver(mapStateToProps, setCursor);
