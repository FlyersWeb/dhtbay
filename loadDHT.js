"use strict";

const config = require("./config/database");

const Promise = require("bluebird");

const Aria2 = require("aria2");
const fs = require("fs");

const magnet = require("magnet-uri");

const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "loader"});

const dest = __dirname+"/torrent/";
const MAGNET_TEMPLATE = magnet.encode({
  xt: "urn:btih:{DHTHASH}",
  tr: config.trackers
})

const aria2 = new Aria2({
   host: "127.0.0.1",
   port: 6800,
   secure: false,
   secret: ""
});

const aria2Options = {
  "bt-metadata-only": "true",
  "bt-save-metadata": "true",
  "follow-torrent": "false",
  "bt-stop-timeout": 60,
  "seed-time": 0,
  "dir": dest,
}

function worker() {
  let magnetLink = MAGNET_TEMPLATE;
  return client.lpopAsync("DHTS")
    .then(hash => {
      return new Promise((resolve, reject) => {
        if(!hash) reject("No torrent in queue");
        const filename = `${dest}${hash.toString().toUpperCase()}.torrent`;
        magnetLink = MAGNET_TEMPLATE.replace("{DHTHASH}",hash.toString().toUpperCase());
        if(fs.existsSync(filename)) {
          reject(`File ${filename} already exists`);
        }
        resolve(magnetLink)
      });
    })
    .then(() => aria2.open())
    .then(() => aria2.getVersion())
    .then(() => aria2.addUri([magnetLink], aria2Options))
    .then(res => Promise.resolve(logger.info(`Added : ${magnetLink} => ${res}`)))
    .then(() => aria2.close())
    .catch((err) => Promise.reject(logger.error(err)))
}

return worker()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));