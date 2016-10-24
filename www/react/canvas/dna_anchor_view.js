import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class DnaAnchorView extends React.Component {
  render () {
    if (this.props.ignore) return null;
    let {x, y, index, type} = this.props;
    var classes =  classNames('dna-base-anchor', 'dna-base-' + type.toLowerCase());

    return (<g transform={'translate(' + x + ', ' + y + ')'}>
              <circle className={classes} />
            </g>);
  };
};

var mapStateToProps = (initialState, initialOwnProps) => {
  let index = initialOwnProps.index;

  return (state) => {
    let anchored = state.simulationData.anchored;
    let bases    = state.sequenceParser.getBases();
    if (index >= anchored.length) return {ignore: true};
    if (index >= bases.length)    return {ignore: true};
    return {
      x: anchored[index].x.toFixed(2),
      y: anchored[index].y.toFixed(2),
      type: bases[index].getType()
    };
  };
};

export default connect(mapStateToProps)(DnaAnchorView);
