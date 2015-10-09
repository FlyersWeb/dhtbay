var mongoose = require('mongoose');

var TorrentSchema = mongoose.Schema({
  _id: { type: String, index: true },
  title: { type: String, index: true },
  category: { type: String, default: "Unknown", index: true },
  details: { type: [String], default: [] },
  size: { type: Number, default: 0 },
  files: { type: [String], default: [] },
  swarm: {
    seeders: { type: Number, default: 0, index: true },
    leechers: { type: Number, default: 0 }
  },
  imported: {type: Date, default: Date.now, index: true},
  lastmod: {type: Date, default: Date.now, index: true}
});
var Torrent = mongoose.model('Torrent',TorrentSchema);

module.exports = Torrent;

