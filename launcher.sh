#!/bin/bash

PROJPATH=$HOME/dht-bay
LOGPATH=$PROJPATH/logs

aria2c -q -j 10 --log-level=notice --http-accept-gzip=true --check-certificate=false --follow-torrent=false --enable-rpc --dir=$(pwd)/torrent -l $LOGPATH/aria2c.log &
sleep 10
forever start -m 0 -o $LOGPATH/crawl.log -e $LOGPATH/crawl.log $PROJPATH/crawlDHT.js
forever start -m 0 -o $LOGPATH/download.log -e $LOGPATH/download.log $PROJPATH/loadDHT.js
