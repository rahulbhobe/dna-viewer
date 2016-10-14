import React from 'react';
import {Vector} from '../mathutils/gl_matrix_wrapper';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaAnnotationView extends React.Component {
  render () {
    if (this.props.ignore) return null;
    let text     = this.props.text;
    let location = this.getLocation().asObj();
    return (<g transform={"translate(" + location.x + ", " + location.y + ")"} >
              <text className={classNames('dna-text', 'dna-base-font')} textAnchor="middle" dominantBaseline="central">{text}</text>
            </g>);
  };

  getLocation () {
    let point   = Vector.create(this.props.x0, this.props.y0);
    let other1  = Vector.create(this.props.xp, this.props.yp);
    let other2  = Vector.create(this.props.xn, this.props.yn);
    let vec1    = point.subtract(other1);
    let vec2    = point.subtract(other2);
    let bisect  = vec1.add(vec2);
    let drawAt  = point.add(bisect.normalize().scale(20));

    return drawAt;
  };

};

var mapStateToProps = (initialState, initialOwnProps) => {
  let type   = initialOwnProps.type;
  let text   = (type==='start') ? "5'" : "3'";

  return (state) => {
    let animated    = state.simulatedData.animated;
    let l           = animated.length;
    if (l < 3) return {ignore: true};
    let pointsStart = [animated[1],   animated[0],   animated[l-1]];
    let pointsEnd   = [animated[l-2], animated[l-1], animated[0]];
    let points      = (type==='start') ? pointsStart : pointsEnd;

    return {
      text: text,
      xp: points[0].x,
      yp: points[0].y,
      x0: points[1].x,
      y0: points[1].y,
      xn: points[2].x,
      yn: points[2].y
    };
  };
};

export default connect(mapStateToProps)(DnaAnnotationView);
