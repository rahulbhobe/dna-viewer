import jss from 'jss-browserify';

let SettingsInit = () => {
  let defaultColors = [
    {type: 'A', hex: '#63f33c'},
    {type: 'C', hex: '#3474cc'},
    {type: 'G', hex: '#fbb344'},
    {type: 'T', hex: '#f0322d'},
    {type: 'N', hex: '#b0a18e'}
  ];

  // initialize jss:
  defaultColors.forEach(({type, hex}) => {
    let clsName = '.dna-base-' + type.toLowerCase();
    jss.set(clsName, {fill: hex})
  });
  jss.set('.dna-base-font', {'font-family': 'Courier'});
  jss.set('.dna-base-size', {'r': '10px'});
  jss.set('.dna-base-backbone', {'stroke-width': '3px'});
  jss.set('.dna-base-pair', {'stroke-width': '4px'});
  jss.set('.dna-base-highlighted', {'fill': '#ffffff'});
};

export default SettingsInit();
