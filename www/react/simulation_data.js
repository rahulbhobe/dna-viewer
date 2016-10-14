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
  };

  render () {
    this.generateSimulation();
    return null;
  };

  setCurrentData () {
    this.props.actions.setSimulatedData({...this.data});
  };

  resetData () {
    this.data = {simulation: null, anchored: [], animated: []};
    this.props.actions.resetSimulatedData();
  };

  componentWillMount () {
    let simulation = d3.forceSimulation();
    this.data       = {simulation, anchored: [], animated: []};
    this.setCurrentData();
  };

  componentWillUnmount () {
    this.simulation.stop();
    this.props.actions.resetSimulatedData();
  };

  generateSimulation () {
    var sequenceParser = this.props.sequenceParser;
    if (sequenceParser.hasErrors()) {
      return null;
    }

    var coordinates = this.getCoordinatesForScreen();
    var connections = sequenceParser.getConnections();

    this.data.anchored = coordinates.map((point, ii) => {
      let id     = 'anchor_' + ii;
      let {x, y} = point.asObj();
      return {id, fx: x, fy: y};
    });

    this.data.animated = coordinates.map((point, ii) => {
      let id     = 'animated_' + ii;
      return {id};
    });

    let linkAnchoredAnimated = coordinates.map((base, ii) => {
      return {source: 'anchor_' + ii, target: 'animated_' + ii};
    });

    let linkBackbone = coordinates.map((base, ii) => {
      return {source: 'animated_' + ii, target: 'animated_' + (ii+1)};
    });
    linkBackbone.pop();

    let linkPair = connections.map(connection => {
      return {source: 'animated_' + connection.source, target: 'animated_' + connection.target};
    });

    let simulation = this.data.simulation;
    let nodes = this.data.anchored.concat(this.data.animated);
    let links = linkAnchoredAnimated.concat(linkBackbone, linkPair);

    simulation.nodes(nodes).on('tick', this.onSimulationTicked);

    let distance    = coordinates[0].subtract(coordinates[1]).length();
    simulation.force('anchored_animated', d3.forceLink().id(n => n.id).distance(0).strength(2));
    simulation.force('dna_backbone', d3.forceLink().id(n => n.id).distance(distance).strength(2));
    simulation.force('dna_pair', d3.forceLink().id(n => n.id).distance(distance).strength(2));

    simulation.force('anchored_animated').links(linkAnchoredAnimated);
    simulation.force('dna_backbone').links(linkBackbone);
    simulation.force('dna_pair').links(linkPair);

    //  simulation.velocityDecay(0.7);

    simulation.restart();
  };

  onSimulationTicked () {
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
