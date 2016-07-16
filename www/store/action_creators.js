import * as ActionTypes from './action_types';

export var setSequenceParser = (sequenceParser) => {
  return { type: ActionTypes.SET_SEQUENCE_PARSER, value: sequenceParser };
};

export var resetSequenceParser = () => {
  return { type: ActionTypes.RESET_SEQUENCE_PARSER, value: null };
};

export var setHoverNode = (node) => {
  return { type: ActionTypes.SET_HOVER_NODE, value: node };
};

export var resetHoverNode = () => {
  return { type: ActionTypes.RESET_HOVER_NODE, value: -1 };
};

export var setDraggingNode = (node) => {
  return { type: ActionTypes.SET_DRAGGING_NODE, value: node };
};

export var resetDraggingNode = () => {
  return { type: ActionTypes.RESET_DRAGGING_NODE, value: -1 };
};

export var setMousePosition = (x, y) => {
  return { type: ActionTypes.SET_MOUSE_POSITION, value: {x, y} };
};

export var resetMousePosition = () => {
  return { type: ActionTypes.RESET_MOUSE_POSITION, value: {x: -1, y: -1} };
};
