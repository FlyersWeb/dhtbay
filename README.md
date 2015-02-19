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

#### Install forever

```
sudo npm install -g forever
```

#### Install dependencies

```
npm install
```

#### Launch the launcher

```
sh launcher.sh
```

You'll have your DHT Crawler up and running. Access portal at http://127.0.0.1:3000/. Crawling may take some time so be patient.


CONTENT
-------

The project is composed of 4 modules as presented. Each module is independant and can be used separately without problem.

+  **crawlDHT.js** is responsible for crawling hashs from the DHT network. It will push hashes on a redis list called *DHTS*. It also provides a routing table backup system saving it each 10 minutes in a mongo collection called table.
+  **loadDHT.js** is responsible of loading hashes from the redis list *DHTS* and to download torrent metadat for indexation. It rely intensely on *aria2* tool and tray to download it from torcache, torrage and through DHT.
+  **loadTorrent.js** is responsible of saving metadatas into our mongo instance in collection torrents. This will be our basis data.
+  **portal** contains an express instance and is our web portal for data access. Could be greatly improved, some help is welcome.

Using the **launcher.sh**, all modules will be executed and your database will be populated automatically.

Please fork it, and use it everywhere you can.

@flyersweb
