import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';

class SettingsView extends React.Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  getLayout() {
    return [
      {x:0,  y:0,  w:2,  h:2,  i: 'ColorSettings'},
      {x:0,  y:1,  w:1,  h:3,  i: 'AppearanceSettings'},
      {x:1,  y:1,  w:1,  h:1,  i: 'FontSettings'}
    ];
  };

  render () {
    var properties = {
      className: "layout",
      isDraggable: false,
      isResizable: false,
      cols: 2,
      rowHeight: 46,
      width: 235,
      margin: [0, 0],
      verticalCompact: false
    };

    return (<div className="settings-view" >
              <ReactGridLayout layout={this.getLayout()}{...properties}>
                <div key='ColorSettings'>      <ColorSettings />      </div>
                <div key='AppearanceSettings'> <AppearanceSettings /> </div>
                <div key='FontSettings'>       <FontSettings />       </div>
              </ReactGridLayout>
            </div>);
  };
};

export default SettingsView;
