import React from 'react';
import ReactDOM from 'react-dom';
import DebugUtils from '../src/debug';
import SequenceParser from '../src/sequence_parser';
import request from 'request';
import promisify from 'es6-promisify';
import {Provider} from 'react-redux';
import store from '../store/store';
import DnaViewer from './dna_viewer'

document.addEventListener("DOMContentLoaded", function(event) {
  var getData = function() {
    var defaultRet = new Promise(function(resolve) {
      resolve(DebugUtils.debug_examples[0]);
    });

    var url = window.location.pathname.substring(1);
    if (!url) {
      return defaultRet;
    }

    var data = {url};
    return promisify(request.post)(window.location.origin + '/data', {form: data})
    .then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    }).catch((err) => {
      console.log(err);
      return defaultRet;
    });
  };

  getData()
  .then(function(obj) {
    var sequenceParser = new SequenceParser(obj.seq, obj.dbn);
    ReactDOM.render(
      <Provider store={store}>
        <DnaViewer sequenceParser={sequenceParser} seq={obj.seq} dbn={obj.dbn}/>
      </Provider>,
      document.getElementById('body-div')
    );
  });
});

export default DnaViewer;