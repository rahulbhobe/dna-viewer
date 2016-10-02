import React from 'react';
import ReactDOM from 'react-dom';
import DebugUtils from '../src/debug';
import SequenceParser from '../src/sequence_parser';
import request from 'request';
import promisify from 'es6-promisify';
import {Provider} from 'react-redux';
import store from '../store/store';
import * as actionCreators from '../store/action_creators';
import DnaViewer from './dna_viewer'

document.addEventListener("DOMContentLoaded", (event) => {
  var getData = () => {
    var defaultRet = new Promise((resolve) => {
      var {seq, dbn} = DebugUtils.debug_examples[0];
      resolve({url: "", seq, dbn});
    });

    var url = window.location.pathname.substring(1);
    if (!url) {
      return defaultRet;
    }

    let data = {type: 'one', url};
    return promisify(request.post)(window.location.origin + '/data', {form: data})
    .then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    }).catch((err) => {
      console.log(err);
      return defaultRet;
    });
  };

  getData()
  .then(({seq, dbn, url}) => {
    var sequenceParser = new SequenceParser(seq, dbn);
    store.dispatch(actionCreators.setSequenceParser(sequenceParser));
    store.dispatch(actionCreators.setTempSequence(seq, dbn));
    store.dispatch(actionCreators.setCurrentUrl(url));
    window.history.pushState("", "Title", "/" + url);

    ReactDOM.render(
      <Provider store={store}>
        <DnaViewer />
      </Provider>,
      document.getElementById('body-div')
    );
  });

  let data = {type: 'all'};
  promisify(request.post)(window.location.origin + '/data', {form: data}).then((httpResponse) => {
    let savedViews = JSON.parse(httpResponse.body);
    store.dispatch(actionCreators.setSavedViews(savedViews));
  }).catch((err) => {
    console.log(err);
  });
});

export default DnaViewer;
