import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class ReduxUtils {
  static connect (mapStateToProps, shouldMapDispatchToProps=false) {
    return connect(mapStateToProps, shouldMapDispatchToProps ? mapDispatchToProps : null);
  };  
};

export default ReduxUtils;
