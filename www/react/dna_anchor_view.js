import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaAnchorView extends React.Component {
  render () {
    let {x, y, index, type} = this.props;
    var classes =  classNames('dna-base-anchor', 'dna-base-' + type.toLowerCase());

    return (<g transform={'translate(' + x + ', ' + y + ')'}>
              <circle className={classes} data-index={index} />
            </g>);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let index = initialOwnProps.index;
  let base  = initialState.sequenceParser.getBases()[index];

  return (state) => {
    let anchored = state.simulatedData.anchored;
    return {
      index: index,
      x: (index < anchored.length) ? anchored[index].x.toFixed(2) : 0,
      y: (index < anchored.length) ? anchored[index].y.toFixed(2) : 0,
      type: base.getType()
    };
  };
};

export default connect(mapStateToProps)(DnaAnchorView);
