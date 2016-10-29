import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SequenceUtils from '../../utils/sequence_utils';
import ThumbnailView from './thumbnail_view';
import Dimensions from '../../utils/dimensions';
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
    let sequenceData = this.getSequenceDataToRender();
    let {seq, dbn} = sequenceData.getData();

    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <div> Drag Preview: </div>
              <PreviewWithAnimations key='preview' isDragging={this.props.dragging!==-1} seq={seq} dbn={dbn} />
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