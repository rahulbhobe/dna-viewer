import React from 'react';
import * as d3 from 'd3';
import {Vector, MatrixTransformations} from '../mathutils/gl_matrix_wrapper';
import AngleConverter from '../mathutils/angle_converter';
import store from '../store/store';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../store/action_dispatcher';

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
    this.props.actions.setSimulatedData({...this.data});
  };

  initData () {
    let simulation = d3.forceSimulation();
    this.data      = {simulation, anchored: [], animated: []};
    this.setCurrentData();
  };

  resetData () {
    if (this.data && this.data.simulation) this.data.simulation.stop();
    this.data = {simulation: null, anchored: [], animated: []};
    this.props.actions.resetSimulatedData();
  };

  componentWillMount () {
    this.generateSimulation();
  };

  componentWillUnmount () {
    this.resetData();
  };

  componentDidUpdate () {
    this.generateSimulation();
  };

  generateSimulation () {
    this.resetData();
    this.initData();

    let sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    let coordinates = this.getCoordinatesForScreen();
    let connections = sequenceParser.getConnections();
    let numBases    = sequenceParser.getBases().length;

    this.data.anchored = coordinates.map((point, ii) => {
      let id     = 'anchor_' + ii;
      let {x, y} = point.asObj();
      return {id, fx: x, fy: y};
    });

    this.data.animated = Array.from(Array(numBases).keys()).map((idx) => Object.assign({id :'animated_'+idx}));

    let linkAnchoredAnimated = Array.from(Array(numBases).keys()).map((idx) => Object.assign({source: 'anchor_'+idx, target: 'animated_'+idx}));

    let linkBackbone = Array.from(Array(numBases-1).keys()).map((idx) => Object.assign({source: 'animated_'+idx, target: 'animated_'+(idx+1)}));

    let linkPair = connections.map(connection => Object.assign({source: 'animated_'+connection.source, target: 'animated_'+connection.target}));

    let simulation = this.data.simulation;
    let nodes = this.data.anchored.concat(this.data.animated);
    let links = linkAnchoredAnimated.concat(linkBackbone, linkPair);

    simulation.alphaDecay(0.14);
    simulation.nodes(nodes).on('tick', this.onSimulationTicked);

    let distance    = coordinates[0].subtract(coordinates[1]).length();
    simulation.force('anchored_animated', d3.forceLink().id(n => n.id).distance(0).strength(2));
    simulation.force('dna_backbone', d3.forceLink().id(n => n.id).distance(distance).strength(2));
    simulation.force('dna_pair', d3.forceLink().id(n => n.id).distance(distance).strength(2));

    simulation.force('anchored_animated').links(linkAnchoredAnimated);
    simulation.force('dna_backbone').links(linkBackbone);
    simulation.force('dna_pair').links(linkPair);

    simulation.on('end', this.onSimulationEnded);

    //  simulation.velocityDecay(0.7);

    simulation.restart();
  };

  onSimulationTicked () {
    this.setCurrentData();
  };

  onSimulationEnded () {
    let coordinates = this.getCoordinatesForScreen();
    this.data.animated = coordinates.map((point, ii) => {
      let id     = 'animated_' + ii;
      let {x, y} = point.asObj();
      return {id, x, y};
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
    let sequenceParser = this.props.sequenceParser;
    let width          = this.props.dimensions.width;
    let height         = this.props.dimensions.height;
    return sequenceParser.getCoordinates(width, height, this.getModelTransformations());
  };
};

var mapStateToProps = (state, ownProps) => {
  return {
    sequenceParser: state.sequenceParser,
    zoomFactor: state.zoomFactor,
    rotationAngle: state.rotationAngle,
    origin: state.origin,
    dimensions: state.canvasDimensions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SimulationData);
