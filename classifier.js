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

function precision(a) {
   var e = 1;
   while (Math.round(a * e) / e !== a) e *= 10;
   return Math.round(Math.log(e) / Math.LN10);
};

var filter = { 'category' : /Other/ };

Classifier.findOne( {} , function( err, dbClassifier ) {

  if(err) { console.log('Error occured : '+err); process.exit(1); }

  if(!dbClassifier) { console.log("Unavailable classifier!"); process.exit(1); }

  var classifier = natural.BayesClassifier.restore(JSON.parse(dbClassifier.raw));

  var stream = Torrent.find(filter).sort({'imported': -1}).limit(100).stream();
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
          if( ext.length < config.limitExt ) {
            exts.push( ext ); 
          }
        }
      });
      exts = exts.filter( function(value){
        return value.length !== 0
      });

      var category = 'Other';
      
      if(exts.length > 0) {
        var classifications = classifier.getClassifications(exts);
        if(classifications[0].value * Math.pow(10,8) > 1) {
          var valA = classifications[0].value; var valB = classifications[1].value;
          // Detect incertitude to limit classification
          var cprecision = precision(valA);
          var clength = (valA*Math.pow(10,cprecision)).toString().length;
          valA = valA*Math.pow(10,cprecision);
          valB = valB*Math.pow(10,cprecision);
          if( ((valA-valB)/valA) > 0.4 )  {
	    category=classifications[0].label;
          }
        }
      }

      torrent.category=category;

      torrent.save(function(err){
        if(err) {console.log(err); process.exit(1);}
        console.log(torrent._id+" categorized as "+torrent.category+"!");
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
