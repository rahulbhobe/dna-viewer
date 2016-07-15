import * as ActionTypes from './action_types';

export var hoverNodeSet = (node) => {
  return { type: ActionTypes.HOVER_NODE_SET, value: node };
};

export var hoverNodeReset = () => {
  return { type: ActionTypes.HOVER_NODE_RESET, value: -1 };
};

export var draggingNodeSet = (node) => {
  return { type: ActionTypes.DRAGGING_NODE_SET, value: node };
};

export var draggingNodeReset = () => {
  return { type: ActionTypes.DRAGGING_NODE_RESET, value: -1 };
};

export var mousePositionSet = (x, y) => {
  return { type: ActionTypes.MOUSE_POSITION_SET, value: {x, y} };
};

export var mousePositionReset = () => {
  return { type: ActionTypes.MOUSE_POSITION_RESET, value: {x: -1, y: -1} };
};
