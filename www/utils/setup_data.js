import DebugUtils from '../src/debug';
import SequenceParser from '../src/sequence_parser';
import RequestUtils from './request_utils';
import store from '../store/store';
import * as actionCreators from '../store/action_creators';

class SetupData {
  static initialize () {
    return Promise.all([this.setupInitialData(), this.setupSavedViewsData()]).then(() => {
      return null;
    });
  };

  static getDefaultData () {
    var {seq, dbn} = DebugUtils.debug_examples[0];
    return {url: "", seq, dbn};
  };

  static setupInitialData () {
    let url = window.location.pathname.substring(1);
    return Promise.resolve(url).then((url) => {
      if (!url) {
        return this.getDefaultData();
      }
      return RequestUtils.getSavedDataForUrl(url).then((data) => {
        return data;
      });
    }).catch((err) => {
      console.log(err);
      return this.getDefaultData();
    }).then(({url, seq, dbn}) => {
      let sequenceParser = new SequenceParser(seq, dbn);
      store.dispatch(actionCreators.setSequenceParser(sequenceParser));
      store.dispatch(actionCreators.setTempSequence(seq, dbn));
      store.dispatch(actionCreators.setCurrentUrl(url));
      window.history.pushState("", "Title", "/" + url);
    });
  };

  static setupSavedViewsData () {
    return RequestUtils.getAllSavedData().then((data) => {
      store.dispatch(actionCreators.setSavedViews(data));
    }).catch((err) => {
      console.log(err);
    });
  };
};

export default SetupData;