"use strict";

const config = require('./config/database');

const Promise = require("bluebird");

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.db.uri);

const fs = require('fs');
Promise.promisifyAll(fs);

const path = require('path');

const async = require('async');

const rt = require('read-torrent');

const Torrent = require(__dirname+'/models/Torrent.js');

const TORRENT_PATH = __dirname+"/torrent";

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "loader"});

function worker() {
  return fs.readdirAsync(TORRENT_PATH)
    .then(files => {
      return files.map(function(file){
        return path.join(TORRENT_PATH, file);
      }).filter(function(file){
        return ( fs.statSync(file).isFile() && ( /\.torrent/.test(file) ) );
      });
    })
    .then(files => {
      if(!files.length) return Promise.reject("No files to load");
      return Promise.map(files, (ofile) => {
        return new Promise((resolve, reject) => {
          rt(ofile, (err, ftorrent) => {
            if(err) {
              reject(err)
            }
            resolve(ftorrent);
          })
        })
        .then(ftorrent => {
          const infoHash = ftorrent.infoHash;
          return new Promise((resolve, reject) => {
            Torrent.findById(infoHash, (err, torrent) => {
              if(err) {
                reject(err);
              }
              if(torrent) {
                reject(`Torrent ${infoHash} already present.`)
              }
              resolve(ftorrent)
            });
          });
        })
        .then(ftorrent => {
          function getFiles(tor) {
            if( tor.files && !tor.files.length ) {
              return tor.files.map(f => f.path);
            }
            return [];
          }
          const t = new Torrent({
            '_id': ftorrent.infoHash,
            'title': ftorrent.name,
            'details': ftorrent.announce,
            'size': ftorrent.length,
            'files': getFiles(ftorrent),
            'imported': new Date()
          });
          return new Promise((resolve, reject) => {
            t.save((err) => {
              if(err) {
                reject(err)
              }
              resolve(ftorrent)
            });
          });
        })
        .then(ftorrent => logger.info(`File ${ftorrent.infoHash} added`))
        .finally(() => fs.unlinkSync(ofile))
      })
    })
    .catch(err => logger.error(err));
}

return worker()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));