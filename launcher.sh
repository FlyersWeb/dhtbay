#!/bin/bash

aria2c -q -j 10 --log-level=notice --http-accept-gzip=true --enable-dht --dht-listen-port=6882 --enable-rpc --rpc-allow-origin-all --bt-metadata-only=true --bt-save-metadata=true --bt-stop-timeout=30 --bt-tracker="udp://tracker.publicbt.com:80/announce,udp://tracker.openbittorrent.com:80/announce" --dir=$(pwd)/torrent -l ./logs/aria2c.log &
sleep 10
forever start ./portal/bin/www > ./logs/server.log &
sleep 5
node ./crawlDHT.js > ./logs/crawl.log &
node ./loadDHT.js > ./logs/download.log &
node ./loadTorrent.js > ./logs/indexer.log &
