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

  client.lpop("DHTS", function(err, hash){
    if(err) {log(err); return;}
    if(!hash) {return;}
    var magnet = MAGNET_TEMPLATE.replace('{DHTHASH}',hash);
    aria2.send('getVersion', function(err,res){
      log(err || res);
      aria2.open(function(){
        aria2.send('addUri',[magnet],function(err,res){
          if(err) {aria2.close(); log(err); return;}
          log("Added : "+magnet+" => "+res);
          if(aria2)
             aria2.close();
        })
      });
    })
  })

}

setInterval(function(){
   run();
}, 1000);

