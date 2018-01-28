import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Vector} from '../../mathutils/gl_matrix_wrapper';
import classNames from 'classnames';
import SequenceData from '../../core/sequence_data';
import Dimensions from '../../utils/dimensions';

const ThumbnailViewPlain = (props) => {
  let {seq, dbn} = props;
  let sequenceData = new SequenceData(seq, dbn);
  if (sequenceData.hasErrors()) {
    return null;
  }

  let bases   = sequenceData.getBases();
  let width   = Dimensions.getThumbnailWidth();
  let height  = Dimensions.getThumbnailHeight();
  let points  = sequenceData.getCoordinates(width-6, height-6).points;

  return (
      <svg key='svg' className='svg-class-thumbnail' width={width} height={height} >
        {points.map((point, ii) => {
          let {x, y}  = point.asObj();
          let base    = bases[ii];
          let classes = classNames('dna-base-thumbnail', 'dna-base-' + base.getType().toLowerCase());
          return (
            <g transform={'translate(' + x + ', ' + y + ')'} key={'base_thumbnail_' + ii} >
              <circle className={classes} />
            </g>);
        })}
      </svg>);
};

const ThumbnailView = (props) => {
  if (props.showEmpty) {
    return (<svg key='svg' className='svg-class-empty-thumbnail' width={Dimensions.getThumbnailWidth()} height={Dimensions.getThumbnailHeight()} />);
  }
  return (<ReactCSSTransitionGroup transitionName='thumbnail-anim' transitionAppear={true} transitionEnterTimeout={900} transitionLeaveTimeout={900}>
            <ThumbnailViewPlain key='thumbnail' seq={props.seq} dbn={props.dbn} />
          </ReactCSSTransitionGroup>);
};

export default ThumbnailView;
