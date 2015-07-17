var db = require('../config/database.js'),
    jwt = require('jsonwebtoken'),
    tokenManager = require('../config/token_manager.js'),
    config = require('../config/config.js'),
    secretKey = config.secret,
    TOKEN_EXPIRATION = config.TOKEN_EXPIRATION;

exports.register = function(req, res) {
  var username = req.body.username || '',
      password = req.body.password || '';

  if (username === '' || password === '') {
    return res.sendStatus(400);
  }

  // new user
  var user = new db.userModel();
  user.username = username;
  user.password = password;

  user.save(function(err) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};


exports.signin = function(req, res) {
  var username = req.body.username || '',
      password = req.body.password || '';

  if (username === '' || password === '') {
    return res.sendStatus(401);
  }

  db.userModel.findOne({username: username}, function (err, user) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    if (!user) {
      return res.sendStatus(401);
    }

    user.checkPassword(password, function(err, ok) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (!ok) {
        console.log('Attempt failed to login with ' + user.username);
        return res.sendStatus(401);
      }

      var token = jwt.sign({id: user._id},
                           secretKey,
                           { expiresInMinutes: TOKEN_EXPIRATION });

      return res.json({token:token});
    });
  });
};

exports.logout = function(req, res) {
  if (req.user) {
    tokenManager.expireToken(req.headers);

    delete req.user;
    return res.sendStatus(200);
  }
  else {
    return res.sendStatus(401);
  }
};
