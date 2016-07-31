"use strict";

const config = require('./config/database');

const Promise = require("bluebird");

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.db.uri);

const path = require('path');

const natural = require('natural');

const Torrent = require('./models/Torrent.js');
const Classifier = require('./models/Classifier.js');

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "classifier"});

function precision(a) {
   let e = 1;
   while (Math.round(a * e) / e !== a) e *= 10;
   return Math.round(Math.log(e) / Math.LN10);
};

let   category = "Unknown";
const filter = { 'category' : /Unknown/ };

Classifier.findOne({})
.then(dbClassifier => {
  if(!dbClassifier) return Promise.reject("Unavailable classifier!"); 
  return Promise.resolve(natural.BayesClassifier.restore(JSON.parse(dbClassifier.raw)));
})
.then(classifier => {
  const cursor = Torrent.find(filter).sort({'imported': -1}).limit(100).cursor();
  return cursor.eachAsync(torrent => {
    logger.info(`Treating ${torrent._id} categorization`)
    if(!torrent.files) return Promise.reject(`Torrent ${torrent._id} has no files!`);
    const exts = torrent.files
      .map(file => path.extname(file).toLowerCase())
      .filter(ext => ext.length > 0) // no empty
      .filter(ext => ext.length < config.limitExt) // with min length

    if(!exts.length) return Promise.reject(`No extensions for torrent ${torrent._id}`);
    const classifications = classifier.getClassifications(exts);
    if(classifications.length && (classifications[0].value * Math.pow(10,8) > 1)) {
      const valA = classifications[0].value,
            valB = classifications[1].value;
      // Detect incertitude to limit classification
      const cprecision = precision(valA);
      const valAprecision = valA*Math.pow(10,cprecision),
            valBprecision = valB*Math.pow(10,cprecision);
      if( ((valAprecision-valBprecision)/valAprecision) > 0.4 )  {
        category=classifications[0].label;
      }
    }
    torrent.category = category;
    return torrent.save()
  })
})
.then(() => process.exit(0))
.catch((err) => Promise.reject(logger.error(err)))
.catch(() => process.exit(1));