var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    config = require('./config.js'),
    mongodbURL = config.mongodbURL,
    mongodbOptions = { };

var SALT_FACTOR = 10;

mongoose.connect(mongodbURL, mongodbOptions, function (err) {
  if (err) {
    console.log('Connection refused to ' + mongodbURL);
    console.log(err);
  } else {
    console.log('Connection successful to: ' + mongodbURL);
  }
});

var Schema = mongoose.Schema;

var User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now }
}, {
  autoIndex: false });

var Contact = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true}, // ref to user
  firstName: { type: String, required: true },
  surName: {type: String, required: true},
  phone: {type: String, required: true},
  content: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
},{
  autoIndex: false });

User.index({ username: 1 });
Contact.index({ userId: 1, created: -1 });

User.pre('save', function(cb) {
  var user = this;
  if (!user.isModified('password')) return cb();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return cb(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return cb(err);
      user.password = hash;
      cb();
    });
  });
});

User.methods = {
  checkPassword: function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  },
};

// Models
var userModel = mongoose.model('User', User);
var contactModel = mongoose.model('Post', Contact);

exports.userModel = userModel;
exports.contactModel = contactModel;
