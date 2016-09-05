import React from 'react';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';
import GridLayout from './grid_layout';

class SettingsView extends React.Component {
  getLayout() {
    return [
      {x:0,  y:0,  w:2,  h:2,  v: true, i: 'ColorSettings',      d: (<ColorSettings />)},
      {x:0,  y:1,  w:1,  h:3,  v: true, i: 'AppearanceSettings', d: (<AppearanceSettings />)},
      {x:1,  y:1,  w:1,  h:1,  v: true, i: 'FontSettings',       d: (<FontSettings />)}
    ];
  };

  render () {
    var properties = {
      cols: 2,
      rowHeight: 46,
      width: 235
    };

    return (<div className="settings-view" >
              <GridLayout properties={properties} layout={this.getLayout()} />
            </div>);
  };
};

export default SettingsView;
