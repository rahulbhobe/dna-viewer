import React from 'react';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';
import GridLayout from './grid_layout';

class SettingsView extends React.Component {
  getLayout() {
    return [
      {x:0,  y:0,  w:2,  h:2,  v: true, i: 'ColorSettings'},
      {x:0,  y:2,  w:1,  h:3,  v: true, i: 'AppearanceSettings'},
      {x:1,  y:2,  w:1,  h:1,  v: true, i: 'FontSettings'}
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
              </GridLayout>
            </div>);
  };
};

export default SettingsView;
