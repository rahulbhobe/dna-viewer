
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

  var setColorForType = function(type, hex) {
    var clsName = '.' + getStylesClass(type);
    jss.set(clsName, {fill: hex})
  };

  // initialize jss:
  _(defaultColors).each(function (hex, type) {
    setColorForType(type, hex);
  });

  return {
    getStylesClassForType: function(type) {
      return getStylesClass(type);
    },

    getColorForType: function(type) {
      var clsName = '.' + getStylesClass(type);
      var color = jss.get(clsName);
      return color.fill;
    },

    setColorForType: function(type, hex) {
      setColorForType(type, hex);
    }
  };
}

var ColorsButton =  React.createClass({
  onClick: function() {
    this.props.onSelected(this.props.type);
  },

  render: function () {
    var type = this.props.type;
    return (<div className="settings-color-div" >
              <div>
                {type}
              </div>
              <button type="button" className="settings-color-button" onClick={this.onClick} style={{backgroundColor:Settings.Data.getColorForType(type)}} />
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
    if (this.state.selected === type) {
      this.setState({selected: null});
      return;
    }
    this.setState({selected: type});
  },

  onChangeComplete: function(color) {
    var type = this.state.selected; 
    Settings.Data.setColorForType(type, color.hex)
    this.setState({selected: null});
  },

  colorPalleteForSelection: function() {
    if (!this.state.selected) {
      return;
    }
    var color = Settings.Data.getColorForType(this.state.selected);
    return (<ColorPicker type="sketch" onChangeComplete={this.onChangeComplete} color={color}/>);
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
Settings.Data = new SettingsData();

module.exports = Settings;
