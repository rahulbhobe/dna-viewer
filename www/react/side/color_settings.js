import React from 'react';
import {SketchPicker as ColorPicker} from 'react-color';
import jss from 'jss-browserify';
import classNames from 'classnames';
import Dimensions from '../../utils/dimensions';
import ReduxUtils from '../../utils/redux_utils';

class ColorsButton extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this);
  };

  onClick () {
    this.props.onSelected(this.props.type);
  };

  render () {
    let type    = this.props.type;
    let clsName = classNames('settings-color-button-div', 'dna-base-font');

    return (<div className='settings-color-div' >
              <button type='button' className='settings-color-button'onClick={this.onClick} style={{backgroundColor:this.props.color}}>
                <div className={clsName}>
                  {type}
                </div>
              </button>
            </div>);
  };
};

class ColorSettings extends React.Component {
  constructor (props) {
    super(props);

    this.onSelected       = this.onSelected.bind(this);
    this.onChangeComplete = this.onChangeComplete.bind(this);
  };

  getColorForType (type) {
    let color = jss.get('.dna-base-' + type.toLowerCase());
    return color.fill;
  };

  setColorForType (type, val) {
    jss.set('.dna-base-' + type.toLowerCase(), {fill: val});
  };

  onSelected (type) {
    if (this.props.pickingColor === type) {
      this.props.actions.resetPickingColor();
      return;
    }
    this.props.actions.setPickingColor(type);
  };

  onChangeComplete (color) {
    let type = this.props.pickingColor;
    this.setColorForType(type, color.hex)
    this.props.actions.resetPickingColor();
  };

  colorPalleteForSelection () {
    if (!this.props.pickingColor) {
      return;
    }
    let color = this.getColorForType(this.props.pickingColor);
    return (<ColorPicker type="sketch" width={Dimensions.SETTINGS_VIEW_WIDTH-20} onChangeComplete={this.onChangeComplete} color={color}/>);
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

let mapStateToProps = (state, ownProps) => {
  return {
    pickingColor: state.pickingColor
  };
};

export default ReduxUtils.connect(mapStateToProps, true)(ColorSettings);
