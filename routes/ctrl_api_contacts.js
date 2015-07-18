var db = require('../config/database.js'),
    mongoose = require('mongoose');

exports.create = function(req, res) {

  var user = req.user,        // user is restored from jwt sign
      contact = req.body.contact;

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
  var user = req.user,
      userId = user.id,
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

exports.read = function(req, res) {
  var id = req.params.id;

  if (!id) {
    return res.sendStatus(400);
  }

  var query = db.contactModel.findOne({_id: id});
  query.exec(function(err, result) {
    if (err) {
  		console.log(err);
  		return res.sendStatus(400);
  	}

    if (result) {
      return res.json(200, result);
    } else {
  		return res.sendStatus(400);
    }
  })
}
