var mongoose = require('mongoose'),
    config = require('./config.js'),
    mongodbURL = config.mongodbURL,
    mongodbOptions = { };

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

User.index({ username: 1 });

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

Contact.index({ userId: 1, created: -1 });

// Models
var userModel = mongoose.model('User', User);
var contactModel = mongoose.model('Post', Contact);

exports.userModel = userModel;
exports.contactModel = contactModel;
