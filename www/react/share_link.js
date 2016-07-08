import React from 'react';
import request from 'request';
import promisify from 'es6-promisify';

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

    promisify(request.post)(window.location.origin + '/sharelink', {form: data})
    .then((httpResponse) => {
      this.onSuccess(JSON.parse(httpResponse.body));
    }).catch((err) => {
      this.onError(err);
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

  onError (err) {
    console.log('Server Error: ', err);
  };

  componentWillReceiveProps (nextProps) {
    if (!this.state) return;
    if (!this.state.expanded) return;

    if ((this.state.seq===nextProps.seq) && (this.state.dbn===nextProps.dbn)) {
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
