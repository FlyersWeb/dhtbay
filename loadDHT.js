var Aria2 = require('aria2');
var fs = require('fs');

var redis = require("redis");
    client = redis.createClient();

client.on("error", function(err) {
    if(err) {
        throw err;
    }
});

var dest = __dirname+"/torrent/";
var MAX_DL = 10;
var MAGNET_TEMPLATE = "magnet:?xt=urn:btih:{DHTHASH}&tr=udp%3A%2F%2Ftracker.1337x.org%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce"
var TORCACHE = "http://torcache.net/torrent/{DHTHASH}.torrent";
var TORRAGE = "http://torrage.com/torrent/{DHTHASH}.torrent";

var aria2 = new Aria2({
   host: '127.0.0.1',
   port: 6800,
   secure: false,
   secret: ''
});

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};


function run() {

  client.lpop("DHTS",function(err, hash){
    if(err) {console.log(err); return;}
    if(!hash) {return;}
    if(fs.existsSync(dest+hash.toString().toUpperCase()+'.torrent')) {console.log("File "+hash.toString().toUpperCase()+".torrent already exists");return;}
    var magnet = MAGNET_TEMPLATE.replace('{DHTHASH}',hash.toString().toUpperCase());
    var torcache = TORCACHE.replace('{DHTHASH}',hash.toString().toUpperCase());
    var torrage = TORRAGE.replace('{DHTHASH}',hash.toString().toUpperCase());
    aria2.send('getVersion', function(err,res){
      if(err) {aria2.close(); console.log(err); return;}
      aria2.open(function(){
        aria2.send('addUri',[magnet,torcache,torrage],function(err,res){
          if(err) {aria2.close(); console.log(err); return;}
          console.log("Added : "+magnet+" => "+res);
          aria2.close();
        })
      });
    })
  })

}

setInterval(function(){
   run();
}, 10000);

