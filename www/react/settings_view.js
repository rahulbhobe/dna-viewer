var React = require('react');
var ColorSettings = require('./color_settings');

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <ColorSettings />
            </div>);
  }
});

module.exports = SettingsView;
