var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.db.uri);

var fs = require('fs');
var Client = require('bittorrent-tracker');

var Torrent = require(__dirname+'/models/Torrent.js');

console.logCopy = console.log.bind(console);

console.log = function(data) {
  if(arguments.length) {
  	var timestamp = '[' + new Date().toUTCString() + ']';
  	this.logCopy(timestamp, arguments);
	}
};

var args = process.argv.slice(2);

var peerId = new Buffer('01234567890123456789');
var port = 6887;

var lastDay = new Date();
lastDay.setDate(lastDay.getDate() - 1);
var filter = { 'lastmod' : { $lt : lastDay } };

if(args.length>0){
	if(args[0]=="forceAll"){
		filter = {};
	}
}

var stream = Torrent.find(filter).sort({'lastmod': -1}).limit(100).stream();
stream.on('data', function(torrent) {
	var self = this;
	self.pause();
	console.log("Processing torrent : "+torrent._id);
	var parsedTorrent = { 'infoHash': torrent._id, 'length': torrent.size, 'announce': torrent.details };

	var client = Client(peerId, port, parsedTorrent);
	client.on('scrape', function(data) {
		console.log("got a response from tracker: "+data.announce);
		console.log("number of seeders : "+data.complete);
		console.log("number of leechers : "+data.incomplete);
		torrent.swarm.seeders = data.complete;
		torrent.swarm.leechers = data.incomplete;
		torrent.lastmod = new Date();
		torrent.save(function(err) {
			if(err) { console.log("Error while saving"+err); self.resume(); }
			console.log("Torrent saved : "+torrent._id); self.resume();
		});
	});
	client.on('error', function(err) {
		console.log("Torrent client error : "+err); self.resume();
	});
	client.on('warning', function(err) {
		console.log("Torrent client error : "+err); self.resume();
	});
	client.scrape();
});

stream.on('error', function(err) {
	console.log("Error when streaming data : "+err); process.exit(1);
});

stream.on('close', function() {
	console.log("Stream closed"); process.exit(1);
});
