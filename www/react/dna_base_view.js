import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaBaseView extends React.Component {
  render () {
    var point   = this.props.point;
    var base    = this.props.base;
    var classes = classNames('dna-base', 'dna-base-size', {
                              ['dna-base-' + base.getType().toLowerCase()] : true,
                              'dna-base-selected': this.props.hover && !this.props.isDraggedNode,
                              'dna-base-moving': this.props.dragging && !this.props.isDraggedNode
                            });
    var textCls = classNames('dna-text', 'dna-base-font');
    var clsName = classNames({'dna-base-banned-pairing': this.props.bannedCursorWhenMoving});

    return (<g className={clsName} transform={'translate(' + point.elements[0] + ', ' + point.elements[1] + ')'}>
              <circle className={classes} data-index={this.props.isDraggedNode ? -1 : base.getIndex()} />
              <text className={textCls} textAnchor='middle' dominantBaseline='central'> {base.getType()}</text>
            </g>);
  };
};

var mapStateToProps = function(state, ownProps) {
  return {
    hover: state.hover === ownProps.base.getIndex(),
    dragging: state.dragging === ownProps.base.getIndex()
  }
};

export default connect(mapStateToProps)(DnaBaseView);
