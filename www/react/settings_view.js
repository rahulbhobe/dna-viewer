
var React = require('react');
var SketchPicker = require('react-color').SketchPicker;

var ColorPallete =  React.createClass({
  render: function () {
    return (<div className="settings-view" >
            </div>);
  },
});

var update = function() {
  alert('here i am');
}

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <SketchPicker />
            </div>);
  }
});

module.exports = SettingsView;
