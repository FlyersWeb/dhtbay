var Aria2 = require('aria2');

var redis = require("redis");
    client = redis.createClient();

client.on("error", function(err) {
    if(err) {
        throw err;
    }
});

var dest = __dirname+"/torrent/";
var MAX_DL = 10;
var MAGNET_TEMPLATE = "magnet:?xt=urn:btih:{DHTHASH}&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce"

var aria2 = new Aria2({
   host: '127.0.0.1',
   port: 6800,
   secure: false,
   secret: ''
});

var log = console.log.bind(console);

function run() {

  client.lpop("DHTS",function(err, hash){
    if(err) {log(err); return;}
    if(!hash) {return;}
    var magnet = MAGNET_TEMPLATE.replace('{DHTHASH}',hash);
    aria2.send('getVersion', function(err,res){
      log(err || res);
      aria2.open(function(){
        aria2.send('addUri',[magnet],function(err,res){
          if(err) {aria2.close(); log(err); return;}
          log("Added : "+magnet+" => "+res);
          aria2.close();
        })
      });
    })
  })

}

setInterval(function(){
   run();
}, 100);

