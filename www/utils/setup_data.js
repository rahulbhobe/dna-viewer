import ExampleData from './example_data';
import SequenceData from '../core/sequence_data';
import RequestUtils from './request_utils';
import PubNubUtils from './pubnub_utils';
import Dimensions from './dimensions';
import store from '../store/store';
import ReduxUtils from './redux_utils';
import * as ActionCreators from '../store/action_creators';

class SetupData {
  static initialize () {
    return Promise.all([this.setupInitialData(), this.setupSavedViewsData(), this.setupNotificationsForDBUpdate(), this.observe()]).then(() => {
      return null;
    });
  };

  static getDefaultData () {
    let {seq, dbn} = ExampleData.examples[0];
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
      store.dispatch(ActionCreators.setSequenceData(sequenceData));
      store.dispatch(ActionCreators.setTempSequence(seq, dbn));
      store.dispatch(ActionCreators.setCurrentUrl(url));
      store.dispatch(ActionCreators.setCanvasDimensions(width, height));
      window.history.pushState("", "Title", "/" + url);
    });
  };

  static setupSavedViewsData () {
    return RequestUtils.getAllSavedData().then((data) => {
      store.dispatch(ActionCreators.setSavedViews(data));
    }).catch(err => {
      console.log(err);
    });
  };

  static setupNotificationsForDBUpdate () {
    PubNubUtils.subscribe(() => {
      this.setupSavedViewsData();
    });
  };

  static observe () {
    ReduxUtils.observeChanges(store);
  };
};

export default SetupData;
