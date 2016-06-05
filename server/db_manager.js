import mongoose from 'mongoose';

var DbManager = function() {
  var mongoURI = 'mongodb://localhost/myappdatabase';
  var connected = false;

  mongoose.connection.on('connected', function () {
    connected = true;
  });

  mongoose.connection.on('reconnected', function () {
    connected = true;
  });

  mongoose.connection.on('disconnected', function () {
    connected = false;
  });

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
    connected = false;
  });

  return {
    init: function () {
      mongoose.connect(mongoURI);
    },

    isConnected: function() {
      return connected;
    }
  };
};

export default DbManager();
