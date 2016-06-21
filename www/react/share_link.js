import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import request from 'request';

class ShareLink extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      url: window.location.origin,
      expanded: false
    };
    this.onClick   = this.onClick.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError   = this.onError.bind(this);
  };

  render () {
    var clsName = (this.state && this.state.expanded) ? "" : "share-link-box-hidden";
    clsName += " share-links-box";
    return (<div className="share-link-button" >
              <input type="image" src="/res/share_icon.png" alt="Submit" onClick={this.onClick}/>
              <span className={clsName}>{this.state.url}</span>
            </div>);
  };

  onClick () {
    if (this.state.expanded) {
      this.setState({expanded: false});
      return;
    }

    var data = {
      seq: this.props.seq,
      dbn: this.props.dbn
    };

    request.post(window.location.origin + '/sharelink', {form: data}, (err, httpResponse, body) => {
      if (err) {
        this.onError(err);
      }
      this.onSuccess(JSON.parse(body));
    });
  };

  onSuccess (data) {
    var url = window.location.origin + '/' + data.url;
    this.setState({
      url: url,
      expanded: true,
      seq: this.props.seq,
      dbn: this.props.dbn
    });
  };

  onError () {
    console.log('Server Error.');
  };

  componentWillReceiveProps (nextProps) {
    if (!this.state) return;
    if (!this.state.expanded) return;

    if (_.isEqual(this.state.seq, nextProps.seq) && _.isEqual(this.state.dbn, nextProps.dbn)) {
      return;
    }

    this.setState({
      url: null,
      expanded: false,
      seq: nextProps.seq,
      dbn: nextProps.dbn
    });
  };
};

export default ShareLink;
