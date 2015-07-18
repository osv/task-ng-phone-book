var db = require('../config/database.js'),
    mongoose = require('mongoose');

exports.create = function(req, res) {
  console.log('>>> create', req.body);

  var user = req.user;        // user is restored from jwt sign
  if (! user) {
    return res.sendStatus(401);
  }

  var contact = req.body.contact;

  if (contact.firstName == null) {
    return res.sendStatus(400);
  }

  var newContact = new db.contactModel();

  newContact.userId = user.id; // owner of contact
  newContact.firstName = contact.firstName;
  newContact.surName = contact.surName;
  newContact.phone = contact.phone;
  newContact.comment = contact.comment;

  newContact.save(function(err) {
    if (err) {
      console.log(err);
      return res.sendStatus(400);
    }
    console.log('ok');

    return res.sendStatus(200);
  });
};

exports.list = function(req, res) {
  var user = req.user;
  if (! user) {
    return res.sendStatus(401);
  }

  var userId = user.id,
      query = db.contactModel.find({userId: userId});

  query.select('_id firstName surName');
  query.sort('-created');
  query.exec(function(err, results) {
    if (err) {
      console.log(err);
      return res.sendStatus(400);
    }
    return res.json(200, results);
  });
};
