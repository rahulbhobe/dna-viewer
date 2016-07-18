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

var mousePositionReducer = (state={x:-1, y:-1}, action) => {
  if (action.type === ActionTypes.SET_MOUSE_POSITION) {
    return action.value;
  } else if (action.type === ActionTypes.RESET_MOUSE_POSITION) {
    return action.value;
  }
  return state;
};

var windowDimensionsReducer = (state={width:-1, height:-1}, action) => {
  if (action.type === ActionTypes.SET_WINDOW_DIMENSIONS) {
    return action.value;
  }
  return state;
};

var reducers = combineReducers({
  sequenceParser: sequenceParserReducer,
  hover:  hoverNodeReducer,
  dragging: draggingNodeReducer,
  mousePosition: mousePositionReducer,
  windowDimensions: windowDimensionsReducer
});

export default reducers;
