# dht-bay
A DHT crawler, torrent indexer and search portal all in nodeJS

INSTALL
-------

#### Install necessary tools

```
apt-get install redis-server redis-tools mongodb aria2
```

#### Install node and npm

```
apt-get install nodejs
```

#### Install forever tool

```
sudo npm install forever -g
```

#### Install bitcannon

See bitcannon repository for this : https://github.com/Stephen304/bitcannon. 
You could use my fork in order to be able to see torrent files : https://github.com/FlyersWeb/bitcannon

#### Install dependencies

```
npm install
```

#### Update database information

```
cp ./config/database.default.js ./config/database.js
vim ./config/database.js
```

#### Launch aria2

```
aria2c -q -j 10 --log-level=notice --enable-rpc=true --follow-torrent=false --bt-metadata-only=true --bt-save-metadata=true --enable-dht=true --dir=$(pwd)/torrent -l $(pwd)/logs/aria2c.log &
```

#### Cron to install

Some tasks can be added in a cron treatment. For example this is my CRON configuration :

```
# Update swarm only once a day
40 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/updateSeed.js 2>&1 > /home/dhtcrawl/log/update.log
# Bayesian Categorization only once a day
20 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/classifier.js 2>&1 > /home/dhtcrawl/log/classifier.log
# Categorize only once a day
30 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/categorize.js 2>&1 > /home/dhtcrawl/log/categorize.log
# Load torrent files
*/10 * * * * nodejs /home/crawler/dht-bay/loadFileTorrent.js 2>&1 > /home/crawler/dht-bay/logs/load.log
```

#### Launch the crawler and torrent downloader

```
forever start crawlDHT.js
forever start loadDHT.js
```

You'll have your DHT Crawler up and running. Crawling may take some time so be patient.


CONTENT
-------

The project is composed of 4 modules as presented. Each module is independant and can be used separately without problem.

+  **crawlDHT.js** is responsible for crawling hashs from the DHT network. It will push hashes on a redis list called *DHTS*. It also provides a routing table backup system saving it each 10 minutes in a mongo collection called table.
+  **loadDHT.js** is responsible of loading hashes from the redis list *DHTS* and to download torrent metadat for indexation. It rely intensely on *aria2* tool and tray to download it from torcache, torrage and through DHT.
+  **loadFileTorrent.js** is responsible of saving metadatas into our mongo instance in collection torrents. This will be our basis data.
+  **updateSeed.js** will try to update swarm so you're able to know whose torrent are already active before launching download. You can force full refresh by passing forceAll argument.
+  **categorize.js** will try to categorize crawled torrent depending on file extensions. Because module only takes a limited number of extensions in account you can use classifier too.
+  **classifier.js** a bayesian classifier that will classify torrent that couldn't be classed by previous one. In order to work you need to train the classifier.
+  **trainer.js** the bayesian classifier trainer, based on categorize script classification it helps unknown torrent classification.

Using the **launcher.sh**, all modules will be executed and your database will be populated automatically.

Please fork it, and use it everywhere you can.

IMPROVEMENTS
------------

+ <s>Add a seed/leech crawler to know which torrent is dead or not.</s>
+ Improve categorization to support more extensions. Use an API extension/categorization.
+ <s>Use bayesian categorization optimization.</s>

Have fun.

@flyersweb
