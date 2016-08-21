import React from 'react';
import request from 'request';
import promisify from 'es6-promisify';
import {connect} from 'react-redux';

class ShareLink extends React.Component {
  constructor (props) {
    super(props);
    this.onClick   = this.onClick.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError   = this.onError.bind(this);
  };

  render () {
    return (<div className="share-link-button" >
              <input type="image" src="/res/share_icon.png" alt="Submit" onClick={this.onClick}/>
            </div>);
  };

  onClick () {
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
  };

  onError (err) {
    console.log('Server Error: ', err);
  };
};


var mapStateToProps = (state, ownProps) => {
  return {
    seq: state.sequenceParser.getData().seq,
    dbn: state.sequenceParser.getData().dbn
  };
};

export default connect(mapStateToProps)(ShareLink);
