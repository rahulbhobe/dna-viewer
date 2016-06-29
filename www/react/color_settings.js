import React from 'react';
import {SketchPicker as ColorPicker} from 'react-color';
import jss from 'jss-browserify';

class ColorsButton extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this);
  };

  onClick () {
    this.props.onSelected(this.props.type);
  };

  render () {
    var type = this.props.type;
    return (<div className="settings-color-div" >
              <div className={'dna-base-font'}>
                {type}
              </div>
              <button type="button" className="settings-color-button" onClick={this.onClick} style={{backgroundColor:this.props.color}} />
            </div>);
  };
};

class ColorSettings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null
    };

    this.onSelected       = this.onSelected.bind(this);
    this.onChangeComplete = this.onChangeComplete.bind(this);
  };

  getColorForType (type) {
    var type = type.toLowerCase();
    var color = jss.get('.dna-base-' + type);
    return color.fill;
  };

  setColorForType (type, val) {
    jss.set('.dna-base-' + type.toLowerCase(), {fill: val});
  };

  onSelected (type) {
    if (this.state.selected === type) {
      this.setState({selected: null});
      return;
    }
    this.setState({selected: type});
  };

  onChangeComplete (color) {
    var type = this.state.selected; 
    this.setColorForType(type, color.hex)
    this.setState({selected: null});
  };

  colorPalleteForSelection () {
    if (!this.state.selected) {
      return;
    }
    var color = this.getColorForType(this.state.selected);
    return (<ColorPicker type="sketch" onChangeComplete={this.onChangeComplete} color={color}/>);
  };

  render () {
    return (<div className="settings-color-wrap-div">
              <ColorsButton type='A' color={this.getColorForType('A')} onSelected={this.onSelected}/>
              <ColorsButton type='C' color={this.getColorForType('C')} onSelected={this.onSelected}/>
              <ColorsButton type='G' color={this.getColorForType('G')} onSelected={this.onSelected}/>
              <ColorsButton type='T' color={this.getColorForType('T')} onSelected={this.onSelected}/>
              <ColorsButton type='N' color={this.getColorForType('N')} onSelected={this.onSelected}/>
              {this.colorPalleteForSelection()}
            </div>);
  };
};

export default ColorSettings;
