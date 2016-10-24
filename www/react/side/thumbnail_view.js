import React from 'react';
import {Vector} from '../../mathutils/gl_matrix_wrapper';
import classNames from 'classnames';
import SequenceData from '../../core/sequence_data';
import Dimensions from '../../utils/dimensions';

class ThumbnailView extends React.Component {
  render () {
    let {seq, dbn} = this.props;
    var sequenceData = new SequenceData(seq, dbn);
    if (sequenceData.hasErrors()) {
      return null;
    }

    var bases   = sequenceData.getBases();
    var width   = Dimensions.getThumbnailWidth();
    var height  = Dimensions.getThumbnailHeight();
    var points  = sequenceData.getCoordinates(width-6, height-6).points;

    return (
        <svg key='svg' className='svg-class-thumbnail' width={width} height={height} onContextMenu={this.onContextMenu} >
          {points.map((point, ii) => {
            var {x, y}  = point.asObj();
            var base    = bases[ii];
            var classes = classNames('dna-base-thumbnail', 'dna-base-' + base.getType().toLowerCase());
            return (
              <g transform={'translate(' + x + ', ' + y + ')'} key={'base_thumbnail_' + ii} >
                <circle className={classes} />
              </g>);
          })}
        </svg>);
  };
};

export default ThumbnailView;
