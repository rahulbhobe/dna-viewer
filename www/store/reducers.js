import {combineReducers} from 'redux';
import * as ActionTypes from './action_types';

var sequenceParserReducer = (state=null, action) => {
  if (action.type === ActionTypes.SET_SEQUENCE_PARSER) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_SEQUENCE_PARSER) {
    return action.value;
  }
  return state;
};

var tempSequenceReducer = (state={seq: '', dbn: ''}, action) => {
  if (action.type === ActionTypes.SET_TEMP_SEQUENCE) {
    return action.value;
  }
  return state;
};

var sequenceViewHasErrorsReducer = (state=false, action) => {
  if (action.type === ActionTypes.SET_SEQUENCE_VIEW_HAS_ERRORS) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_SEQUENCE_VIEW_HAS_ERRORS) {
    return action.value;
  }
  return state;
};

var currentUrlReducer = (state="", action) => {
  if (action.type === ActionTypes.SET_CURRENT_URL) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_CURRENT_URL) {
    return action.value;
  }
  return state;
};

var hoverNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.SET_HOVER_NODE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_HOVER_NODE) {
    return action.value;
  }
  return state;
};

var draggingNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.SET_DRAGGING_NODE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_DRAGGING_NODE) {
    return action.value;
  }
  return state;
};

var currentMousePositionReducer = (state={x:-1, y:-1}, action) => {
  if (action.type === ActionTypes.SET_CURRENT_MOUSE_POSITION) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_CURRENT_MOUSE_POSITION) {
    return action.value;
  }
  return state;
};

var setMouseActionDataReducer = (state= {type: 'none', startData: null}, action) => {
  if (action.type === ActionTypes.SET_MOUSE_ACTION_DATA) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_MOUSE_ACTION_DATA) {
    return action.value;
  }
  return state;
};

var zoomFactorReducer = (state=100, action) => {
  if (action.type === ActionTypes.SET_ZOOM_FACTOR) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ZOOM_FACTOR) {
    return action.value;
  }
  return state;
};

var rotationAngleReducer = (state=0, action) => {
  if (action.type === ActionTypes.SET_ROTATION_ANGLE) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ROTATION_ANGLE) {
    return action.value;
  }
  return state;
};

var originReducer = (state={x:0, y:0}, action) => {
  if (action.type === ActionTypes.SET_ORIGIN) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_ORIGIN) {
    return action.value;
  }
  return state;
};

var pickingColorReducer = (state=null, action) => {
  if (action.type === ActionTypes.SET_PICKING_COLOR) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_PICKING_COLOR) {
    return action.value;
  }
  return state;
};

var canvasDimensionsReducer = (state={width:-1, height:-1}, action) => {
  if (action.type === ActionTypes.SET_CANVAS_DIMENSIONS) {
    return action.value;
  }
  return state;
};

var reducers = combineReducers({
  sequenceParser: sequenceParserReducer,
  tempSequence: tempSequenceReducer,
  sequenceViewHasErrors: sequenceViewHasErrorsReducer,
  currentUrl: currentUrlReducer,
  hover:  hoverNodeReducer,
  dragging: draggingNodeReducer,
  currentMousePosition: currentMousePositionReducer,
  mouseActionData: setMouseActionDataReducer,
  zoomFactor: zoomFactorReducer,
  rotationAngle: rotationAngleReducer,
  origin: originReducer,
  pickingColor: pickingColorReducer,
  canvasDimensions: canvasDimensionsReducer
});

export default reducers;
