import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaBackboneView extends React.Component {
  render () {
    if (this.props.ignore) return null;
    let {x1, y1, x2, y2} = this.props;
    let classes = classNames('dna-backbone', 'dna-base-backbone');
    return (<line x1={x1} y1={y1} x2={x2} y2={y2} className={classes} />);
  };
};

let mapStateToProps = (initialState, initialOwnProps) => {
  let index  = initialOwnProps.index;

  return (state) => {
    let animated = state.simulationData.animated;
    let source = index;
    let target = index+1;
    if (source >= animated.length) return {ignore: true};
    if (target >= animated.length) return {ignore: true};
    return {
      x1: animated[source].x.toFixed(2),
      y1: animated[source].y.toFixed(2),
      x2: animated[target].x.toFixed(2),
      y2: animated[target].y.toFixed(2)
    };
  };
};

export default connect(mapStateToProps)(DnaBackboneView);
