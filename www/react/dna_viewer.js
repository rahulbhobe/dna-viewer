import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import ReactGridLayout from 'react-grid-layout';
import Canvas from './canvas';
import SettingsView from './settings_view';
import SequenceView from './sequence_view';
import ShareLink from './share_link';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

class DnaViewer extends React.Component {
  constructor (props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.setCanvasDimensions();
  };

  getRowHeight() {
    return 32;
  };

  calculateCanvasDimensions() {
    return {
      width:  window.innerWidth - 235,
      height: window.innerHeight - (this.getRowHeight() * (1+4))
    };
  };

  setCanvasDimensions() {
    var {width, height}  = this.calculateCanvasDimensions();
    this.props.actions.setCanvasDimensions(width, height);
  };

  getLayout() {
    var {width, height}  = this.calculateCanvasDimensions();
    var ch = height/this.getRowHeight();
    var cw = width;
    var tw = window.innerWidth;
    var sw = tw - cw;

    return [
      {x:0,   y:0,    w:cw,  h:1,     i: 'ShareLink'},
      {x:0,   y:1,    w:cw,  h:ch,    i: 'Canvas'},
      {x:0,   y:ch+1, w:tw,  h:4,     i: 'SequenceView'},
      {x:cw,  y:0,    w:sw,  h:ch+1,  i: 'SettingsView'}
    ];
  };

  render () {
    var properties = {
      className: "layout",
      isDraggable: false,
      isResizable: false,
      cols: window.innerWidth,
      rowHeight: this.getRowHeight(),
      width: window.innerWidth,
      margin: [0, 0],
      verticalCompact: false
    };
    return (<ReactGridLayout layout={this.getLayout()}{...properties}>
              <div key='ShareLink'>    <ShareLink/>    </div>
              <div key='Canvas'>       <Canvas />      </div>
              <div key='SequenceView'> <SequenceView/> </div>
              <div key='SettingsView'> <SettingsView/> </div>
            </ReactGridLayout>);
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
