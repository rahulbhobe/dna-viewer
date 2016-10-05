import PubNub from 'pubnub';

class PubNubUtils {
  static PUBLISH_KEY   = 'pub-c-e2f7ec9b-2881-4b1f-9ed0-6ed3ce71c067';
  static SUBSCRIBE_KEY = 'sub-c-36c36740-89f6-11e6-8409-0619f8945a4f';
  static CHANNEL_NAME  = 'dna_viewer_db_updated';
  static pubnub        = null;
  static notifyFuncs   = [];

  static init () {
    this.pubnub = new PubNub({
      publishKey: this.PUBLISH_KEY,
      subscribeKey: this.SUBSCRIBE_KEY,
      ssl: ((document.location.protocol==='https:') ? true : false)
    });

    this.pubnub.addListener({
      message: (m) => {
        this.notifyFuncs.forEach((func) => {
          func(m)
        });
      },
    });

    this.pubnub.subscribe({
      channels: [this.CHANNEL_NAME]
    });
  };

  static subscribe (func) {
    if (!this.pubnub) {
      this.init();
    }
    this.notifyFuncs.push(func);
  };
};

export default PubNubUtils;