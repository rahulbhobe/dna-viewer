var Canvas = React.createClass({

  render: function () {
    return (
      <svg width='1500' height='900'>
        <circle cx={100} cy={100} r={100} fill="red" />
      </svg>);
  }
});

$(document).ready(function () {
  ReactDOM.render(
    <Canvas />,
    document.getElementById('canvas-div')
  );
});
