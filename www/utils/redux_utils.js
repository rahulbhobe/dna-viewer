import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {observer, observe} from 'redux-observers';
import * as ActionCreators from '../store/action_creators';

class ReduxUtils {
  static _observers = [];

  static connect (mapStateToProps, shouldMapDispatchToProps=false) {
    return connect(mapStateToProps, shouldMapDispatchToProps ? this.mapDispatchToProps : null);
  };  

  static mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(ActionCreators, dispatch) };
  };

  static registerObserver (mapStateToPropsFunc, observerFunc, options) {
    let dispatchFunc = (dispatch, currentState, previousState) => {
      observerFunc(this.mapDispatchToProps(dispatch), currentState, previousState);
    };
    this._observers.push(observer(mapStateToPropsFunc, dispatchFunc, options));
  };

  static observeChanges (store, options) {
    observe(store, this._observers, options);
  };
};

export default ReduxUtils;
