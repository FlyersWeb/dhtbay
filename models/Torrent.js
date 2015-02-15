var mongoose = require('mongoose');

var TorrentSchema = mongoose.Schema({
  hash: String,
  name: String,
  sources: [String],
  size: {type: String, default: null},
  files: {type: [String], default: null},
  added: {type: Date, default: Date.now}
});
var Torrent = mongoose.model('Torrent',TorrentSchema);

module.exports = Torrent;

