var crypto = require("crypto");
var dgram = require("dgram");
var timers = require("timers");

var bencode = require("bencode");

var redis = require("redis");
    client = redis.createClient();

client.on("error", function(err) {
    if(err) {
        throw err;
    }
});

var BOOTSTRAP_NODES = [
    ["router.bittorrent.com", 6881],
    ["dht.transmissionbt.com", 6881],
    ["router.utorrent.com", 6881]
];
var TID_LENGTH = 4;
var MAX_QNODE_SIZE = 10000;

function randomID() {
    return new Buffer(
        crypto.createHash("sha1")
            .update(crypto.randomBytes(20))
            .digest("hex"),
        "hex"
    );
}

function decodeNodes(data) {
  var nodes = [];
  for (var i = 0; i + 26 <= data.length; i += 26) {
    nodes.push({
      nid: data.slice(i, i + 20),
      address: data[i + 20] + "." + data[i + 21] + "." +
               data[i + 22] + "." + data[i + 23],
      port: data.readUInt16BE(i + 24)
    });
  }
  return nodes;
};

function getNeighbor(target) {
    return  Buffer.concat([target.slice(0, 10), randomID().slice(10)]);
}

function entropy(len) {
    var text = [];
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZab" 
        + "cdefghijklmnopqrstuvwxyz0123456789";
    var length = chars.length;
    for (var i=0; i < len; i++) {
        text.push(chars.charAt(Math.floor(Math.random() * length)));
    }
    return text.join("");
}

function DHT(master, client, bindIP, bindPort) {
    this.client = client;
    this.master = master;
    this.bindIP = bindIP;
    this.bindPort = bindPort;
    this.ktable = new KTable();
    this.udp = dgram.createSocket("udp4");
    this.udp.bind(this.bindPort, this.bindIP);
}
DHT.prototype.sendKRPC = function(msg, rinfo) {
    try {
        var buf = bencode.encode(msg);
        this.udp.send(buf, 0, buf.length, rinfo.port, rinfo.address);
    }
    catch (ex) {
        //do nothing
    }
};
DHT.prototype.playDead = function(tid, rinfo) {
    var msg = {
        t: tid, 
        y: "e", 
        e: [202, "Server Error"]
    };
    this.sendKRPC(msg, rinfo);
};
DHT.prototype.processFindNodeReceived = function(nodes) {
    var nodes = decodeNodes(nodes);
    var self = this;
    nodes.forEach(function(node) {
        if (node.address == self.bindIP && node.port == self.bindPort
            || node.nid == self.ktable.nid) {
            //do nothing
        }
        else {
            self.ktable.push(node);
        }
    });
};
DHT.prototype.processFindNode = function(msg, rinfo) {
    var target = msg.a.target;
//    if (target) {
//        this.master.log(rinfo, target);
//    }
    this.playDead(msg.t, rinfo);
};
DHT.prototype.processGetPeers = function(msg, rinfo) {
    var infohash = msg.a.info_hash;
    if (infohash) {
        this.master.log(infohash);

        this.client.rpush("DHTS", infohash.toString("hex"));
    }
    this.playDead(msg.t, rinfo);
};
DHT.prototype.sendFindNode = function(rinfo, nid) {
    if (typeof nid != "undefined") {
        var nid = getNeighbor(nid);
    }
    else {
        var nid = randomID();
    }
    var msg = {
        t: entropy(TID_LENGTH),
        y: "q",
        q: "find_node",
        a: {
            id: nid,
            target: randomID()
        }
    };
    this.sendKRPC(msg, rinfo);
};
DHT.prototype.joinDHT = function() {
    var self = this;
    BOOTSTRAP_NODES.forEach(function(node) {
        self.sendFindNode({address: node[0], port: node[1]});
    });
};
DHT.prototype.dataReceived = function(msg, rinfo) {
    try {
        var msg = bencode.decode(msg);
        if (msg.y == "r" && msg.r.nodes) {
            this.processFindNodeReceived(msg.r.nodes);
        }
        else if (msg.y == "q" && msg.q == "get_peers") {
            this.processGetPeers(msg, rinfo);
        }
        else if (msg.y == "q" && msg.q == "find_node") {
            this.processFindNode(msg, rinfo);
        }
    }
    catch (ex) {
        //do nothing
    }
};
DHT.prototype.wander = function() {
    var self = this;
    this.ktable.nodes.forEach(function(node) {
        self.sendFindNode({address: node.address, port: node.port}, node.nid);
    });
    this.ktable.nodes = [];
};
DHT.prototype.start = function() {
    var self = this;
    this.udp.on("message", function(msg, rinfo) {
        self.dataReceived(msg, rinfo);
    });
    this.udp.on("error", function(err) {
        //do nothing
    });
    timers.setInterval(function() {self.joinDHT()}, 10000);
    timers.setInterval(function() {self.wander()}, 1000);
};

function Master() {}
Master.prototype.log = function(rinfo, infohash) {
    console.log("%s from %s:%s", infohash.toString("hex"), rinfo.address, rinfo.port);
};

function KTable() {
    this.nid = randomID();
    this.nodes = [];
}
KTable.prototype.push = function(node) {
    if (this.nodes.length >= MAX_QNODE_SIZE) {
        return
    }
    this.nodes.push(node);
};


new DHT(new Master(), client, "0.0.0.0", 6881).start();
