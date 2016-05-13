var ColorPallete =  React.createClass({
  render: function () {
    return (<div className="settings-view" >
            </div>);
  },
});

var update = function() {
  alert('here i am');
}

var SettingsView = React.createClass({
  render: function () {
    return (<div className="settings-view" >
              <ColorPallete />
            </div>);
  }
});
