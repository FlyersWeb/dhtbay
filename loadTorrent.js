"use strict";

const mongoose = require('mongoose');
const config = require('./config/database');
mongoose.connect(config.db.uri);

const fs = require('fs');
const path = require('path');

const async = require('async');

const rt = require('read-torrent');

const Torrent = require(__dirname+'/models/Torrent.js');

const TORRENT_PATH = __dirname+"/torrent";

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "loader"});


fs.readdir(TORRENT_PATH, function(err, files) {
  if(err) { logger.info(err); process.exit(1); }
  const ffiles = files.map(function(file){
    return path.join(TORRENT_PATH, file);
  }).filter(function(file){
    return ( fs.statSync(file).isFile() && ( /\.torrent/.test(file) ) );
  });
  async.each(ffiles, 
    function(ofile, callback){
      rt(ofile, function(err, ftorrent){
        if(err) {logger.error(err); callback(); return;}
        logger.info("treating file : "+ofile);
        const sources = ftorrent.announce;
              name = ftorrent.name;
              infoHash = ftorrent.infoHash;

        let files = null,
            size = 0;
        if( typeof ftorrent.files !== "undefined" ) {
          files = [];
          for(let i=0; i<ftorrent.files.length; i++) {
            const f = ftorrent.files[i];
            size  += f.length;
            files  = files.concat(f.path);
          }
        } else {
          size = ftorrent.length;
        }
        
        Torrent.findById(infoHash, function(err, torrent){
          if(err) {logger.error(err); callback();}
          if(!torrent) {
            const t = new Torrent({
              '_id': infoHash,
              'title': name,
              'details': sources,
              'size': size,
              'files': files,
              'imported': new Date()
            });
            t.save(function(err){
              if(err) {logger.error(err); return;}
              logger.info('File '+ofile+' added');
            });
          } else {
            logger.info('Torrent '+infoHash+' already present.');
          }
          fs.unlinkSync(ofile);
          callback();
        });
      });
    }, 
    function(err){
      if(err) {logger.error(err); process.exit(1);}
      process.exit();
    });
});
