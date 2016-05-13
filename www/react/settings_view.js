var React = require('react');
var ColorSettings = require('./color_settings');
var FontSettings = require('./font_settings');

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <ColorSettings />
              <FontSettings />
            </div>);
  }
});

module.exports = SettingsView;
