import React from 'react';

class FontSettings extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  };

  render () {
    var fonts = [ 'Andale Mono', 'Courier', 'Monaco', 'Courier New'];

    return (<div className="settings-font-div dna-base-font">
              Font:
              <br/>
              <select onChange={this.onChange} selected={this.getSelected()}>
              {fonts.map(function (font, ii) {
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
