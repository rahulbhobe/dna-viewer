import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaLineView extends React.Component {
  render () {
    let {x1, y1, x2, y2, type} = this.props;
    var classes = classNames('dna-' + type, 'dna-base-' + type);
    return (<line x1={x1} y1={y1} x2={x2} y2={y2} className={classes} />);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let source = initialOwnProps.source;
  let target = initialOwnProps.target;

  return (state) => {
    let animated = state.simulatedData.animated;
    return {
      x1: (source < animated.length) ? animated[source].x.toFixed(2) : 0,
      y1: (source < animated.length) ? animated[source].y.toFixed(2) : 0,
      x2: (target < animated.length) ? animated[target].x.toFixed(2) : 0,
      y2: (target < animated.length) ? animated[target].y.toFixed(2) : 0
    };
  };
};

export default connect(mapStateToProps)(DnaLineView);
