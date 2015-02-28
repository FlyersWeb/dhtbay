var fs = require('fs');
var path = require('path');

var chokidar = require('chokidar');

var rt = require('read-torrent');

var watcher = chokidar.watch('torrent', {
  ignored: /[\/\\]\./, persistent: true
});

var Torrent = require('./models/Torrent.js');

var log = console.log.bind(console);

watcher
  .on('add', function(p) { 
    var fullpath = __dirname+'/'+p;
    if(/torrent(\.[0-9]+)?/.test(p)) {
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

	Torrent.update({'hash':infoHash},{
              'hash': infoHash,
              'name': name,
              'sources': sources,
              'size': size,
              'files': files
           }, {'multi': false, 'upsert': true}, function(err, doc) {
              if(err){log(err); return;}
              log('File '+p+' added');
              fs.unlink(fullpath);
        });
      });
    } else {
      log('File '+p+' not a torrent');
      fs.unlink(fullpath);
    }
  })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('error', function(error) { log('Error happened', error); watcher.close(); });

