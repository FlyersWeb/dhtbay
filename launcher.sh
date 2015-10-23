#!/bin/bash

aria2c -q -j 10 --log-level=notice --http-accept-gzip=true --check-certificate=false --follow-torrent=false --enable-rpc --dir=$(pwd)/torrent -l $HOME/dht-bay/logs/aria2c.log &
sleep 10
forever start -m 10 -o $HOME/dht-bay/logs/crawl.log -e $HOME/dht-bay/logs/crawl.log $HOME/dht-bay/crawlDHT.js
forever start -m 10 -o $HOME/dht-bay/logs/download.log -e $HOME/dht-bay/logs/download.log $HOME/dht-bay/loadDHT.js
