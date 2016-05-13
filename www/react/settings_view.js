
var React = require('react');
var ColorPicker = require('react-color').SketchPicker;
var _ = require('underscore');

var SettingsData = function() {
  var defaultColors = {
    'A': '#64dd17',
    'C': '#00b0ff',
    'G': '#1d2120',
    'T': '#e62739',
    'N': '#b0a18e'
  };

  var getStylesClass = function(type) {
    return 'dna-base-' + type.toLowerCase();
  };

  // initialize jss:
  _(defaultColors).each(function (color, type) {
    var clsName = '.' + getStylesClass(type);
    jss.set(clsName, {fill: color});
  });

  return {
    getStylesClassForType: function(type) {
      return getStylesClass(type);
    },

    getColorForType: function(type) {
      var color = jss.get(clsName);
      return color.fill;
    }
  };
}

var ColorsButton =  React.createClass({
  onClick: function() {
    this.props.onSelected(this.props.type);
  },

  render: function () {
    return (<div>
              <button type="button" onClick={this.onClick}>{this.props.type}</button>
            </div>);
  },
});

var ColorsPallete =  React.createClass({
  getInitialState: function() {
    return {
      selected: null
    };
  },

  onSelected: function(type) {
    this.setState({selected: type});
  },

  onChangeComplete: function(color) {
    var type = this.state.selected; 
    var clsName = ".dna-base-" + type.toLowerCase();
    jss.set(clsName, {fill: color.hex})
    this.setState({selected: null});
  },

  getColorForType: function(type) {
    var clsName = ".dna-base-" + type.toLowerCase();
    var color = jss.get(clsName);
  },

  colorPalleteForSelection: function() {
    if (!this.state.selected) {
      return;
    }

    this.getColorForType(this.state.selected);
    return (<ColorPicker type="sketch" onChangeComplete={this.onChangeComplete} />);
  },

  render: function () {
    return (<div>
              <ColorsButton type='A' onSelected={this.onSelected} />
              <ColorsButton type='C' onSelected={this.onSelected} />
              <ColorsButton type='G' onSelected={this.onSelected} />
              <ColorsButton type='T' onSelected={this.onSelected} />
              <ColorsButton type='N' onSelected={this.onSelected} />
              {this.colorPalleteForSelection()}
            </div>);
  },
});

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <ColorsPallete />
            </div>);
  }
});

var Settings = {};
Settings.View = SettingsView;
Settings.Data = new SettingsData;

module.exports = Settings;
