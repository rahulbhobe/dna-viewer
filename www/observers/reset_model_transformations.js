import ReduxUtils from '../utils/redux_utils';

const mapStateToProps = (state) => {
  return {
    url: state.currentUrl
  };
};

const resetModelTransoformations = (props) => {
  props.actions.resetZoomFactor();
  props.actions.resetRotationAngle();
  props.actions.resetOrigin();
};

ReduxUtils.registerObserver(mapStateToProps, resetModelTransoformations);
