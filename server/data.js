import mongoose, {Schema} from 'mongoose';
import DbManager from './db_manager';

var dataSchema = new Schema({
  url:  String,
  date: { type: Date, default: Date.now },
  seq: String,
  dbn: String
});

dataSchema.pre('save', function(next) {
  if (!DbManager.isConnected()) {
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
  if (!DbManager.isConnected()) {
    next('Not connected to db');
    return;
  }
  next();
});

var Data = mongoose.model('Data', dataSchema);

export default Data;
