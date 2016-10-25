import {bindActionCreators} from 'redux';
import * as actionCreators from './action_creators';

export let mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actionCreators, dispatch) };
};
