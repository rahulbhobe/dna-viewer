import React from 'react';
import SequenceUtils from '../../utils/sequence_utils';
import ThumbnailView from './thumbnail_view';
import Dimensions from '../../utils/dimensions';
import {connect} from 'react-redux';

class Preview extends React.Component {
  render () {
    let sequenceData = this.getSequenceDataToRender();
    let {seq, dbn} = sequenceData.getData();

    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <div> Drag Preview: </div>
              <ThumbnailView showEmpty={this.props.dragging===-1} seq={seq} dbn={dbn} />
            </div>);
  };

  getSequenceDataToRender () {
    let sequenceData      = this.props.sequenceData;
    let {dragging, hover} = this.props;
    if (dragging === -1)    return sequenceData;
    if (hover    === -1)    return sequenceData;
    if (dragging === hover) return sequenceData;
    let sequenceDataNew = SequenceUtils.getJoinedSequence(sequenceData, this.props.dragging, this.props.hover);
    if (!sequenceDataNew) return sequenceData;
    return sequenceDataNew;
  };
};

let mapStateToProps = (state) => {
  return {
    sequenceData: state.sequenceData,
    hover: state.hover,
    dragging: state.dragging
  }
};

export default connect(mapStateToProps)(Preview);