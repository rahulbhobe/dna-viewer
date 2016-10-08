import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SequenceUtils from '../utils/sequence_utils';
import ThumbnailView from './thumbnail_view';
import Dimensions from '../utils/dimensions';
import {connect} from 'react-redux';

const PreviewWithAnimations = (props) => {
  if (!props.isDragging) {
    return (<div className='div-empty-preview' style={{width: Dimensions.getThumbnailWidth(), height: Dimensions.getThumbnailHeight()}} />);
  }
  return (<ReactCSSTransitionGroup transitionName='preview-anim' transitionAppear={true} transitionAppearTimeout={900} transitionEnterTimeout={900} transitionLeaveTimeout={900}>
            <ThumbnailView key='thumbnail' seq={props.seq} dbn={props.dbn} />
          </ReactCSSTransitionGroup>);
};

class Preview extends React.Component {
  render () {
    let sequenceParser = this.getSequenceParserToRender();
    let {seq, dbn} = sequenceParser.getData();

    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <div> Drag Preview: </div>
              <PreviewWithAnimations key='preview' isDragging={this.props.dragging!==-1} seq={seq} dbn={dbn} />
            </div>);
  };

  getSequenceParserToRender () {
    let sequenceParser    = this.props.sequenceParser;
    let {dragging, hover} = this.props;
    if (dragging === -1)    return sequenceParser;
    if (hover    === -1)    return sequenceParser;
    if (dragging === hover) return sequenceParser;
    let sequenceParserNew = SequenceUtils.getJoinedSequence(sequenceParser, this.props.dragging, this.props.hover);
    if (!sequenceParserNew) return sequenceParser;
    return sequenceParserNew;
  };
};

var mapStateToProps = (state) => {
  return {
    sequenceParser: state.sequenceParser,
    hover: state.hover,
    dragging: state.dragging
  }
};

export default connect(mapStateToProps)(Preview);