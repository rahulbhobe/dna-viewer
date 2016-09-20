import React from 'react';
import request from 'request';
import promisify from 'es6-promisify';
import classNames from 'classnames';
import {mapDispatchToProps} from '../store/action_dispatcher';
import {connect} from 'react-redux';

class ShareLink extends React.Component {
  constructor (props) {
    super(props);
    this.onAdd    = this.onAdd.bind(this);
    this.onSave   = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
  };

  render () {
    var clsName1 = classNames('share-link-button');
    var clsName2 = classNames('share-link-button', {'share-link-hidden': !this.props.url});
    return (<div>
              <input type="image" className={clsName2} title={'Save data at "'          + window.location.origin + '/' + this.props.url + '".'} src="/res/save_icon.png" alt="Submit" onClick={this.onSave}/>
              <input type="image" className={clsName1} title={'Save data to a new location.'} src="/res/save_add_icon.png" alt="Submit" onClick={this.onAdd}/>
              <input type="image" className={clsName2} title={'Remove data stored at "' + window.location.origin + '/' + this.props.url + '".'} src="/res/save_del_icon.png" alt="Submit" onClick={this.onDelete}/>
            </div>);
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

  onSaveImpl (type) {
    var data = {
      type,
      url:  this.props.url,
      seq:  this.props.seq,
      dbn:  this.props.dbn
    };

    promisify(request.post)(window.location.origin + '/link', {form: data})
    .then((httpResponse) => {
      var {url} = JSON.parse(httpResponse.body);
      this.onSuccess(type, url);
    }).catch((err) => {
      this.onError(err);
    });
  };

  onSuccess (type, url) {
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
    dbn: state.sequenceParser.getData().dbn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareLink);
