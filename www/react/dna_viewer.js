import React from 'react';
import GridLayout from './grid_layout';
import SimulationData from './simulation_data';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import Dimensions from '../utils/dimensions';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.setCanvasDimensions();
  };

  setCanvasDimensions () {
    var {width, height}  = Dimensions.calculateCanvasDimensions();
    this.props.actions.setCanvasDimensions(width, height);
  };

  getLayout () {
    var {width, height}  = Dimensions.calculateCanvasDimensions();
    var ch = height/Dimensions.DNA_VIEWER_ROW_HEIGHT;
    var cw = width;
    var tw = window.innerWidth;
    var sw = tw - cw;

    return [
      {x:0,   y:0,    w:cw,  h:1,     v: true,                         i: 'ShareLink'},
      {x:0,   y:1,    w:cw,  h:ch,    v: true,                         i: 'Canvas'},
      {x:0,   y:ch+1, w:tw,  h:4,     v: !Dimensions.isHeightSmall(),  i: 'SequenceView'},
      {x:cw,  y:0,    w:sw,  h:ch+1,  v: !Dimensions.isWidthSmall(),   i: 'SettingsView'}
    ];
  };

  render () {
    var properties = {
      cols: window.innerWidth,
      rowHeight: Dimensions.DNA_VIEWER_ROW_HEIGHT,
      width: window.innerWidth
    };

    return (<div>
              <SimulationData />
              <GridLayout properties={properties} layout={this.getLayout()}>
                <ShareLink    key='ShareLink' />
                <Canvas       key='Canvas' />
                <SequenceView key='SequenceView' />
                <SettingsView key='SettingsView' />
              </GridLayout>
            </div>);
  };

  handleResize (e) {
    this.setCanvasDimensions();
  };

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    canvasDimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DnaViewer);
