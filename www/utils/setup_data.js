import DebugUtils from './debug_utils';
import SequenceData from '../src/sequence_data';
import RequestUtils from './request_utils';
import PubNubUtils from './pubnub_utils';
import Dimensions from './dimensions';
import store from '../store/store';
import * as actionCreators from '../store/action_creators';

class SetupData {
  static initialize () {
    return Promise.all([this.setupInitialData(), this.setupSavedViewsData(), this.setupNotificationsForDBUpdate()]).then(() => {
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
      return RequestUtils.getSavedDataForUrl(url);
    }).catch((err) => {
      console.log(err);
      return this.getDefaultData();
    }).then(({url, seq, dbn}) => {
      let sequenceData = new SequenceData(seq, dbn);
      let {width, height}  = Dimensions.calculateCanvasDimensions();
      store.dispatch(actionCreators.setSequenceData(sequenceData));
      store.dispatch(actionCreators.setTempSequence(seq, dbn));
      store.dispatch(actionCreators.setCurrentUrl(url));
      store.dispatch(actionCreators.setCurrentUrl(url));
      store.dispatch(actionCreators.setCanvasDimensions(width, height));
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

  static setupNotificationsForDBUpdate () {
    PubNubUtils.subscribe(() => {
      this.setupSavedViewsData();
    });
  };
};

export default SetupData;