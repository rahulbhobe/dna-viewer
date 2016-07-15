import * as ActionTypes from './action_types';

export var hoverNodeSet = (node) => {
  return { type: ActionTypes.HOVER_NODE_SET, value: node };
};

export var hoverNodeReset = () => {
  return { type: ActionTypes.HOVER_NODE_RESET };
};

export var draggingNodeSet = (node) => {
  return { type: ActionTypes.DRAGGING_NODE_SET, value: node };
};

export var draggingNodeReset = () => {
  return { type: ActionTypes.DRAGGING_NODE_RESET };
};

export var mousePositionSet = (x, y) => {
  return { type: ActionTypes.MOUSE_POSITION_SET, value: {x, y} };
};

export var mousePositionReset = () => {
  return { type: ActionTypes.MOUSE_POSITION_RESET };
};
