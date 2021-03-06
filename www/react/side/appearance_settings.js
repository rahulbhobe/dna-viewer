import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import jss from 'jss-browserify';

class AppearanceConfig extends React.Component {
  constructor (props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onBlur   = this.onBlur.bind(this);
  };

  render () {
    let cls = jss.get(this.props.jssCls);
    let val = parseInt(cls[this.props.jssKey]);
    return (<div>
              {this.props.name}
              <br/>
              <input type="text" ref="inp" defaultValue={val} onChange={this.onChange} onBlur={this.onBlur} size="4"/>
              <span style={{fontSize: "10px"}}>
                {"(" + this.props.min + "-" + this.props.max + ")"}
              </span>
            </div>);
  };

  onChange (evt) {
    let val = parseInt(evt.target.value);
    if (isNaN(val)) { return; }
    if (val<this.props.min) { return; }
    if (val>this.props.max) { return; }

    let obj = {};
    obj[this.props.jssKey] = JSON.stringify(val) + "px";
    jss.set(this.props.jssCls, obj);
  };

  onBlur () {
    let val = jss.get(this.props.jssCls);
    ReactDOM.findDOMNode(this.refs.inp).value = JSON.stringify(parseInt(val[this.props.jssKey]));
  };
};

class AppearanceSettings extends React.Component {
  render () {
    return (<div className={classNames('settings-appearance-div', 'dna-base-font')}>
              <AppearanceConfig  name="Size:" jssCls='.dna-base-size' jssKey='r' min={5} max={20} size="5"/>
              <AppearanceConfig  name="Backbone:" jssCls='.dna-base-backbone' jssKey='stroke-width' min={1} max={6} size="5"/>
              <AppearanceConfig  name="Base-pair:" jssCls='.dna-base-pair' jssKey='stroke-width' min={1} max={6} size="5"/>
            </div>);
  };
};

export default AppearanceSettings;
