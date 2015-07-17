var config = {};

// App root url, used in CORS restrict
config.root_url = process.env.ROOT_URL || 'http://localhost:3000/';

// Get mongo url from environment or use default
config.mongodbURL = process.env.MONGO_URL || 'mongodb://localhost/osvtest';

// secret key for json web token signing
var secret = process.env.SECRET;
if (!secret) {
  config.secret = 'muam4weawoe3exee8eer4eegief1faefaic3eeb1jah7eejee4';
  console.warn('Using default secret, you need to set env variable "SECRET"');
}

module.exports = config;
