var React = require('react');
var ColorPicker = require('react-color').SketchPicker;
var _ = require('underscore');
var SettingsData = require('./settings_data');

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
              <button type="button" className="settings-color-button" onClick={this.onClick} style={{backgroundColor:SettingsData.getColorForType(type)}} />
            </div>);
  },
});

var ColorSettings =  React.createClass({
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
    SettingsData.setColorForType(type, color.hex)
    this.setState({selected: null});
  },

  colorPalleteForSelection: function() {
    if (!this.state.selected) {
      return;
    }
    var color = SettingsData.getColorForType(this.state.selected);
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


module.exports = ColorSettings;
