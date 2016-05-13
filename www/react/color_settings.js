var React = require('react');
var ColorPicker = require('react-color').SketchPicker;
var _ = require('underscore');

var ColorsButton =  React.createClass({
  onClick: function() {
    this.props.onSelected(this.props.type);
  },

  render: function () {
    var type = this.props.type;
    return (<div className="settings-color-div" >
              <div className={'dna-base-font'}>
                {type}
              </div>
              <button type="button" className="settings-color-button" onClick={this.onClick} style={{backgroundColor:this.props.color}} />
            </div>);
  },
});

var ColorSettings =  React.createClass({
  getInitialState: function() {
    return {
      selected: null
    };
  },

  getColorForType: function(type) {
    var type = type.toLowerCase();
    var color = jss.get('.dna-base-' + type);
    return color.fill;
  },

  setColorForType: function(type, val) {
    jss.set('.dna-base-' + type.toLowerCase(), {fill: val});
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
    this.setColorForType(type, color.hex)
    this.setState({selected: null});
  },

  colorPalleteForSelection: function() {
    if (!this.state.selected) {
      return;
    }
    var color = this.getColorForType(this.state.selected);
    return (<ColorPicker type="sketch" onChangeComplete={this.onChangeComplete} color={color}/>);
  },

  render: function () {
    var self = this;
    return (<div className="settings-color-wrap-div">
              <ColorsButton type='A' color={self.getColorForType('A')} onSelected={self.onSelected}/>
              <ColorsButton type='C' color={self.getColorForType('C')} onSelected={self.onSelected}/>
              <ColorsButton type='G' color={self.getColorForType('G')} onSelected={self.onSelected}/>
              <ColorsButton type='T' color={self.getColorForType('T')} onSelected={self.onSelected}/>
              <ColorsButton type='N' color={self.getColorForType('N')} onSelected={self.onSelected}/>
              {this.colorPalleteForSelection()}
            </div>);
  },
});


module.exports = ColorSettings;
