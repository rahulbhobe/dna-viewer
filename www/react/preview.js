import React from 'react';
import {Vector} from '../mathutils/gl_matrix_wrapper';
import classNames from 'classnames';
import * as Dimensions from './dimensions';
import {connect} from 'react-redux';

class Preview extends React.Component {
  render () {
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var bases       = sequenceParser.getBases();
    var width       = this.getWindowWidth();
    var height      = this.getWindowHeight();
    var coordinates = this.getCoordinatesForScreen();
    var bases       = sequenceParser.getBases();

    return (
      <svg className='svg-class' width={width} height={height} ref='svg' onContextMenu={this.onContextMenu} >
        {coordinates.map((point, ii) => {
            var {x, y}  = point.asObj();
            var base    = bases[ii];
            var classes = classNames('dna-base-preview', 'dna-base-' + base.getType().toLowerCase());
            return (<g transform={'translate(' + x + ', ' + y + ')'} key={'base_preview' + ii} >
                      <circle className={classes} />
                    </g>);
        })}
      </svg>);
  };

  getWindowWidth () {
    return Dimensions.SETTINGS_VIEW_WIDTH;
  };

  getWindowHeight () {
    return Dimensions.SETTINGS_VIEW_ROW_HEIGHT * 4;
  };

  getCoordinatesForScreen () {
    var width          = this.getWindowWidth();
    var height         = this.getWindowHeight();
    var sequenceParser = this.props.sequenceParser;
    return sequenceParser.getCoordinates(width, height);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceParser: state.sequenceParser
  };
};

export default connect(mapStateToProps)(Preview);
