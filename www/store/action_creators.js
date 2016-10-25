import * as ActionTypes from './action_types';

export let setSequenceData = (sequenceData) => {
  return { type: ActionTypes.SET_SEQUENCE_DATA, value: sequenceData };
};

export let resetSequenceData = () => {
  return { type: ActionTypes.RESET_SEQUENCE_DATA, value: null };
};

export let setTempSequence = (seq, dbn) => {
  return { type: ActionTypes.SET_TEMP_SEQUENCE, value: {seq, dbn} };
};

export let setSequenceViewHasErrors = (value) => {
  return { type: ActionTypes.SET_SEQUENCE_VIEW_HAS_ERRORS, value: value };
};

export let resetSequenceViewHasErrors = () => {
  return { type: ActionTypes.RESET_SEQUENCE_VIEW_HAS_ERRORS, value: false };
};

export let setCurrentUrl = (url) => {
  return { type: ActionTypes.SET_CURRENT_URL, value: url };
};

export let resetCurrentUrl = () => {
  return { type: ActionTypes.RESET_CURRENT_URL, value: "" };
};

export let setSimulationData = (data) => {
  return { type: ActionTypes.SET_SIMULATION_DATA, value: data };
};

export let resetSimulationData = () => {
  return { type: ActionTypes.RESET_SIMULATION_DATA, value: {simulation: null, anchored: [], animated: []} };
};

export let setHoverNode = (node) => {
  return { type: ActionTypes.SET_HOVER_NODE, value: node };
};

export let resetHoverNode = () => {
  return { type: ActionTypes.RESET_HOVER_NODE, value: -1 };
};

export let setDraggingNode = (node) => {
  return { type: ActionTypes.SET_DRAGGING_NODE, value: node };
};

export let resetDraggingNode = () => {
  return { type: ActionTypes.RESET_DRAGGING_NODE, value: -1 };
};

export let setEventData = (type, position, otherData = {}) => {
  return { type: ActionTypes.SET_EVENT_DATA, value: {type, startData: Object.assign(otherData, {position}) } };
};

export let resetEventData = () => {
  return { type: ActionTypes.RESET_EVENT_DATA, value: {type: 'none', startData: null} };
};

export let setZoomFactor = (zoomFactor) => {
  return { type: ActionTypes.SET_ZOOM_FACTOR, value: zoomFactor };
};

export let resetZoomFactor = () => {
  return { type: ActionTypes.RESET_ZOOM_FACTOR, value: 100 };
};

export let setRotationAngle = (rotationAngle) => {
  return { type: ActionTypes.SET_ROTATION_ANGLE, value: rotationAngle };
};

export let resetRotationAngle = () => {
  return { type: ActionTypes.RESET_ROTATION_ANGLE, value: 0 };
};

export let setOrigin = (origin) => {
  return { type: ActionTypes.SET_ORIGIN, value: origin };
};

export let resetOrigin = () => {
  return { type: ActionTypes.RESET_ORIGIN, value: {x: 0, y: 0} };
};

export let setPickingColor = (type) => {
  return { type: ActionTypes.SET_PICKING_COLOR, value: type };
};

export let resetPickingColor = () => {
  return { type: ActionTypes.RESET_PICKING_COLOR, value: null };
};

export let setCanvasDimensions = (width, height) => {
  return { type: ActionTypes.SET_CANVAS_DIMENSIONS, value: {width, height} };
};

export let setCanvasCursor = (type) => {
  return { type: ActionTypes.SET_CANVAS_CURSOR_TYPE, value: type };
};

export let resetCanvasCursor = () => {
  return { type: ActionTypes.RESET_CANVAS_CURSOR_TYPE, value: 'none' };
};

export let setSavedViews = (views) => {
  return { type: ActionTypes.SET_SAVED_VIEWS, value: views };
};
