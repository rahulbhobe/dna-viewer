import * as ActionTypes from './action_types';

export var setSequenceParser = (sequenceParser) => {
  return { type: ActionTypes.SET_SEQUENCE_PARSER, value: sequenceParser };
};

export var resetSequenceParser = () => {
  return { type: ActionTypes.RESET_SEQUENCE_PARSER, value: null };
};

export var setTempSequence = (seq, dbn) => {
  return { type: ActionTypes.SET_TEMP_SEQUENCE, value: {seq, dbn} };
};

export var setSequenceViewHasErrors = (value) => {
  return { type: ActionTypes.SET_SEQUENCE_VIEW_HAS_ERRORS, value: value };
};

export var resetSequenceViewHasErrors = () => {
  return { type: ActionTypes.RESET_SEQUENCE_VIEW_HAS_ERRORS, value: false };
};

export var setCurrentUrl = (url) => {
  return { type: ActionTypes.SET_CURRENT_URL, value: url };
};

export var resetCurrentUrl = () => {
  return { type: ActionTypes.RESET_CURRENT_URL, value: "" };
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

export var setCurrentMousePosition = (position) => {
  return { type: ActionTypes.SET_CURRENT_MOUSE_POSITION, value: position };
};

export var resetCurrentMousePosition = () => {
  return { type: ActionTypes.RESET_CURRENT_MOUSE_POSITION, value: {x: -1, y: -1} };
};

export var setMouseActionData = (type, position, otherData = {}) => {
  return { type: ActionTypes.SET_MOUSE_ACTION_DATA, value: {type, startData: Object.assign(otherData, {position}) } };
};

export var resetMouseActionData = () => {
  return { type: ActionTypes.RESET_MOUSE_ACTION_DATA, value: {type: 'none', startData: null} };
};

export var setZoomFactor = (zoomFactor) => {
  return { type: ActionTypes.SET_ZOOM_FACTOR, value: zoomFactor };
};

export var resetZoomFactor = () => {
  return { type: ActionTypes.RESET_ZOOM_FACTOR, value: 100 };
};

export var setRotationAngle = (rotationAngle) => {
  return { type: ActionTypes.SET_ROTATION_ANGLE, value: rotationAngle };
};

export var resetRotationAngle = () => {
  return { type: ActionTypes.RESET_ROTATION_ANGLE, value: 0 };
};

export var setOrigin = (origin) => {
  return { type: ActionTypes.SET_ORIGIN, value: origin };
};

export var resetOrigin = () => {
  return { type: ActionTypes.RESET_ORIGIN, value: {x: 0, y: 0} };
};

export var setPickingColor = (type) => {
  return { type: ActionTypes.SET_PICKING_COLOR, value: type };
};

export var resetPickingColor = () => {
  return { type: ActionTypes.RESET_PICKING_COLOR, value: null };
};

export var setCanvasDimensions = (width, height) => {
  return { type: ActionTypes.SET_CANVAS_DIMENSIONS, value: {width, height} };
};

export var setSavedViews = (views) => {
  return { type: ActionTypes.SET_SAVED_VIEWS, value: views };
};
