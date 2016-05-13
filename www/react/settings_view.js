var React = require('react');
var ColorSettings = require('./color_settings');
var FontSettings = require('./font_settings');
var AppearanceSettings = require('./appearance_settings');

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <ColorSettings />
              <FontSettings />
              <AppearanceSettings />
            </div>);
  }
});

module.exports = SettingsView;
