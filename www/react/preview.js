import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SequenceUtils from '../utils/sequence_utils';
import ThumbnailView from './thumbnail_view';
import {connect} from 'react-redux';

class Preview extends React.Component {
  render () {
    let sequenceParser = this.getSequenceParserToRender();
    let {seq, dbn} = sequenceParser.getData();

    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <ReactCSSTransitionGroup transitionName='preview-anim' transitionAppear={true} transitionAppearTimeout={900} transitionEnterTimeout={1} transitionLeaveTimeout={1}>
                <ThumbnailView key='thumbnail' seq={seq} dbn={dbn} />
              </ReactCSSTransitionGroup>
            </div>);
  };

  getSequenceParserToRender () {
    let sequenceParser = this.props.sequenceParser;
    if (this.props.dragging === -1) return sequenceParser;
    if (this.props.hover    === -1) return sequenceParser;
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