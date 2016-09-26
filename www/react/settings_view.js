import React from 'react';
import {connect} from 'react-redux';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';
import Preview from './preview';
import GridLayout from './grid_layout';

class SettingsView extends React.Component {
  getLayout () {
    let pv = this.props.dragging;
    return [
      {x:0,  y:0,  w:2,  h:2,  v: true, i: 'ColorSettings'},
      {x:0,  y:2,  w:1,  h:3,  v: true, i: 'AppearanceSettings'},
      {x:1,  y:2,  w:1,  h:1,  v: true, i: 'FontSettings'},
      {x:0,  y:8,  w:2,  h:3,  v: pv,   i: 'Preview'}
    ];
  };

  render () {
    var properties = {
      cols: 2,
      rowHeight: 46,
      width: 235
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
    dragging: state.dragging !== -1
  }
};

export default connect(mapStateToProps)(SettingsView);
