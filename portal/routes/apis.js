var express = require('express');
var router = express.Router();

var Torrent = require('./../../models/Torrent.js');

/* GET torrent listing. */
router.get('/list', function(req, res, next) {

  var dayBefore = new Date();
  dayBefore.setHours(dayBefore.getHours() - 12);

  Torrent.find({added:{$gte:dayBefore}}).limit(20).sort('-added').lean().exec(function(err,torrents){
     if(err) {
        next(err);
        return;
     }
     res.json(torrents);
  });
});

module.exports = router;

