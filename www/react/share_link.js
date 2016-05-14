var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var $ = require('jquery');

var ShareLink =  React.createClass({
  render: function () {
    var clsName = (this.state && this.state.expanded) ? "" : "share-link-box-hidden";
    clsName += " share-links-box";
    var value   = this.state ? this.state.url : "place holder";
    return (<div className="share-link-button" >
              <input type="image" src="/res/share_icon.png" alt="Submit" onClick={this.onClick}/>
              <span className={clsName}>{value}</span>
            </div>);
  },

  onClick: function () {
    var data = {
      seq: this.props.seq,
      dbn: this.props.dbn
    };
    $.ajax({
      type: "POST",
      url: "/sharelink",
      data: JSON.stringify(data),
      success: this.onSuccess,
      dataType: "json",
      contentType: "application/json"
    });
  },

  onSuccess: function (data) {
    var url = window.location.origin + '/l/' + data.url;
    this.setState({
      url: url,
      expanded: true,
      seq: this.props.seq,
      dbn: this.props.dbn
    });
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
