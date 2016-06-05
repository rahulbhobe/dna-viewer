import React from 'react';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';

class SettingsView extends React.Component {
  render () {
    return (<div className="settings-view" >
              <ColorSettings />
              <FontSettings />
              <AppearanceSettings />
            </div>);
  };
};

export default SettingsView;
