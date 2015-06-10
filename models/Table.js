var mongoose = require('mongoose');
var config = require('../config/database');
mongoose.connect(config.db.uri);

var TableSchema = mongoose.Schema({
  table: { type: [mongoose.Schema.Types.Mixed], default: null },
  updated : { type: Date, default: Date.now, index: true }
});
var Table = mongoose.model('Table',TableSchema);

module.exports = Table;
