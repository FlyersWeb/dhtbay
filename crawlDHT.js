"use strict";

const config = require('./config/database');

const DHT = require('bittorrent-dht');

const redis = require("redis");
const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "crawler"});

const dht = new DHT();
  
dht.listen(6881, () => {
  logger.info('now listening');
  logger.info(dht.address());
});

dht.on('ready', () => {
  logger.info('now ready');
});

dht.on('announce', (peer, infoHash) => {
  logger.info(`announce : ${peer.host}:${peer.port} : ${infoHash.toString('hex')}`);
  dht.lookup(infoHash);
  client.rpush("DHTS", infoHash.toString('hex'));
});

dht.on('peer', (peer, infoHash, from) => {
  logger.info(`announce : ${peer.host}:${peer.port} : ${infoHash.toString('hex')}`);
});

dht.on('error', (err) => {
  logger.error(err);
  dht.destroy();
});
