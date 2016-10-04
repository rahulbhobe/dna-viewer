import PubNub from 'pubnub';

class PubNubServerUtils {
  static PUBLISH_KEY   = 'pub-c-e2f7ec9b-2881-4b1f-9ed0-6ed3ce71c067';
  static SUBSCRIBE_KEY = 'sub-c-36c36740-89f6-11e6-8409-0619f8945a4f';
  static CHANNEL_NAME  = 'dna_viewer_db_updated';

  static publish (msg) {
    var pubnub = new PubNub({
      publish_key: this.PUBLISH_KEY,
      subscribe_key: this.SUBSCRIBE_KEY,
      error: (error) => {
        console.log('Error:', error);
      }
    });

    pubnub.publish({
      channel: this.CHANNEL_NAME,
      message: msg,
      callback: (m) => {
      }
    });
  };
};

export default PubNubServerUtils;