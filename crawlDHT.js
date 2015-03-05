var EventEmitter = require('events').EventEmitter;
var util = require('util');

var redis = require("redis");
    client = redis.createClient();

var Table = require('./models/Table.js');

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
  log('save');
  var dhtTable = dht.toArray();
  Table.findOne({}, function(err, table) {
    if(err) { log(err); return; }
    if(!table) {
      var table = new Table({'table': dhtTable});
    } else {
      table.table = dhtTable;
    }
    table.save(function(err) {
      if(err) { log(err); return; }
    });
  });
});

var DHT = require('bittorrent-dht');

Table.findOne({}, function(err,table){
  if(err) { log(err); return; }
  if(table) {
    var dht = new DHT({ bootstrap: table.table });
  } else {
    var dht = new DHT();
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
