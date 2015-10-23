var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.db.uri);

var fs = require('fs');
var path = require('path');

var redis = require("redis");
    client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

client.on("error", function(err) {
    if(err) {
        throw err;
    }
});

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

function run() {
  client.lpop("TORS", function(err, file){
    if(err) { console.log(err); return; }
    if(!file) { return; }
    var ofile = path.join(TORRENT_PATH, file.toUpperCase())+'.torrent';
    console.log("treating file : "+ofile);
    if ( !fs.existsSync(ofile) ) { console.log("file do not exists"); return; }
    rt(ofile, function(err, ftorrent){
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
      });
    });
  });
}

setInterval(function(){
  run();
}, 30000);
