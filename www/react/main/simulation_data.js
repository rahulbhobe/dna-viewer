import React from 'react';
import * as d3 from 'd3';
import {Vector, MatrixTransformations} from '../../mathutils/gl_matrix_wrapper';
import ArrayUtils from '../../utils/array_utils';
import AngleConverter from '../../mathutils/angle_converter';
import store from '../../store/store';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class SimulationData extends React.Component {
  constructor (props) {
    super(props);

    this.onSimulationTicked = this.onSimulationTicked.bind(this);
    this.onSimulationEnded  = this.onSimulationEnded.bind(this);
  };

  render () {
    return null;
  };

  setCurrentData () {
    this.props.actions.setSimulationData({...this.data});
  };

  initData () {
    let simulation = d3.forceSimulation();
    simulation.on('tick', this.onSimulationTicked);
    simulation.on('end', this.onSimulationEnded);
    this.data      = {simulation, anchored: [], animated: [], centers: []};
    this.setCurrentData();
  };

  resetData () {
    this.data.simulation.stop();
    this.data = {simulation: null, anchored: [], animated: [], centers: []};
    this.props.actions.resetSimulationData();
  };

  componentWillMount () {
    this.initData();
    this.generateSimulation();
  };

  componentWillUnmount () {
    this.resetData();
  };

  componentDidUpdate () {
    this.generateSimulation();
  };

  generateSimulation () {
    let simulation = this.data.simulation;
    simulation.stop();

    let sequenceData = this.props.sequenceData;
    if (sequenceData.hasErrors()) {
      return null;
    }

    let coordinates = this.getCoordinatesForScreen();
    let points      = coordinates.points;
    let centers     = coordinates.centers;
    let connections = sequenceData.getConnections();
    let numBases    = sequenceData.getBases().length;
    let numOld      = this.data.animated.length;

    this.data.anchored = points.map((point, ii) => {
      let id     = 'anchored_' + ii;
      let {x, y} = point.asObj();
      return {id, fx: x, fy: y};
    });

    if (numOld >= numBases) {
      this.data.animated.length = numBases;
    } else {
      this.data.animated  = this.data.animated.concat(ArrayUtils.range(numBases-numOld)
                                                                .map(idx => idx+numOld)
                                                                .map((idx) => Object.assign({id :'animated_'+idx})));
    }

    this.data.centers = centers.map((center) => center.asObj());

    simulation.nodes(this.data.anchored.concat(this.data.animated));

    let linkAnchoredAnimated = ArrayUtils.range(numBases).map((idx) => Object.assign({source: 'anchored_'+idx, target: 'animated_'+idx}));
    let linkBackbone = ArrayUtils.range(numBases-1).map((idx) => Object.assign({source: 'animated_'+idx, target: 'animated_'+(idx+1)}));
    let linkPair = connections.map(connection => Object.assign({source: 'animated_'+connection.source, target: 'animated_'+connection.target}));

    simulation.alphaDecay(0.14);
    let distance = points[0].distanceFrom(points[1]);
    simulation.force('anchored_animated', d3.forceLink(linkAnchoredAnimated).id(n => n.id).distance(0).strength(2));
    simulation.force('dna_backbone', d3.forceLink(linkBackbone).id(n => n.id).distance(distance).strength(2));
    simulation.force('dna_pair', d3.forceLink(linkPair).id(n => n.id).distance(distance).strength(2));

    if (store.getState().eventData.type === 'none') {
      simulation.alphaTarget(0.99);
      setTimeout(() => simulation.alphaTarget(0), 800);
    } else {
      simulation.alphaDecay(0.99);
    }
    simulation.restart();
  };

  onSimulationTicked () {
    this.setCurrentData();
  };

  onSimulationEnded () {
    this.data.animated.forEach((node, ii) => {
      let {x, y} = this.data.anchored[ii];
      node.x = x;
      node.y = y;
    });
    this.setCurrentData();
  };

  getModelTransformations () {
    var matrixTransforms = MatrixTransformations.create();

    var negOrg = Vector.create(this.props.origin.x, this.props.origin.y).negate();
    matrixTransforms.append(m => m.translate(negOrg));
    matrixTransforms.append(m => m.scale(this.props.zoomFactor*0.01));
    matrixTransforms.append(m => m.rotate(AngleConverter.toRad(-1 * this.props.rotationAngle)));

    return matrixTransforms;
  };

  getCoordinatesForScreen () {
    let sequenceData   = this.props.sequenceData;
    let width          = this.props.dimensions.width;
    let height         = this.props.dimensions.height;
    return sequenceData.getCoordinates(width, height, this.getModelTransformations());
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceData: state.sequenceData,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    dimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SimulationData);
