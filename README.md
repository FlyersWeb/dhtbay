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

#### Install bitcannon

See bitcannon repository for this : https://github.com/Stephen304/bitcannon. 
You could use my fork in order to be able to see torrent files : https://github.com/FlyersWeb/bitcannon

#### Install dependencies

```
npm install
```

#### Cron to install

Some tasks can be added in a cron treatment. For example this is my CRON configuration :

```
# Categorize only once a day
30 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/categorize.js >> /home/dhtcrawl/log/categorize.log
# Load torrent metadata to database each 30 minutes and remove them
*/30 * * * * /usr/local/bin/node /home/dhtcrawl/dht-bay/loadTorrent.js >> /home/dhtcrawl/log/load.log
```

#### Launch the launcher

```
sh launcher.sh
```

You'll have your DHT Crawler up and running. Access bitcannon portal at address you defined. Crawling may take some time so be patient.


CONTENT
-------

The project is composed of 4 modules as presented. Each module is independant and can be used separately without problem.

+  **crawlDHT.js** is responsible for crawling hashs from the DHT network. It will push hashes on a redis list called *DHTS*. It also provides a routing table backup system saving it each 10 minutes in a mongo collection called table.
+  **loadDHT.js** is responsible of loading hashes from the redis list *DHTS* and to download torrent metadat for indexation. It rely intensely on *aria2* tool and tray to download it from torcache, torrage and through DHT.
+  **loadTorrent.js** is responsible of saving metadatas into our mongo instance in collection torrents. This will be our basis data.
+  **catgorize.js** will try to categorize crawled torrent depending on file extensions. This module could be improved a lot but it allows you to navigate easily in bitcannon.

Using the **launcher.sh**, all modules will be executed and your database will be populated automatically.

Please fork it, and use it everywhere you can.

IMPROVEMENTS
------------

+ Add a seed/leech crawler to know which torrent is dead or not.
+ Improve categorization to support more extensions.
+ Use deep learning for categorization optimization.

Have fun.

@flyersweb
