import React from 'react';
import {connect} from 'react-redux';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';
import Preview from './preview';
import * as Dimensions from './dimensions';
import GridLayout from './grid_layout';

class SettingsView extends React.Component {
  getLayout () {
    let dragging         = this.props.dragging;
    let notPickingColor  = this.props.notPickingColor;

    return [
      {x:0,  y:0,  w:2,  h:2,  v: true,             i: 'ColorSettings'},
      {x:0,  y:2,  w:1,  h:3,  v: notPickingColor,  i: 'AppearanceSettings'},
      {x:1,  y:2,  w:1,  h:1,  v: notPickingColor,  i: 'FontSettings'},
      {x:0,  y:8,  w:2,  h:4,  v: dragging,         i: 'Preview'}
    ];
  };

  render () {
    var properties = {
      cols: 2,
      rowHeight: Dimensions.SETTINGS_VIEW_ROW_HEIGHT,
      width: Dimensions.SETTINGS_VIEW_WIDTH
    };

    return (<div className="settings-view" >
              <GridLayout properties={properties} layout={this.getLayout()}>
                <ColorSettings      key='ColorSettings' />
                <AppearanceSettings key='AppearanceSettings' />
                <FontSettings       key='FontSettings' />
                <Preview            key='Preview' />
              </GridLayout>
            </div>);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    dragging: state.dragging !== -1,
    notPickingColor: state.pickingColor === null
  }
};

export default connect(mapStateToProps)(SettingsView);
