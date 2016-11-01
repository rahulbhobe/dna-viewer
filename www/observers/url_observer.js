import ObserverUtils from '../utils/observer_utils';

const mapStateToProps = (state) => {
  return {
    url: state.currentUrl
  };
};

const urlChangeObserver = (props) => {
  props.actions.resetZoomFactor();
  props.actions.resetRotationAngle();
  props.actions.resetOrigin();
};

export default ObserverUtils.registerObserver(mapStateToProps, urlChangeObserver);
