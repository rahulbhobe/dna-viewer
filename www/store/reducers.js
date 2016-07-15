import {combineReducers} from 'redux';
import * as ActionTypes from './action_types';

var hoverNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.HOVER_NODE_SET) {
    return action.value;
  } else if (action.type === ActionTypes.HOVER_NODE_RESET) {
    return action.value;
  }
  return state;
};

var draggingNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.DRAGGING_NODE_SET) {
    return action.value;
  } else if (action.type === ActionTypes.DRAGGING_NODE_RESET) {
    return action.value;
  }
  return state;
};

var mousePositionReducer = (state={x:-1, y:-1}, action) => {
  if (action.type === ActionTypes.MOUSE_POSITION_SET) {
    return action.value;
  } else if (action.type === ActionTypes.MOUSE_POSITION_RESET) {
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
