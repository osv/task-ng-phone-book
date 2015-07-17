/*
 * Use memory-cache package for storing token
*/

var cache = require('memory-cache'),
    TOKEN_EXPIRATION = require('./config.js').TOKEN_EXPIRATION,
    TOKEN_EXPIRATION_MILSEC = TOKEN_EXPIRATION * 60 * 100;

var getTokenFromHeader = function(headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization,
		    parts = authorization.split(/\s+/),
        token = parts[1] || null;

    return token;
  }
  return null;
};

// Use this in routes when need check user authorization
exports.verifyToken = function (req, res, next) {
	var token = getTokenFromHeader(req.headers);

	var t = cache.get(token);
  if (t) {
    next();
  } else {
    res.send(401);
  }
};

// Save token in memory.
// Token is expirable by config.TOKEN_EXPIRATION time in minutes
exports.expireToken = function(headers) {
	var token = getTokenFromHeader(headers);

	if (token) {
		cache.put(token, true, TOKEN_EXPIRATION_MILSEC);
	}
};
