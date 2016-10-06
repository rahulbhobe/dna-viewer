import React from 'react';
import {Vector} from '../mathutils/gl_matrix_wrapper';
import classNames from 'classnames';
import SequenceParser from '../src/sequence_parser';
import Dimensions from '../utils/dimensions';

class ThumbnailView extends React.Component {
  render () {
    let {seq, dbn} = this.props;
    var sequenceParser = new SequenceParser(seq, dbn);
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var bases       = sequenceParser.getBases();
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = sequenceParser.getCoordinates(width, height);

    return (
        <svg key='svg' className='svg-class-thumbnail' width={width} height={height} onContextMenu={this.onContextMenu} >
          {coordinates.map((point, ii) => {
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

  getWindowWidth () {
    return Dimensions.SETTINGS_VIEW_WIDTH - 20;
  };

  getWindowHeight () {
    return (Dimensions.DNA_VIEWER_ROW_HEIGHT * 6) - 20;
  };
};

export default ThumbnailView;
