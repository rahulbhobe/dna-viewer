import React from 'react';
import ReduxUtils from '../../utils/redux_utils';
import classNames from 'classnames';

class DnaAnchorView extends React.Component {
  render () {
    if (this.props.ignore) return null;
    let {x, y, index, type} = this.props;
    let classes =  classNames('dna-base-anchor', 'dna-base-' + type.toLowerCase());

    return (<g transform={'translate(' + x + ', ' + y + ')'}>
              <circle className={classes} />
            </g>);
  };
};

let mapStateToProps = (initialState, initialOwnProps) => {
  let index = initialOwnProps.index;

  return (state) => {
    let anchored = state.simulationData.anchored;
    let bases    = state.sequenceData.getBases();
    if (index >= anchored.length) return {ignore: true};
    if (index >= bases.length)    return {ignore: true};
    return {
      x: anchored[index].x.toFixed(2),
      y: anchored[index].y.toFixed(2),
      type: bases[index].getType()
    };
  };
};

export default ReduxUtils.connect(mapStateToProps)(DnaAnchorView);
