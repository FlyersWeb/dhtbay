var path = require('path');

var chokidar = require('chokidar');

var rt = require('read-torrent');

var watcher = chokidar.watch('torrent', {
  ignored: /[\/\\]\./, persistent: true
});

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

var log = console.log.bind(console);

watcher
  .on('add', function(p) { 
    log('File '+p+' added');
    if(path.extname(p) == '.torrent') {
      var fullpath = __dirname+'/'+p;
      rt(fullpath, function(err, ftorrent){
        if(err) {log(err); return;}
        var files = null;
        var size = 0;
        if( typeof ftorrent.files !== "undefined" ) {
          files = [];
          for(var i=0; i<ftorrent.files.length; i++) {
            var file = ftorrent.files[i];
            size  += file.length;
            files  = files.concat(file.path);
          }
        } else {
          size = ftorrent.length;
        }
        var sources = ftorrent.announce;
        var name = ftorrent.name;
        var infoHash = ftorrent.infoHash;
        var torrent = new Torrent({
          'hash': infoHash,
          'name': name,
          'sources': sources,
          'size': size,
          'files': files
        });
        torrent.save(function(err){
          if(err) { log(err); return; }
        });
      });
    } else {
      log('File '+p+' not a torrent');
    }
  })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('error', function(error) { log('Error happened', error); watcher.close(); });

