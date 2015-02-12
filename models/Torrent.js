var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dhtcrawler');

var TorrentSchema = mongoose.Schema({
  hash: String,
  name: String,
  sources: [String],
  size: {type: String, default: null},
  files: {type: [String], default: null}
});
var Torrent = mongoose.model('Torrent',TorrentSchema);

module.exports = Torrent;

