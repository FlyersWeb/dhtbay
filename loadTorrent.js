var fs = require('fs');
var path = require('path');

var async = require('async');

var rt = require('read-torrent');

var Torrent = require(__dirname+'/models/Torrent.js');

var TORRENT_PATH = __dirname+"/torrent";

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};


fs.readdir(TORRENT_PATH, function(err, files) {
  if(err) { console.log(err); process.exit(1); }
  var ffiles = files.map(function(file){
    return path.join(TORRENT_PATH, file);
  }).filter(function(file){
    return ( fs.statSync(file).isFile() && ( /\.torrent/.test(file) ) );
  });
  async.each(ffiles, 
    function(file, callback){
      var ofile = file;
      rt(ofile, function(err, ftorrent){
        if(err) {console.log(err); callback(); return;}
        console.log("treating file : "+ofile);
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
          if(err) {console.log(err); callback();}
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
              console.log('File '+ofile+' added');
            });
          } else {
            console.log('Torrent '+infoHash+' already present.');
          }
          fs.unlinkSync(ofile);
          callback();
        });
      });
    }, 
    function(err){
      if(err) {console.log(err); process.exit(1);}
      process.exit();
    });
});
