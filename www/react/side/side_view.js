import React from 'react';
import {connect} from 'react-redux';
import ColorSettings from './color_settings';
import FontSettings from './font_settings';
import AppearanceSettings from './appearance_settings';
import SavedViews from './saved_views';
import Preview from './preview';
import Dimensions from '../../utils/dimensions';
import GridLayout from '../main/grid_layout';

class SideView extends React.Component {
  getLayout () {
    let notPickingColor  = this.props.notPickingColor;
    let th = this.props.canvasDimensions.height / Dimensions.DNA_VIEWER_ROW_HEIGHT;
    let av = th > 2 + 5 + 9 + 6;
    let sv = th > 2 + 9 + 6;
    let pv = th > 2 + 6;
    let sh = th-(9+6);
    let ph = th-(6);

    return [
      {x:0,  y:0,   w:2,  h:2,  v: true,                  i: 'ColorSettings'},
      {x:0,  y:2,   w:1,  h:5,  v: av && notPickingColor, i: 'AppearanceSettings'},
      {x:1,  y:2,   w:1,  h:2,  v: av && notPickingColor, i: 'FontSettings'},
      {x:0,  y:sh,  w:2,  h:9,  v: sv && notPickingColor, i: 'SavedViews'},
      {x:0,  y:ph,  w:2,  h:6,  v: pv && notPickingColor, i: 'Preview'}
    ];
  };

  render () {
    let properties = {
      cols: 2,
      rowHeight: Dimensions.DNA_VIEWER_ROW_HEIGHT,
      width: Dimensions.SETTINGS_VIEW_WIDTH
    };

    return (<div className="settings-view" >
              <GridLayout properties={properties} layout={this.getLayout()}>
                <ColorSettings      key='ColorSettings' />
                <AppearanceSettings key='AppearanceSettings' />
                <FontSettings       key='FontSettings' />
                <SavedViews         key='SavedViews' />
                <Preview            key='Preview' />
              </GridLayout>
            </div>);
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    notPickingColor: state.pickingColor === null,
    canvasDimensions: state.canvasDimensions
  }
};

export default connect(mapStateToProps)(SideView);
