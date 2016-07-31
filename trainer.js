"use strict";

const config = require('./config/database');

const Promise = require("bluebird");

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.db.uri);

const path = require('path');

const Torrent = require('./models/Torrent.js');
const Classifier = require('./models/Classifier.js');

const natural = require("natural");
let   classifier = new natural.BayesClassifier();

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "trainer"});

const filter = { $nor: [ { 'category' : /Unknown/ }, { 'category' : /Other/ } ] };

const cursor = Torrent.find(filter).sort({'imported': -1}).cursor();
cursor.eachAsync(torrent => {
  logger.info(`Adding ${torrent._id} training`);
  if(!torrent.files) return Promise.reject(`Torrent ${torrent._id} has no files!`);
  const exts = torrent.files
    .map(file => path.extname(file).toLowerCase())
    .filter(ext => ext.length > 0) // no empty
    .filter(ext => ext.length < config.limitExt) // with min length
  return Promise.resolve(classifier.addDocument(exts, torrent.category));
})
.then(() => Promise.resolve(classifier.train()))
.then(() => Classifier.findOneAndUpdate( {}, { $set : { 'raw' : JSON.stringify(classifier) } }, { upsert : true }))
.then(() => process.exit(0))
.catch(err => Promise.reject(logger.error(err)))
.catch(() => process.exit(1))
