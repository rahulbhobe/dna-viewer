import React from 'react';
import GridLayout from './grid_layout';
import RequestUtils from './request_utils'
import classNames from 'classnames';
import store from '../store/store';
import {mapDispatchToProps} from '../store/action_dispatcher';
import {connect} from 'react-redux';

class ShareLink extends React.Component {
  constructor (props) {
    super(props);
    this.onAdd                    = this.onAdd.bind(this);
    this.onSave                   = this.onSave.bind(this);
    this.onDelete                 = this.onDelete.bind(this);
    this.onFitToScreen            = this.onFitToScreen.bind(this);
    this.onRotateCounterClockwise = this.onRotateCounterClockwise.bind(this);
    this.onRotateClockwise        = this.onRotateClockwise.bind(this);
  };

  getLayout () {
    var u  = !!this.props.url;
    var cw = this.props.canvasDimensions.width;
    var ww = 36;
    return [
      {x:0,          y:0,  w:ww,  h:1,  v: u,    i: 'DocSave'},
      {x:u?ww:0,     y:0,  w:ww,  h:1,  v: true, i: 'DocAdd'},
      {x:2*ww,       y:0,  w:ww,  h:1,  v: u,    i: 'DocDelete'},
      {x:cw-(5*ww),  y:0,  w:ww,  h:1,  v: true, i: 'RotateCCW'},
      {x:cw-(4*ww),  y:0,  w:ww,  h:1,  v: true, i: 'RotateCW'},
      {x:cw-(3*ww),  y:0,  w:ww,  h:1,  v: true, i: 'FitToScreen'}
    ];
  };

  render () {
    var properties = {
      cols: this.props.canvasDimensions.width,
      rowHeight: 32,
      width: this.props.canvasDimensions.width
    };

    var clsName1 = classNames('share-link-button');
    var clsName2 = classNames('share-link-button', {'share-link-hidden': !this.props.url});
    return (<GridLayout properties={properties} layout={this.getLayout()}>
              <input key='DocSave'        type="image" className={clsName2} title={'Save data at "'          + window.location.origin + '/' + this.props.url + '".'} src="/res/save_icon.png" alt="Submit" onClick={this.onSave}/>
              <input key='DocAdd'         type="image" className={clsName1} title={'Save data to a new location.'} src="/res/save_add_icon.png" alt="Submit" onClick={this.onAdd}/>
              <input key='DocDelete'      type="image" className={clsName2} title={'Remove data stored at "' + window.location.origin + '/' + this.props.url + '".'} src="/res/save_del_icon.png" alt="Submit" onClick={this.onDelete}/>
              <input key='RotateCCW'      type="image" className={clsName1} title={'Rotate by 90 deg in counter clock wise direction.'} src="/res/rotate_counterclockwise.png" alt="Submit" onClick={this.onRotateCounterClockwise}/>
              <input key='RotateCW'       type="image" className={clsName1} title={'Rotate by 90 deg in clock wise direction.'} src="/res/rotate_clockwise.png" alt="Submit" onClick={this.onRotateClockwise}/>
              <input key='FitToScreen'    type="image" className={clsName1} title={'Fit to screen.'} src="/res/fit_to_screen_icon.png" alt="Submit" onClick={this.onFitToScreen}/>
            </GridLayout>);
  };

  onAdd () {
    this.onSaveImpl("add");
  };

  onSave () {
    this.onSaveImpl("save");
  };

  onDelete () {
    this.onSaveImpl("delete");
  };

  onFitToScreen () {
    this.props.actions.resetOrigin();
    this.props.actions.resetRotationAngle();
    this.props.actions.resetZoomFactor();
  };

  onRotateCounterClockwise () {
    this.props.actions.setRotationAngle(store.getState().rotationAngle + 90);
  };

  onRotateClockwise () {
    this.props.actions.setRotationAngle(store.getState().rotationAngle - 90);
  };

  onSaveImpl (type) {
    let {url, seq, dbn} = this.props;
    RequestUtils.saveToDataBase(type, {url, seq, dbn}).then(({url}) => {
      this.onSuccess(url);
    }).catch((err) => {
      this.onError(err);
    });
  };

  onSuccess (url) {
    this.props.actions.setCurrentUrl(url);
    window.history.pushState("", "Title", "/" + url);
  };

  onError (err) {
    console.log('Server Error: ', err);
  };
};


var mapStateToProps = (state, ownProps) => {
  return {
    url: state.currentUrl,
    seq: state.sequenceParser.getData().seq,
    dbn: state.sequenceParser.getData().dbn,
    canvasDimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareLink);
