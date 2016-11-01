import ObserverUtils from '../utils/observer_utils';

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

ObserverUtils.registerObserver(mapStateToProps, resetModelTransoformations);