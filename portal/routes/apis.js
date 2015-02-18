var express = require('express');
var router = express.Router();

var Torrent = require('./../../models/Torrent.js');

/* GET torrent listing. */
router.get('/list/:limit/:skip', function(req, res, next) {

  var limit = req.params.limit;
  var skip = req.params.skip;

  Torrent.find().sort('-added').limit(limit).skip(skip).lean().exec(function(err,torrents){
     if(err) {
        next(err);
        return;
     }
     res.json(torrents);
  });
});


router.get('/count', function(req, res, ext) {
  Torrent.find().count(function(err, count) {
    res.json(count);
  });
});

module.exports = router;

