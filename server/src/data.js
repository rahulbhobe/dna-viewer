import mongoose, {Schema} from 'mongoose';
import DbManager from './db_manager';

let dataSchema = new Schema({
  url:  String,
  seq: String,
  dbn: String
},
{
  timestamps: true
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

let Data = mongoose.model('Data', dataSchema);

export default Data;
