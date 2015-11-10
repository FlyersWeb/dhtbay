var mongoose = require('mongoose');

var ClassifierSchema = mongoose.Schema({
  raw: { type: mongoose.Schema.Types.Mixed, default: {} },
  updated : { type: Date, default: Date.now, index: true }
});
var Classifier = mongoose.model('Classifier',ClassifierSchema);

module.exports = Classifier;
