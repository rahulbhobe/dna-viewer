import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaBaseView extends React.Component {
  render () {
    let {x, y, index, type} = this.props;
    var classes = classNames('dna-base', 'dna-base-size', {
                              ['dna-base-' + type.toLowerCase()] : true,
                              'dna-base-selected': this.props.hover,
                              'dna-base-moving': this.props.dragging,
                            });
    var textCls = classNames('dna-text', 'dna-base-font');
    var clsName = classNames({'dna-base-banned-pairing': this.props.bannedCursorWhenMoving});

    return (<g className={clsName} transform={'translate(' + x + ', ' + y + ')'}>
              <circle className={classes} data-index={index} />
              <text className={textCls} textAnchor='middle' dominantBaseline='central'>{type}</text>
            </g>);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let index = initialOwnProps.index;

  return (state) => {
    let animated = state.simulatedData.animated;
    let base     = state.sequenceParser.getBases()[index];
    return {
      index: index,
      x: (index < animated.length) ? animated[index].x.toFixed(2) : 0,
      y: (index < animated.length) ? animated[index].y.toFixed(2) : 0,
      type: base.getType(),
      hover: state.hover === index,
      dragging: state.dragging === index
    };
  };
};

export default connect(mapStateToProps)(DnaBaseView);
