var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
  url:  String,
  date: { type: Date, default: Date.now },
  seq: String,
  dbn: String
});

dataSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

mongoose.connect('mongodb://localhost/myappdatabase');
var Data = mongoose.model('Data', dataSchema);

module.exports = Data;