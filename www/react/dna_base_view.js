import React from 'react';
import {connect} from 'react-redux';

class DnaBaseView extends React.Component {
  render () {
    var point   = this.props.point;
    var base    = this.props.base;
    var classes = " dna-base dna-base-size ";
    var textCls = "dna-text dna-base-font ";

    classes += " " + 'dna-base-' + base.getType().toLowerCase();
    classes += this.props.hover ? " dna-base-selected" : "";
    classes += this.props.dragging ? " dna-base-moving" : "";
    var clsName = this.props.bannedCursorWhenMoving ? " dna-base-banned-pairing " : "";
    return (<g className={clsName}
              transform={"translate(" + point.elements[0] + ", " + point.elements[1] + ")"}>
            <circle className={classes} data-index={base.getIndex()} />
            <text className={textCls} textAnchor="middle" dominantBaseline="central"> {base.getType()}</text>
            </g>);
  };
};

var mapStateToProps = function(state, ownProps) {
  return {
    hover: state.hover === ownProps.base.getIndex(),
    dragging: state.dragging === ownProps.base.getIndex()
  }
}

export default connect(mapStateToProps)(DnaBaseView);
