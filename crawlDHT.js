var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.db.uri);

var EventEmitter = require('events').EventEmitter;

var config = require('./config/database');
var util = require('util');

var redis = require("redis");
    client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

var Table = require(__dirname+'/models/Table.js');

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};


var DHTTable = function() {
};
util.inherits(DHTTable, EventEmitter);

DHTTable.prototype.triggerSave = function(dht) {
  this.emit('save',dht);
};

var dhtTable = new DHTTable();
dhtTable.on('save', function(dht) {
  var dhts = dht.toArray();
  var dhtTable = dhts.map(function(e){
    var addr = e["addr"];
    var now = Date.now() / 1000 | 0;
    var yesterday = now - (60*60*24);

    client.zremrangebyscore("PEERS", -Infinity, yesterday);
    client.zadd("PEERS", now, addr, function(err){
      if(err) { console.log(err); return; }
      console.log("Saved routing table");
    });
  });
});

var DHT = require('bittorrent-dht');

client.zrange("PEERS", 0, -1, function(err, peers) {
  if(err) { console.log(err); return; }
  if(!peers) {
    var dht = new DHT();
  } else {
    var dht = new DHT({ bootstrap: peers });
  }

  dht.listen(6881, function(){
    console.log('now listening');
  });

  dht.on('ready',function() {
    console.log('now ready');
    setInterval( function() {
      dhtTable.triggerSave(dht);
    }, 600000);
  });

  dht.on('announce', function(addr, infoHash) {
    dht.lookup(infoHash);
    client.rpush("DHTS", infoHash.toString());
    console.log('announce');
    console.log(addr+' : '+infoHash);
  });

  dht.on('peer', function(addr, infoHash, from) {
    //console.log('peer');
    //console.log(from+' : '+infoHash);
  });

  dht.on('error',function(err) {
    dht.destroy();
  });
});
