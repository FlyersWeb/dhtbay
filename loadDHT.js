'use strict';

const config = require('./config/database');

const Promise = require('bluebird');

const Aria2 = require('aria2');
const fs = require('fs');

const magnet = require('magnet-uri');

const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
const client1 = redis.createClient(config.redis.port, config.redis.host,
  config.redis.options);
const client2 = redis.createClient(config.redis.port, config.redis.host,
  config.redis.options);

const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'loader' });

const MAGNET_TEMPLATE =
  magnet.encode({ xt: 'urn:btih:{DHTHASH}', tr: config.trackers })

const aria2 = new Aria2(config.aria2);

const aria2Options =
{
  'bt-metadata-only': 'true',
  'bt-save-metadata': 'true',
  'follow-torrent': 'false',
  'seed-time': 0
}

client1.on('subscribe', (channel, count) => {
  logger.info(`Subscribed : ${channel}`);
})

client1.on('message', (channel, message) => {
  let magnetLink = MAGNET_TEMPLATE;
  return Promise.resolve(message)
    .then(hash => {
      return new Promise((resolve, reject) => {
        return client2.get(hash, (err, reply) => {
          if (err) reject(err);
          if (reply) reject(`${hash} already present`);
          return client2.setex(hash, 60, "OK", () => {
            resolve(hash)
          })
        })
      })
    })
    .then(hash => {
      return new Promise((resolve, reject) => {
        if (!hash)
          reject('No torrent in queue');
        const filename =
          `${__dirname}/torrent/${hash.toString().toUpperCase()}.torrent`;
        magnetLink = MAGNET_TEMPLATE.replace(
          '{DHTHASH}', hash.toString().toUpperCase());
        if (fs.existsSync(filename)) {
          reject(`File ${filename} already exists`);
        }
        resolve(magnetLink)
      });
    })
    .then(() => aria2.open())
    .then(() => aria2.getVersion())
    .then(() => aria2.addUri([magnetLink], aria2Options))
    .then(res => Promise.resolve(
      logger.info(`Added : ${magnetLink} => ${res}`)))
    .then(() => aria2.close())
    .catch((err) => logger.error(err));
});

client1.subscribe('DHTS');
