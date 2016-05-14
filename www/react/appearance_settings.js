var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

var AppearanceConfig = React.createClass({
  getInitialState: function() {
    var val = jss.get(this.props.jssCls);
    return {
      value: parseInt(val[this.props.jssKey])
    };
  },

  render: function () {
    return (<div>
              {this.props.name}
              <br/>
              <input type="text" ref="inp" defaultValue={this.state.value} onChange={this.onChange} onBlur={this.onBlur} size="4"/>
              <span style={{fontSize: "10px"}}>
                {"(" + this.props.min + "-" + this.props.max + ")"}
              </span>
            </div>);
  },

  onChange: function (evt) {
    val = parseInt(evt.target.value);
    if (isNaN(val)) {
      return;
    }
    if (val<this.props.min) {
      return;
    }
    if (val>this.props.max) {
      return;
    }    

    var obj = {};
    obj[this.props.jssKey] = JSON.stringify(val) + "px";
    jss.set(this.props.jssCls, obj);
  },

  onBlur: function () {
    var val = jss.get(this.props.jssCls);
    ReactDOM.findDOMNode(this.refs.inp).value = JSON.stringify(parseInt(val[this.props.jssKey]));
  }

});

var AppearanceSettings =  React.createClass({
  render: function () {
    return (<div className="settings-appearance-div dna-base-font">
              <AppearanceConfig  name="Size:" jssCls='.dna-base-size' jssKey='r' min={5} max={20} size="5"/>
              <AppearanceConfig  name="Backbone:" jssCls='.dna-base-backbone' jssKey='stroke-width' min={1} max={6} size="5"/>
              <AppearanceConfig  name="Base-pair:" jssCls='.dna-base-pair' jssKey='stroke-width' min={1} max={6} size="5"/>
            </div>);
  },

});


module.exports = AppearanceSettings;