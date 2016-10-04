import PubNub from 'pubnub';

class PubNubServerUtils {
  static PUBLISH_KEY   = 'pub-c-e2f7ec9b-2881-4b1f-9ed0-6ed3ce71c067';
  static SUBSCRIBE_KEY = 'sub-c-36c36740-89f6-11e6-8409-0619f8945a4f';
  static CHANNEL_NAME  = 'dna_viewer_db_updated';
  static pubnub        = null;

  static init () {
    this.pubnub = new PubNub({
      publishKey: this.PUBLISH_KEY,
      subscribeKey: this.SUBSCRIBE_KEY
    });
  };

  static publish (msg) {
    let publishConfig = {
      channel : this.CHANNEL_NAME,
      message : msg
    };

    this.pubnub.publish(publishConfig, (status, response) => {});
  };
};

export default PubNubServerUtils;