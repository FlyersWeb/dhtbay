var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dhtcrawler');

var TorrentSchema = mongoose.Schema({
  hash: { type: String, index: true },
  name: String,
  sources: [String],
  size: {type: String, default: null},
  files: {type: [String], default: null},
  added: {type: Date, default: Date.now, index: true}
});
var Torrent = mongoose.model('Torrent',TorrentSchema);

module.exports = Torrent;

