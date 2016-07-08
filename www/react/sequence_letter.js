import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

class SequenceLetter extends React.Component {
  constructor (props) {
    super(props);
    this.onMouseOver    = this.onMouseOver.bind(this);
    this.onMouseLeave   = this.onMouseLeave.bind(this);
  };

  render () {
    var clsName = this.props.hover || this.props.dragging ? "higlight-sequence-text" : "";
    return (<span className={clsName} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              {this.props.letter}
            </span>);
  };

  onMouseOver () {
    this.props.onSelected(this.props.index);
  };

  onMouseLeave () {
    this.props.onSelected(-1);
  };
};

var mapStateToProps = function(state, ownProps) {
  return {
    hover: state.hover === ownProps.index,
    dragging: state.dragging === ownProps.index
  }
}

export default connect(mapStateToProps)(SequenceLetter);
