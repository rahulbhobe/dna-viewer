var _ = require('underscore');

var SettingsData = function() {
  var defaultColors = {
    'A': '#64dd17',
    'C': '#00b0ff',
    'G': '#1d2120',
    'T': '#e62739',
    'N': '#b0a18e'
  };

  var fonts = [
    'Andale Mono',
    'Courier',
    'Monaco',
    'Courier New',
  ];

  var getColorClass = function(type) {
    return 'dna-base-' + type.toLowerCase();
  };

  var fontClass         = 'dna-base-font';

  // initialize jss:
  _(defaultColors).each(function (hex, type) {
    var clsName = '.' + getColorClass(type);
    jss.set(clsName, {fill: hex})
  });

  jss.set('.' + fontClass, {"font-family": fonts[0]});


  return {
    getColorClassForType: function(type) {
      return getColorClass(type);
    },

    getColorForType: function(type) {
      var clsName = '.' + getColorClass(type);
      var color = jss.get(clsName);
      return color.fill;
    },

    setColorForType: function(type, hex) {
      var clsName = '.' + getColorClass(type);
      jss.set(clsName, {fill: hex})
    },

    getFontClass: function() {
      return fontClass;
    },

    getAllFonts: function() {
      return fonts;
    },

    getFont: function() {
      var clsName = '.' + fontClass;
      var font = jss.get(clsName);
      return font["font-family"];
    },

    setFont: function(font) {
      var clsName = '.' + fontClass;
      jss.set(clsName, {"font-family": font})
    },


  };
};

module.exports = new SettingsData();

