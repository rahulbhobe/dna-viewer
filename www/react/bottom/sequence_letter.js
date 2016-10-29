import React from 'react';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../store/action_dispatcher';

class SequenceLetter extends React.Component {
  constructor (props) {
    super(props);
    this.onMouseOver    = this.onMouseOver.bind(this);
    this.onMouseLeave   = this.onMouseLeave.bind(this);
  };

  render () {
    let clsName = this.props.hover || this.props.dragging ? "higlight-sequence-text" : "";
    return (<span className={clsName} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              {this.props.letter}
            </span>);
  };

  onMouseOver () {
    this.props.actions.setHoverNode(this.props.index);
  };

  onMouseLeave () {
    this.props.actions.resetHoverNode();
  };
};

let mapStateToProps = (state, ownProps) => {
  return {
    hover: state.hover === ownProps.index,
    dragging: state.dragging === ownProps.index
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SequenceLetter);
