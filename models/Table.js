var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dhtcrawler');

var TableSchema = mongoose.Schema({
  table: { type: [mongoose.Schema.Types.Mixed], default: null },
  updated : { type: Date, default: Date.now, index: true }
});
var Table = mongoose.model('Table',TableSchema);

module.exports = Table;
