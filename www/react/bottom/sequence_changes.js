import React from 'react';
import classNames from 'classnames';

class SequenceChanges extends React.Component {
    render () {
      var clsNames = classNames('sequence-change-button', 'sequence-form-div');
      return (<div>
                <input type="image" className={clsNames} onClick={this.props.onClick} src={'/res/' + this.props.buttonText.toLowerCase() + '-button.png'}/>
              </div>);
  };
};

export default SequenceChanges;