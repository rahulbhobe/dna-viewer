import {combineReducers} from 'redux';
import * as ActionTypes from './action_types';

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

var reducers = combineReducers({
  hover:  hoverNodeReducer,
  dragging: draggingNodeReducer,
  mousePosition: mousePositionReducer
});

export default reducers;
