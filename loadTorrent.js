var fs = require('fs');
var path = require('path');

var chokidar = require('chokidar');

var rt = require('read-torrent');

var watcher = chokidar.watch('torrent', {
  ignored: /[\/\\]\./, persistent: true
});

var Torrent = require('./models/Torrent.js');

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};


watcher
  .on('add', function(p) {
    console.log("Detected file " + p); 
    var fullpath = __dirname+'/'+p;
    if(/torrent(\.[0-9]+)?/.test(p)) {
      rt(fullpath, function(err, ftorrent){
        if(err) {console.log(err); return;}
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

        Torrent.findById(infoHash, function(err, torrent){
          if(err) {console.log(err); return;}
          if(!torrent) {
            var t = new Torrent({
              '_id': infoHash,
              'title': name,
              'details': sources,
              'size': size,
              'files': files,
              'imported': new Date()
            });
            t.save(function(err){
              console.log('File '+p+' added');
              fs.unlink(fullpath);
            });
          }
        });
      });
    } else {
      console.log('File '+p+' not a torrent');
      fs.unlink(fullpath);
    }
  })
  .on('ready', function() { console.log('Initial scan complete. Ready for changes.'); })
  .on('error', function(error) { console.log('Error happened', error); watcher.close(); });

