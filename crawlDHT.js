var config = require('./config/database');
var util = require('util');

var redis = require("redis");
    client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};

var DHT = require('bittorrent-dht');

var dht = new DHT();
  
dht.listen(6881, function(){
  console.log('now listening');
  console.log(dht.address());
});

dht.on('ready',function() {
  console.log('now ready');
});

dht.on('announce', function(peer, infoHash) {
  console.log("announce : "+peer.host + ':' + peer.port+' : '+infoHash.toString('hex'));
  dht.lookup(infoHash);
  client.rpush("DHTS", infoHash.toString('hex'));
});

dht.on('peer', function(peer, infoHash, from) {
  console.log("peer : "+peer.host + ':' + peer.port+' : '+infoHash.toString('hex'));
});

dht.on('error',function(err) {
  dht.destroy();
});
