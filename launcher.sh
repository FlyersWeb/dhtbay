#!/bin/bash

aria2c -q -j 10 --enable-dht --dht-listen-port=6882 --enable-rpc --rpc-listen-all=true --rpc-allow-origin-all --bt-metadata-only=true --bt-save-metadata=true --bt-stop-timeout=30 --bt-tracker="udp://tracker.publicbt.com:80/announce,udp://tracker.openbittorrent.com:80/announce" --dir=$(pwd)/torrent -l ./logs/aria2c.log &
sleep 10
node ./loadDHT.js 2>1 > ./logs/download.log &
node ./crawlDHT.js 2>1 > ./logs/crawl.log &
node ./loadTorrent.js 2>1 > ./logs/store.log &
