import {combineReducers} from 'redux';
import * as ActionTypes from './action_types';

let sequenceDataReducer = (state=null, action) => {
  if (action.type === ActionTypes.SET_SEQUENCE_DATA) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_SEQUENCE_DATA) {
    return action.value;
  }
  return state;
};

let tempSequenceReducer = (state={seq: '', dbn: ''}, action) => {
  if (action.type === ActionTypes.SET_TEMP_SEQUENCE) {
    return action.value;
  }
  return state;
};

let sequenceViewHasErrorsReducer = (state=false, action) => {
  if (action.type === ActionTypes.SET_SEQUENCE_VIEW_HAS_ERRORS) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_SEQUENCE_VIEW_HAS_ERRORS) {
    return action.value;
  }
  return state;
};

let currentUrlReducer = (state="", action) => {
  if (action.type === ActionTypes.SET_CURRENT_URL) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_CURRENT_URL) {
    return action.value;
  }
  return state;
};

let simulationDataReducer = (state={simulation: null, anchored: [], animated: []}, action) => {
  if (action.type === ActionTypes.SET_SIMULATION_DATA) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_SIMULATION_DATA) {
    return action.value;
  }
  return state;
};

let hoverNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.SET_HOVER_NODE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_HOVER_NODE) {
    return action.value;
  }
  return state;
};

let draggingNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.SET_DRAGGING_NODE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_DRAGGING_NODE) {
    return action.value;
  }
  return state;
};

let setEventDataReducer = (state= {type: 'none', startData: null}, action) => {
  if (action.type === ActionTypes.SET_EVENT_DATA) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_EVENT_DATA) {
    return action.value;
  }
  return state;
};

let zoomFactorReducer = (state=100, action) => {
  if (action.type === ActionTypes.SET_ZOOM_FACTOR) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ZOOM_FACTOR) {
    return action.value;
  }
  return state;
};

let rotationAngleReducer = (state=0, action) => {
  if (action.type === ActionTypes.SET_ROTATION_ANGLE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ROTATION_ANGLE) {
    return action.value;
  }
  return state;
};

let originReducer = (state={x:0, y:0}, action) => {
  if (action.type === ActionTypes.SET_ORIGIN) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ORIGIN) {
    return action.value;
  }
  return state;
};

let pickingColorReducer = (state=null, action) => {
  if (action.type === ActionTypes.SET_PICKING_COLOR) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_PICKING_COLOR) {
    return action.value;
  }
  return state;
};

let canvasDimensionsReducer = (state={width:-1, height:-1}, action) => {
  if (action.type === ActionTypes.SET_CANVAS_DIMENSIONS) {
    return action.value;
  }
  return state;
};

let canvasCursorTypeReducer = (state='none', action) => {
  if (action.type === ActionTypes.SET_CANVAS_CURSOR_TYPE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_CANVAS_CURSOR_TYPE) {
    return action.value;
  }
  return state;
};

let savedViewsReducer = (state=[], action) => {
  if (action.type === ActionTypes.SET_SAVED_VIEWS) {
    return action.value;
  }
  return state;
}

let reducers = combineReducers({
  sequenceData: sequenceDataReducer,
  tempSequence: tempSequenceReducer,
  sequenceViewHasErrors: sequenceViewHasErrorsReducer,
  currentUrl: currentUrlReducer,
  simulationData: simulationDataReducer,
  hover:  hoverNodeReducer,
  dragging: draggingNodeReducer,
  eventData: setEventDataReducer,
  zoomFactor: zoomFactorReducer,
  rotationAngle: rotationAngleReducer,
  origin: originReducer,
  pickingColor: pickingColorReducer,
  canvasDimensions: canvasDimensionsReducer,
  canvasCursorType: canvasCursorTypeReducer,
  savedViews: savedViewsReducer
});

export default reducers;
