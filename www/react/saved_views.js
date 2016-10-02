import React from 'react';
import Slick from 'react-slick';
import Preview from './preview';
import {connect} from 'react-redux';

const SavedViewsHeader = (props) => {
  return (<div> Saved Views: </div>);
};

class SavedViews extends React.Component {
  render () {
    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      draggable: false,
      arrows: true,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: false,
      initialSlide: 0,
      touchMove: false,
      lazyLoad: true
    };

    var links = Array.from(Array(7).keys());

    var items = links.map((link) => {
      return (<div key={link}> <Preview seq={this.props.seq} dbn={this.props.dbn} /> </div>);
    });
      
    return (<div className='dna-base-font' style={{textAlign: 'center'}}>
              <SavedViewsHeader url={'Bfhbg3R'}/>
              <Slick {...settings}>
                { items }
              </Slick>
            </div>);
  };
};


var mapStateToProps = (state, ownProps) => {
  return {
    seq: state.sequenceParser.getData().seq,
    dbn: state.sequenceParser.getData().dbn
  };
};

export default connect(mapStateToProps)(SavedViews);
