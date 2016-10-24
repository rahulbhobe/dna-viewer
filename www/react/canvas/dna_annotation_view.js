import React from 'react';
import {Vector} from '../../mathutils/gl_matrix_wrapper';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaAnnotationView extends React.Component {
  render () {
    if (this.props.ignore) return null;
    let {text, x, y}   = this.props;
    return (<g transform={"translate(" + x + ", " + y + ")"} >
              <text className={classNames('dna-text', 'dna-base-font')} textAnchor="middle" dominantBaseline="central">{text}</text>
            </g>);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let type   = initialOwnProps.type;
  let text   = (type==='start') ? "5'" : "3'";

  return (state) => {
    let animated    = state.simulatedData.animated;
    let centers     = state.simulatedData.centers;
    if (animated.length < 3) return {ignore: true};
    if (centers.length < 1)  return {ignore: true};

    let pointId  = (type==='start') ? 0 : animated.length-1;
    let point    = Vector.create(animated[pointId].x, animated[pointId].y);
    let center   = centers[0];
    let vec      = point.subtract(center);
    let location = point.add(vec.normalize().scale(25));
    let {x, y}   = location.asObj();

    return {
      text: text,
      x: x.toFixed(2),
      y: y.toFixed(2)
    };
  };
};

export default connect(mapStateToProps)(DnaAnnotationView);
