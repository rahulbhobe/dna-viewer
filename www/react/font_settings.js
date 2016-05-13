var React = require('react');
var _ = require('underscore');

var FontSettings =  React.createClass({

  render: function () {
    var fonts = [ 'Andale Mono', 'Courier', 'Monaco', 'Courier New'];

    return (<div className="settings-font-div dna-base-font">
              Font:
              <select onChange={this.onChange} selected={this.getSelected()}>
              {_(fonts).map(function (font, ii) {
                return (<option value={font} style={{fontFamily: font}} key={"fonts_" + ii}>{font}</option>);
              })}
              </select>
            </div>);
  },

  getSelected: function() {
    var font = jss.get(".dna-base-font");
    return font["font-family"];
  },

  onChange: function(event) {
    jss.set(".dna-base-font", {"font-family": event.target.value})
  }
});


module.exports = FontSettings;
