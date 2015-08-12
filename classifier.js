var mongoose = require('mongoose');
var config = require('./config/database');
mongoose.connect(config.db.uri);

var path = require('path');

var natural = require('natural');

var Torrent = require(__dirname+'/models/Torrent.js');
var Classifier = require(__dirname+'/models/Classifier.js');

console.logCopy = console.log.bind(console);

console.log = function(data) {
   if(arguments.length) {
      var timestamp = '[' + new Date().toUTCString() + ']';
      this.logCopy(timestamp, arguments);
   }
};

var filter = { 'category' : /Other/ };

Classifier.findOne( {} , function( err, dbClassifier ) {

  if(err) { console.log('Error occured : '+err); process.exit(1); }

  if(!dbClassifier) { console.log("Unavailable classifier!"); process.exit(1); }

  var classifier = natural.BayesClassifier.restore(JSON.parse(dbClassifier.raw));

  var stream = Torrent.find(filter).sort({'imported': -1}).limit(1000).stream();
  stream.on('data', function(torrent){
    var self = this;
    self.pause();
    console.log("Treating "+torrent._id+" categorization");
    if(typeof torrent.files !== "undefined") {
      var files = torrent.files;
      var exts = [];
      files.forEach(function(file){
        var ext = path.extname(file).toLowerCase();
        if( config.extToIgnore.indexOf(ext) < 0 ) {
          exts.push( ext ); 
        }
      });
      exts = exts.filter( function(value){
        return value.length !== 0
      });

      var category = 'Other';
      
      category = classifier.classify(exts);

      torrent.category=category;

      torrent.save(function(err){
        if(err) {console.log(err); process.exit(1);}
        console.log(torrent._id+" categorized as "+category+"!");
        self.resume();
      });
    }
  });

  stream.on('error', function(err) {
    console.log("Error : "+err); process.exit(1);
  });

  stream.on('close', function(){
    process.exit();
  });

});