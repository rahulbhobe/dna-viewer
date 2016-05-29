var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var $ = require('jquery');

var ShareLink =  React.createClass({
  getInitialState: function() {
    return {
      url: window.location.origin,
      expanded: false
    };
  },

  render: function () {
    var clsName = (this.state && this.state.expanded) ? "" : "share-link-box-hidden";
    clsName += " share-links-box";
    return (<div className="share-link-button" >
              <input type="image" src="/res/share_icon.png" alt="Submit" onClick={this.onClick}/>
              <span className={clsName}>{this.state.url}</span>
            </div>);
  },

  onClick: function () {
    if (this.state.expanded) {
      this.setState({expanded: false});
      return;
    }

    var data = {
      seq: this.props.seq,
      dbn: this.props.dbn
    };
    $.ajax({
      type: "POST",
      url: "/sharelink",
      data: JSON.stringify(data),
      success: this.onSuccess,
      error: this.onError,
      dataType: "json",
      contentType: "application/json"
    });
  },

  onSuccess: function (data) {
    var url = window.location.origin + '/' + data.url;
    this.setState({
      url: url,
      expanded: true,
      seq: this.props.seq,
      dbn: this.props.dbn
    });
  },

  onError: function () {
    console.log('Server Error.');
  },

  componentWillReceiveProps: function (nextProps) {
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
  }
});


module.exports = ShareLink;
