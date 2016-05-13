var _ = require('underscore');

var SettingsData = function() {
  var defaultColors = {
    'A': '#64dd17',
    'C': '#00b0ff',
    'G': '#1d2120',
    'T': '#e62739',
    'N': '#b0a18e'
  };

  var getStylesClass = function(type) {
    return 'dna-base-' + type.toLowerCase();
  };

  var setColorForType = function(type, hex) {
    var clsName = '.' + getStylesClass(type);
    jss.set(clsName, {fill: hex})
  };

  // initialize jss:
  _(defaultColors).each(function (hex, type) {
    setColorForType(type, hex);
  });

  return {
    getStylesClassForType: function(type) {
      return getStylesClass(type);
    },

    getColorForType: function(type) {
      var clsName = '.' + getStylesClass(type);
      var color = jss.get(clsName);
      return color.fill;
    },

    setColorForType: function(type, hex) {
      setColorForType(type, hex);
    }
  };
};

module.exports = new SettingsData();

