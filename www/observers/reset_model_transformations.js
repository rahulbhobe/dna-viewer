import ReduxUtils from '../utils/redux_utils';

const mapStateToProps = (state) => {
  return {
    url: state.currentUrl
  };
};

const resetModelTransoformations = (actions) => {
  actions.resetZoomFactor();
  actions.resetRotationAngle();
  actions.resetOrigin();
};

ReduxUtils.registerObserver(mapStateToProps, resetModelTransoformations);
