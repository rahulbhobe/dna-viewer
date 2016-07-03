import mongoose from 'mongoose';

var DbManager = function() {
  var connected = false;

  var getMongoURI = function (includeCredentials) {
    return 'mongodb://' + (includeCredentials ? 'dna_user:dna_password@' : '')
                   + 'ds011755.mlab.com:11755/dna_viewer';
  };

  mongoose.connection.on('connected', function (aa, bb) {
    connected = true;
    console.log('Connected to: ', getMongoURI(false));
  });

  mongoose.connection.on('reconnected', function () {
    console.log('Reconnected to: ', getMongoURI(false));
    connected = true;
  });

  mongoose.connection.on('disconnected', function () {
    console.log('Disconnected from: ', getMongoURI(false));
    connected = false;
  });

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
    connected = false;
  });

  return {
    init: function () {
      mongoose.connect(getMongoURI(true));
      mongoose.Promise = Promise;
    },

    isConnected: function() {
      return connected;
    }
  };
};

export default DbManager();
