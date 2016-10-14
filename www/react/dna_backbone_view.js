import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaBackboneView extends React.Component {
  render () {
    let {x1, y1, x2, y2} = this.props;
    var classes = classNames('dna-backbone', 'dna-base-backbone');
    return (<line x1={x1} y1={y1} x2={x2} y2={y2} className={classes} />);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let index  = initialOwnProps.index;

  return (state) => {
    let animated = state.simulatedData.animated;
    let source = index;
    let target = index+1;
    return {
      x1: (source < animated.length) ? animated[source].x.toFixed(2) : 0,
      y1: (source < animated.length) ? animated[source].y.toFixed(2) : 0,
      x2: (target < animated.length) ? animated[target].x.toFixed(2) : 0,
      y2: (target < animated.length) ? animated[target].y.toFixed(2) : 0
    };
  };
};

export default connect(mapStateToProps)(DnaBackboneView);
