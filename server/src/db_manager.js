import mongoose from 'mongoose';

let DbManager = () => {
  let connected = false;

  let getMongoURI = (includeCredentials) => {
    return 'mongodb://' + (includeCredentials ? 'dna_user:dna_password@' : '')
                   + 'ds011755.mlab.com:11755/dna_viewer';
  };

  mongoose.connection.on('connected', () => {
    connected = true;
    console.log('Connected to: ', getMongoURI(false));
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to: ', getMongoURI(false));
    connected = true;
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from: ', getMongoURI(false));
    connected = false;
  });

  mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
    connected = false;
  });

  return {
    init: () => {
      mongoose.connect(getMongoURI(true));
      mongoose.Promise = Promise;
    },

    isConnected: () => {
      return connected;
    }
  };
};

export default DbManager();
