var EventEmitter = require('events').EventEmitter;
var util = require('util');

var redis = require("redis");
    client = redis.createClient();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dhtcrawler');

var Table = require('./models/Table.js');

var log = console.log.bind(console);


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
    log('now listening');
  });

  dht.on('ready',function() {
    log('now ready');
    setInterval( function() {
      dhtTable.triggerSave(dht);
    }, 600000);
  });

  dht.on('announce', function(addr, infoHash) {
    dht.lookup(infoHash);
    client.rpush("DHTS", infoHash.toString());
    log('announce');
    log(addr+' : '+infoHash);
  });

  dht.on('peer', function(addr, infoHash, from) {
    log('peer');
  });

  dht.on('error',function(err) {
    dht.destroy();
  });

});
