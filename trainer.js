var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.db.uri);

var path = require('path');

var Torrent = require(__dirname+'/models/Torrent.js');
var Classifier = require(__dirname+'/models/Classifier.js');

var natural = require("natural"),
    classifier = new natural.BayesClassifier();

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};


var filter = { $nor: [ { 'category' : /Unknown/ }, { 'category' : /Other/ } ] };

var stream = Torrent.find(filter).sort({'imported': -1}).stream();
stream.on('data', function(torrent){
  var self = this;
  console.log("Treating "+torrent._id+" categorization");
  
  if(typeof torrent.files !== "undefined") {
    var files = torrent.files;
    var exts = [];
    files.forEach(function(file){
      var ext = path.extname(file).toLowerCase();
      if( config.extToIgnore.indexOf(ext) < 0 ) {
        if(ext.length < 6) {
          exts.push( ext ); 
        }
      }
    });
    exts = exts.filter( function(value){
      return value.length !== 0
    });

    classifier.addDocument(exts, torrent.category);

  }
});

stream.on("error", function(err) {
   console.log("An error occured : "+err);
   process.exit(1);
});

stream.on("close", function() {
  classifier.train();
  Classifier.findOneAndUpdate( {}, { $set : { 'raw' : JSON.stringify(classifier) } }, { upsert : true }, function(err, trainedClassifier) {
    if(err) { console.log("Error when saving : "+err); process.exit(1); }
    process.exit();
  });
});
