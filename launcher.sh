#!/bin/bash

aria2c -q -j 10 --log-level=notice --http-accept-gzip=true --check-certificate=false --follow-torrent=false --enable-dht --dht-listen-port=6882 --enable-rpc --bt-metadata-only=true --bt-save-metadata=true --bt-stop-timeout=40 --bt-tracker="udp://tracker.publicbt.com:80/announce,udp://tracker.openbittorrent.com:80/announce,udp://open.demonii.com:1337/announce" --dir=$(pwd)/torrent -l $HOME/dht-bay/logs/aria2c.log &
sleep 10
node $HOME/dht-bay/crawlDHT.js 2>&1 > $HOME/dht-bay/logs/crawl.log &
node $HOME/dht-bay/loadDHT.js 2>&1 > $HOME/dht-bay/logs/download.log &
