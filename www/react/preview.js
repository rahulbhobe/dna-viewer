import React from 'react';
import SequenceUtils from '../utils/sequence_utils';
import ThumbnailView from './thumbnail_view';
import {connect} from 'react-redux';

class Preview extends React.Component {
  render () {
    let sequenceParser = this.getSequenceParserToRender();
    let {seq, dbn} = sequenceParser.getData();

    return (<ThumbnailView seq={seq} dbn={dbn} />);
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