var express = require('express'),
    config = require('../config/config.js'),
    router = express.Router();

// Prepare REST (CORS)
router.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', config.root_url);
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' === req.method) return res.send(200);
  next();
});

module.exports = router;
