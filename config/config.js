var config = {};

// App root url, used in CORS restrict
config.root_url = process.env.ROOT_URL || 'http://localhost:3000/';

// Get mongo url from environment or use default
config.mongodbURL = process.env.MONGO_URL || 'mongodb://localhost/osvtest';

module.exports = config;
