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
var MAGNET_TEMPLATE = "magnet:?xt=urn:btih:{DHTHASH}"

var aria2 = new Aria2();

var log = console.log.bind(console);

function run() {

  client.lrange("DHTS", 0, 10, function(err, hashs){
    var uris = [];
    if(err) {log(err); return;}
    if(!hashs) {return;}
    hashs.forEach(function(hash) {
       var magnet = MAGNET_TEMPLATE.replace('{DHTHASH}',hash);
       uris.push(magnet);
    });
    aria2.send('getVersion', function(err,res){
      log(err || res);
      aria2.open(function(){
        aria2.send('addUri',uris,function(err,res){
          if(err) {aria2.close(); log(err); return;}
          log("Added : "+uris.toString()+" => "+res);
        })
      });
    })
  })

}

setInterval(function(){
   run();
}, 5000);

