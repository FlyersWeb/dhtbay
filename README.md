# dht-bay
A DHT crawler, torrent indexer and search portal all in nodeJS

DEPENDENCIES
------------

This project works fine with :
- node 6.3.1
- npm 3.10.3
- redis-server 2.8.17
- mongod 2.4.10
- aria2 1.18.8

INSTALL
-------

#### Install necessary tools

```
apt-get install redis-server mongodb aria2
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

You should update redis and mongo databases informations

```
cp ./config/database.default.js ./config/database.js
vim ./config/database.js
```

#### Launch aria2

```
aria2c -q -j 10 --log-level=notice --enable-rpc=true --enable-dht=true --enable-dht6=true -l $(pwd)/logs/aria2c.log &
```

#### Cron to install

Some tasks can be added in a cron treatment. For example this is my CRON configuration :

```
# Categorize each 30 minutes
*/30 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/categorize.js 2>&1 > /home/dhtcrawl/log/categorize.log
```

#### Launch the crawler and torrent downloader

Launch the crawler, the metadata loader and file indexing programs permanently

```
forever start crawlDHT.js
forever start loadDHT.js
forever start loadTorrent.js
```

You'll have your DHT Crawler up and running. Crawling may take some time so be patient.

#### Good to know

You should open your 6881/udp port to allow the crawler to have access to DHT network.


CONTENT
-------

The project is composed of 4 modules as presented. Each module is independant and can be used separately without problem.

+  **crawlDHT.js** is responsible for crawling hashs from the DHT network. It will push hashes on a redis list called *DHTS*. It also provides a routing table backup system saving it each 10 minutes in a mongo collection called table.
+  **loadDHT.js** is responsible of loading hashes from the redis list *DHTS* and to download torrent metadat for indexation. It rely intensely on *aria2* tool and tray to download it from torcache, torrage and through DHT.
+  **loadTorrent.js** is responsible of saving metadatas into our mongo instance in collection torrents. This will be our basis data.
+  **categorize.js** will try to categorize crawled torrent depending on file extensions. Because module only takes a limited number of extensions in account you can use classifier too.
+  **classifier.js** a bayesian classifier that will classify torrent that couldn't be classed by previous one. In order to work you need to train the classifier.
+  **trainer.js** the bayesian classifier trainer, based on categorize script classification it helps unknown torrent classification.

You could use the bayesian classifier when you've already had a bunch of torrent indexed. The more samples you'll have the more accurate it will be.

Please fork it, and use it everywhere you can.

IMPROVEMENTS
------------

+ Improve categorization to support more extensions. Use an API extension/categorization.

Have fun.

@flyersweb
