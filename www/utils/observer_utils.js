import {observer, observe} from 'redux-observers';
import * as actionCreators from '../store/action_creators';
import {mapDispatchToProps} from '../store/action_dispatcher';

class ObserverUtils {
  static _observers = [];

  static registerObserver (mapStateToPropsFunc, observerFunc, options) {
    let dispatchFunc = (dispatch, currentState, previousState) => {
      observerFunc(mapDispatchToProps(dispatch), currentState, previousState);
    };
    this._observers.push(observer(mapStateToPropsFunc, dispatchFunc, options));
  };

  static observeChanges (store, options) {
    observe(store, this._observers, options);
  };
};

export default ObserverUtils;
