import React from 'react';
import classNames from 'classnames';
import jss from 'jss-browserify';

class FontSettings extends React.Component {
  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  };

  render () {
    var fonts = [ 'Andale Mono', 'Courier', 'Monaco', 'Courier New', 'Menlo', 'monospace'];

    return (<div className={classNames('settings-font-div', 'dna-base-font')}>
              Font:
              <br/>
              <select onChange={this.onChange} selected={this.getSelected()}>
              {fonts.map((font, ii) => {
                return (<option value={font} style={{fontFamily: font}} key={"fonts_" + ii}>{font}</option>);
              })}
              </select>
            </div>);
  };

  getSelected () {
    var font = jss.get(".dna-base-font");
    return font["font-family"];
  };

  onChange (event) {
    jss.set(".dna-base-font", {"font-family": event.target.value})
  }
};

export default FontSettings;
