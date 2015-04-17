var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/dhtcrawler');

var TableSchema = mongoose.Schema({
  table: { type: [mongoose.Schema.Types.Mixed], default: null },
  updated : { type: Date, default: Date.now, index: true }
});
var Table = mongoose.model('Table',TableSchema);

module.exports = Table;
