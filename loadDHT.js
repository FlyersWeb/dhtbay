const config = require ('./config/database');

const Aria2 = require('aria2');
const fs = require('fs');

const redis = require("redis");
    client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

const bunyan = require("bunyan");
const logger = bunyan.createLogger({name: "loader"});

const dest = __dirname+"/torrent/";
const MAX_DL = 10;
const MAGNET_TEMPLATE = "magnet:?xt=urn:btih:{DHTHASH}&tr=udp%3A%2F%2Ftracker.1337x.org%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce"

const aria2 = new Aria2({
   host: '127.0.0.1',
   port: 6800,
   secure: false,
   secret: ''
});

function run() {
  client.lpop("DHTS",function(err, hash){
    if(err) {logger.error(err); return;}
    if(!hash) {return;}
    if(fs.existsSync(dest+hash.toString().toUpperCase()+'.torrent')) {logger.info("File "+hash.toString().toUpperCase()+".torrent already exists");return;}
    const magnet = MAGNET_TEMPLATE.replace('{DHTHASH}',hash.toString().toUpperCase());
    aria2.open(function() {
      aria2.send('getVersion', function(err,res){
      if(err) { logger.error(err); return;}
        aria2.send('addUri',[magnet],function(err,res){
          if(err) { logger.error(err); return;}
          logger.info("Added : "+magnet+" => "+res);
          aria2.close();
        })
      });
    });
  });
}

setInterval(function(){
   run();
}, 5000);

