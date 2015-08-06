var express = require('express'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    config = require('../config/config.js'),
    secretKey = config.secret,
    jwt = require('express-jwt')({secret: secretKey}),
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
  get('/user/logout',    jwt, userRoute.logout);

router.
  // create new contact
  post('/contacts',      jwt, tokenManager.verifyToken, contactRoute.create).

  // get array of contatcs. Fields: _id, firstName, surName
  get('/contacts',       jwt, tokenManager.verifyToken, contactRoute.list).

  // Get contact by id
  get('/contacts/:id',   jwt, tokenManager.verifyToken, contactRoute.read).

  // Update contact
  put('/contacts/:id',   jwt, tokenManager.verifyToken, contactRoute.update).

  // remove contact by id
  delete('/contacts/:id', jwt, tokenManager.verifyToken, contactRoute.delete);

router.
  // upload image. body - contact object. return _id, photo, isNew - true if new created contact
  post('/upload', jwt, tokenManager.verifyToken,
       multipartMiddleware, contactRoute.uploadPhoto).

  delete('/upload/:id', jwt, tokenManager.verifyToken,
         contactRoute.deletePhoto);

module.exports = router;
