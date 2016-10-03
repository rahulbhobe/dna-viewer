import React from 'react';
import Slick from 'react-slick';
import Preview from './preview';
import {connect} from 'react-redux';

const SavedViewsHeader = (props) => {
  return (<div> Saved Views: </div>);
};

class SavedViews extends React.Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  };

  render () {
    var settings = {
      dots: false,
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
              <SavedViewsHeader />
              <Slick {...settings}>
                {this.props.savedViews.map(({url, seq, dbn}) => {
                  return (<div key={url}>
                            <button onClick={this.onClick(url)}>{url}</button>
                            <Preview seq={seq} dbn={dbn} />
                          </div>);
                })}
              </Slick>
            </div>);
  };

  onClick(url) {
    return () => {
      alert(url);
    };
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    savedViews: state.savedViews,
  };
};

export default connect(mapStateToProps)(SavedViews);
