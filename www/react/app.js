import React from 'react';
import ReactDOM from 'react-dom';
import DebugUtils from '../src/debug';
import SequenceParser from '../src/sequence_parser';
import RequestUtils from '../utils/request_utils'
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

    return RequestUtils.getSavedDataForUrl(url).then((data) => {
      return data;
    }).catch((err) => {
      console.log(err);
      return defaultRet;
    });
  };

  getData().then(({seq, dbn, url}) => {
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

  return RequestUtils.getAllSavedData().then((data) => {
    store.dispatch(actionCreators.setSavedViews(data));
  }).catch((err) => {
    console.log(err);
  });
});

export default DnaViewer;
