var express = require('express');
var router = express.Router();

var Torrent = require('./../../models/Torrent.js');

/* GET users listing. */
router.get('/list', function(req, res, next) {

  Torrent.find().lean().exec(function(err,torrents){
     res.json(torrents);
  });

});

module.exports = router;

