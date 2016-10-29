import React from 'react';
import GridLayout from './grid_layout';
import SimulationData from './simulation_data';
import Canvas from '../canvas/canvas';
import TopView from '../top/top_view';
import SideView from '../side/side_view';
import BottomView from '../bottom/bottom_view';
import Dimensions from '../../utils/dimensions';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class DnaViewer extends React.Component {
  getLayout () {
    let {width, height}  = this.props.canvasDimensions;
    let ch = height/Dimensions.DNA_VIEWER_ROW_HEIGHT;
    let cw = width;
    let tw = window.innerWidth;
    let sw = tw - cw;
    let vb = !Dimensions.isHeightSmall() && !Dimensions.isWidthSmall();
    let vs = !Dimensions.isWidthSmall();

    return [
      {x:0,   y:0,    w:cw,  h:1,     v: true,  i: 'TopView'},
      {x:0,   y:1,    w:cw,  h:ch,    v: true,  i: 'Canvas'},
      {x:0,   y:ch+1, w:tw,  h:4,     v: vb,    i: 'BottomView'},
      {x:cw,  y:0,    w:sw,  h:ch+1,  v: vs,    i: 'SideView'}
    ];
  };

  render () {
    let properties = {
      cols: window.innerWidth,
      rowHeight: Dimensions.DNA_VIEWER_ROW_HEIGHT,
      width: window.innerWidth
    };

    return (<div>
              <SimulationData />
              <GridLayout properties={properties} layout={this.getLayout()}>
                <TopView      key='TopView' />
                <Canvas       key='Canvas' />
                <BottomView   key='BottomView' />
                <SideView     key='SideView' />
              </GridLayout>
            </div>);
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    canvasDimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DnaViewer);
