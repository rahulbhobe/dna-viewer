var React = require('react');
var SettingsData = require('./settings_data');
var _ = require('underscore');

var FontSettings =  React.createClass({
  render: function () {
    return (<div className="settings-font-div" style={{fontFamily: SettingsData.getFontClass()}}>
              Font:
              <select onChange={this.onChange}>
              {_(SettingsData.getAllFonts()).map(function (font, ii) {
                return (<option value={font} style={{fontFamily: font}} key={"fonts_" + ii}>{font}</option>);
              })}
              </select>
            </div>);
  },

  onChange: function(event) {
    SettingsData.setFont(event.target.value);
  }
});


module.exports = FontSettings;
