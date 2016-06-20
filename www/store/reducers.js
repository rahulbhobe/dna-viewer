import {combineReducers} from 'redux';
import * as ActionTypes from './action_types';

var hoverNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.HOVER_NODE_SET) {
    return action.value;
  } else if (action.type === ActionTypes.HOVER_NODE_RESET) {
    return -1;
  }
  return state;
};

var draggingNodeReducer = (state=-1, action) => {
  if (action.type === ActionTypes.DRAGGING_NODE_SET) {
    return action.value;
  } else if (action.type === ActionTypes.DRAGGING_NODE_RESET) {
    return -1;
  }
  return state;
};

var reducers = combineReducers({
  hover:  hoverNodeReducer,
  dragging: draggingNodeReducer
});

export default reducers;
