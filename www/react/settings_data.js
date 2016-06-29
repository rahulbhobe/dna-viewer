import jss from 'jss-browserify';

var SettingsInit = function() {
  var defaultColors = [
    {type: 'A', hex: '#64dd17'},
    {type: 'C', hex: '#00b0ff'},
    {type: 'G', hex: '#1d2120'},
    {type: 'T', hex: '#e62739'},
    {type: 'N', hex: '#b0a18e'}
  ];

  // initialize jss:
  defaultColors.forEach(function ({type, hex}) {
    var clsName = '.dna-base-' + type.toLowerCase();
    jss.set(clsName, {fill: hex})
  });
  jss.set('.dna-base-font', {"font-family": 'Courier'});
  jss.set('.dna-base-size', {"r": "10px"});
  jss.set('.dna-base-backbone', {"stroke-width": "1px"});
  jss.set('.dna-base-pair', {"stroke-width": "4px"});
};

export default SettingsInit();
