import {bindActionCreators} from 'redux';
import * as actionCreators from './action_creators';

export var mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};
