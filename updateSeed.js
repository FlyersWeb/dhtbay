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

var peerId = new Buffer('01234567890123456789');
var port = 6887;
var lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);

var stream = Torrent.find({ 'lastmod' : { $lt : lastWeek } }).sort({'lastmod': -1}).limit(2000).stream();
stream.on('data', function(torrent) {
	
	var parsedTorrent = { 'infoHash': torrent._id, 'length': torrent.size, 'announce': torrent.details };

	var client = Client(peerId, port, parsedTorrent);

	client.on('scrape', function(data) {
		console.log("got an announce response from tracker: "+data.announce);
		console.log("number of seeders : "+data.complete);
		console.log("number of leechers : "+data.incomplete);
		torrent.swarm.seeders = data.complete;
		torrent.swarm.leechers = data.incomplete;
		torrent.lastmod = new Date();
		torrent.save(function(err) {
			if(err) { console.log("Error while saving"+err); return; }
			console.log("Torrent saved : "+torrent._id);
		});
	});
	client.on('error', function(err) {
		console.log("Torrent client error : "+err); return;
	});
	client.scrape();
});

stream.on('error', function(err) {
	console.log("Error when streaming data : "+err); process.exit(1);
});

stream.on('close', function() {
	process.exit(0);
});
