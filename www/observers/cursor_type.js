import SequenceUtils from '../utils/sequence_utils';
import ReduxUtils from '../utils/redux_utils';

let mapStateToProps = (state) => {
  return {
    sequenceData: state.sequenceData,
    dragging: state.dragging,
    hover: state.hover,
    eventDataType: state.eventData.type
  };
};

let setCursor = (actions, state) => {
  let dragging = state.dragging;
  let hover    = state.hover;
  let dataType = state.eventDataType;

  if ((dragging!==-1)&&(hover!==-1)) {
    if (SequenceUtils.canJoinNodes(state.sequenceData, dragging, hover)) {
      actions.setCanvasCursor('drop');
    } else {
      actions.setCanvasCursor('banned');
    }
  } else if (dragging!==-1) {
    actions.setCanvasCursor('dragging');
  } else if (hover!==-1) {
    actions.setCanvasCursor('hover');
  } else {
    actions.setCanvasCursor(dataType);
  }
};

ReduxUtils.registerObserver(mapStateToProps, setCursor);
