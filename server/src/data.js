import mongoose, {Schema} from 'mongoose';
import DbManager from './db_manager';

var dataSchema = new Schema({
  url:  String,
  date: { type: Date, default: Date.now },
  seq: String,
  dbn: String
});

dataSchema.pre('save', (next) => {
  if (!DbManager.isConnected()) {
    next('Not connected to db');
    return;
  }
  next();
});

dataSchema.pre('findOne', (next) => {
  if (!DbManager.isConnected()) {
    next('Not connected to db');
    return;
  }
  next();
});

var Data = mongoose.model('Data', dataSchema);

export default Data;
