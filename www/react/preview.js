import React from 'react';
import SequenceParser from '../src/sequence_parser';
import ThumbnailView from './thumbnail_view';
import {connect} from 'react-redux';

class Preview extends React.Component {
  render () {
    let sequenceParser = this.getSequenceParserToRender();
    let {seq, dbn} = sequenceParser.getData();

    return (<ThumbnailView seq={seq} dbn={dbn} />);
  };

  getSequenceParserToRender() {
    let sequenceParser = this.props.sequenceParser;
    let dragging = this.props.dragging;
    let hover    = this.props.hover;

    if (dragging === -1) return sequenceParser;
    if (hover === -1) return sequenceParser;

    let bases    = sequenceParser.getBases();
    let base1    = bases[dragging];
    let base2    = bases[hover];

    if (!base1.isUnpaired()) return sequenceParser;
    if (!base2.isUnpaired()) return sequenceParser;
    if (!base1.canPairWith(base2)) return sequenceParser;

    let {seq, dbn} = sequenceParser.getData();
    let min = Math.min(dragging, hover);
    let max = Math.max(dragging, hover);

    let newdbn =  dbn.substring(0, min) + '(' + dbn.substring(min+1, max) + ')' + dbn.substring(max+1);
    let sequenceParserNew = new SequenceParser(seq, newdbn);
    if (sequenceParserNew.hasErrors()) {
      return sequenceParser;
    }

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