import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ActionCreators from '../store/action_creators';

class ReduxUtils {
  static connect (mapStateToProps, shouldMapDispatchToProps=false) {
    return connect(mapStateToProps, shouldMapDispatchToProps ? this.mapDispatchToProps : null);
  };  

  static mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(ActionCreators, dispatch) };
  };
};

export default ReduxUtils;
