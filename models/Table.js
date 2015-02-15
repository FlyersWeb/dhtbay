var mongoose = require('mongoose');

var TableSchema = mongoose.Schema({
  table: { type: [mongoose.Schema.Types.Mixed], default: null },
  updated : { type: Date, default: Date.now }
});
var Table = mongoose.model('Table',TableSchema);

module.exports = Table;
