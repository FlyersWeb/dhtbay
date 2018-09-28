#!/bin/bash

docker exec -i mongo  mongoexport --db bitcannon --collection torrents --type=csv --fields _id,title,category,details,size,files,imported,lastmod --out /export.csv
docker cp mongo:/export.csv .
