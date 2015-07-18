var express = require('express'),
    config = require('../config/config.js'),
    secretKey = config.secret,
    jwt = require('express-jwt'),
    tokenManager = require('../config/token_manager.js'),
    userRoute = require('./ctrl_api_user.js'),
    contactRoute = require('./ctrl_api_contacts.js'),
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

router.
  // new user
  post('/user/register', userRoute.register).

  // sign in. Fields: "token"
  post('/user/signin',   userRoute.signin).

  // remove saved token if signed in
  get('/user/logout',    jwt({secret: secretKey}), userRoute.logout);

router.
  // create new contact
  post('/contacts',      jwt({secret: secretKey}), tokenManager.verifyToken, contactRoute.create).

  // get array of contatcs. Fields: _id, firstName, surName
  get('/contacts',       jwt({secret: secretKey}), tokenManager.verifyToken, contactRoute.list).

  // Get contact by id
  get('/contacts/:id',   jwt({secret: secretKey}), tokenManager.verifyToken, contactRoute.read).

  // Update contact by id
  put('/contacts',       jwt({secret: secretKey}), tokenManager.verifyToken, contactRoute.update);

module.exports = router;
