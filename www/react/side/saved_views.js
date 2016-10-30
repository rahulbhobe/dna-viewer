import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Slick from 'react-slick';
import ThumbnailView from './thumbnail_view';
import RequestUtils from '../../utils/request_utils'
import SequenceData from '../../core/sequence_data';
import Dimensions from '../../utils/dimensions';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

const SavedViewWithAnimations = (props) => {
  if (props.isDragging) {
    return (<div className='div-empty-preview' style={{width: Dimensions.getThumbnailWidth(), height: Dimensions.getThumbnailHeight()}} />);
  }
  return (<ReactCSSTransitionGroup transitionName='preview-anim' transitionAppear={true} transitionAppearTimeout={900} transitionEnterTimeout={900} transitionLeaveTimeout={900}>
            <ThumbnailView key='thumbnail' seq={props.seq} dbn={props.dbn} />
          </ReactCSSTransitionGroup>);
};

class SavedViews extends React.Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  };

  render () {
    let settings = {
      dots: true,
      infinite: false,
      speed: 500,
      draggable: true,
      arrows: true,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      initialSlide: 0,
      touchMove: false,
      lazyLoad: true
    };

    if (this.props.savedViews.length===0) {return null;}

    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <div> Saved Views: </div>
              <Slick {...settings}>
                {this.props.savedViews.map(({url, seq, dbn}) => {
                  return (<div key={url}>
                            <button onClick={this.onClick(url)} title={'Open view "' + window.location.origin + '/' + url + '".'} >{url}</button>
                            <SavedViewWithAnimations key='savedview' isDragging={this.props.dragging!==-1} seq={seq} dbn={dbn} />
                          </div>);
                })}
              </Slick>
            </div>);
  };

  onClick(url) {
    return () => {
      RequestUtils.getSavedDataForUrl(url).then(({url, seq, dbn}) => {
        let sequenceData = new SequenceData(seq, dbn);
        this.props.actions.setSequenceData(sequenceData);
        this.props.actions.setTempSequence(seq, dbn);
        this.props.actions.setCurrentUrl(url);
        window.history.pushState("", "Title", "/" + url);
      }).catch((err) => {
        console.log(err);
      });
    };
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    savedViews: state.savedViews,
    dragging: state.dragging
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedViews);
