var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectionData = {
  mongoURI: 'mongodb://localhost/myappdatabase',
  connected: false
};

var dataSchema = new Schema({
  url:  String,
  date: { type: Date, default: Date.now },
  seq: String,
  dbn: String
});

dataSchema.pre('save', function(next) {
  if (!connectionData.connected) {
    next('Not connected to db');
    return;
  }
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

dataSchema.pre('findOne', function(next) {
  if (!connectionData.connected) {
    next('Not connected to db');
    return;
  }
  next();
});


mongoose.connection.on('connected', function () {
  connectionData.connected = true;
});

mongoose.connection.on('disconnected', function () {
  connectionData.connected = false;
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
  connectionData.connected = false;
});

mongoose.connect(connectionData.mongoURI);
var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
