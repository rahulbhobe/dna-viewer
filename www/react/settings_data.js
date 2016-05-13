var _ = require('underscore');

var SettingsInit = function() {
  var defaultColors = {
    'A': '#64dd17',
    'C': '#00b0ff',
    'G': '#1d2120',
    'T': '#e62739',
    'N': '#b0a18e'
  };

  // initialize jss:
  _(defaultColors).each(function (hex, type) {
    var clsName = '.dna-base-' + type.toLowerCase();
    jss.set(clsName, {fill: hex})
  });
  jss.set('.dna-base-font', {"font-family": 'Courier'});
};

module.exports = SettingsInit();

