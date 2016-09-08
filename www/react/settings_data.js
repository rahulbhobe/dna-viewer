import jss from 'jss-browserify';

var SettingsInit = function() {
  var defaultColors = [
    {type: 'A', hex: '#63f33c'},
    {type: 'C', hex: '#3474cc'},
    {type: 'G', hex: '#fbb344'},
    {type: 'T', hex: '#f0322d'},
    {type: 'N', hex: '#b0a18e'}
  ];

  // initialize jss:
  defaultColors.forEach(function ({type, hex}) {
    var clsName = '.dna-base-' + type.toLowerCase();
    jss.set(clsName, {fill: hex})
  });
  jss.set('.dna-base-font', {'font-family': 'Courier'});
  jss.set('.dna-base-size', {'r': '10px'});
  jss.set('.dna-base-backbone', {'stroke-width': '1px'});
  jss.set('.dna-base-pair', {'stroke-width': '4px'});
  jss.set('.dna-base-selected', {'fill': '#ffffff'});
};

export default SettingsInit();
