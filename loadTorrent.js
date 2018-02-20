'use strict';

const config = require('./config/database');

const Promise = require('bluebird');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.db.uri);

const fs = require('fs');
Promise.promisifyAll(fs);

const path = require('path');

const minimist = require('minimist');

const rt = require('read-torrent');

const Torrent = require('./models/Torrent.js');

const bunyan = require('bunyan');
const logger = bunyan.createLogger({
  name: 'torrentLoader'
});

const chokidar = require('chokidar');
const glob = require('glob');

const TORRENT_PATH = `${__dirname}/torrent`;
const TORRENT_GLOB = `${TORRENT_PATH}/*.torrent`;

function loadTorrent(fsfile) {
  logger.info(`File ${fsfile} treatment in progress...`);
  return new Promise((resolve, reject) => {
      rt(fsfile, (err, ftorrent) => {
        if (err) {
          reject(err)
        }
        resolve(ftorrent);
      })
    })
    .then(ftorrent => [ftorrent, Torrent.findById(ftorrent.infoHash).exec()])
    .spread((ftorrent, res) =>
      (res) ? Promise.reject('TEXISTS') : Promise.resolve(ftorrent))
    .then(ftorrent => {
      return [
        ftorrent,
        new Torrent({
          '_id': ftorrent.infoHash,
          'title': ftorrent.name,
          'details': ftorrent.announce,
          'size': ftorrent.length,
          'files': ftorrent.files.map(f => f.path),
          'imported': new Date()
        }).save()
      ]
    })
    .spread((ftorrent, res) => Promise.resolve(
      logger.info(`File ${ftorrent.infoHash} added`)))
    .catch(err => (err === 'TEXISTS') ? Promise.resolve(
      logger.info(`File ${fsfile} already loaded`)) : Promise.reject(err))
    .then(() => fs.unlinkAsync(fsfile))
    .catch(err => Promise.reject(logger.error(err)))
}

const argv = minimist(process.argv.slice(2));

if (argv.f || argv.force) {
  return glob(TORRENT_GLOB, {
      silent: true,
      absolute: false
    }, (err, fsfiles) =>
    Promise.all(fsfiles.map(fsfile => loadTorrent(fsfile))));
} else if (argv.w || argv.watch) {
  const watcher = chokidar.watch(TORRENT_GLOB);
  watcher.on('add', (fsfile) => loadTorrent(fsfile));
} else {
  process.stdout.write(
    `Usage :
    + Watch mode : loadTorrent --watch
    + Force load : loadTorrent --force`
  );
}
