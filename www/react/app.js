import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '../store/store';
import DnaViewer from './dna_viewer';
import SetupData from '../utils/setup_data';

document.addEventListener("DOMContentLoaded", (event) => {
  SetupData.initialize().then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <DnaViewer />
      </Provider>,
      document.getElementById('body-div')
    );
  });
});

export default DnaViewer;
