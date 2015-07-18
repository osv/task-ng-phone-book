var db = require('../config/database.js'),
    uploadDir = require('../config/config.js').uploadDir,
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs');

// create contact, cb is called with mongoose saved data
var create_contact =  function(contact, cb) {
  var newContact = new db.contactModel();

  newContact.userId = contact.userId;
  newContact.firstName = contact.firstName;
  newContact.surName = contact.surName;
  newContact.phone = contact.phone;
  newContact.photo = contact.photo;
  newContact.comment = contact.comment;

  newContact.save(function(err, data) {
    if (err) {
      console.log(err);
      return cb(new Error());
    }
    cb(null, data);
  });
};

exports.create = function(req, res) {

  var userId = req.user.id,        // user is restored from jwt sign
      contact = req.body.contact;

  if (contact.firstName == null) {
    return res.sendStatus(400);
  }

  contact.userId = userId;      // set owner of this contact

  create_contact(contact, function(err) {
    if (err) {
      return res.sendStatus(500);
    }
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
  var id = req.params.id,
      userId = req.user.id;

  if (!id) {
    return res.sendStatus(400);
  }

  var query = db.contactModel.findOne({_id: id, userId: userId});
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
  });
};

exports.update = function(req, res) {
  var contact = req.body.contact,
      userId = req.user.id;

  if (!contact || contact.firstName == null) {
    return res.sendStatus(400);
  }

  contact.updated = new Date();

  db.contactModel.findOneAndUpdate({_id: contact._id, userId: userId}, contact, function(err) {
    if (err) {
  		console.log(err);
  		return res.sendStatus(400);
  	}
		return res.sendStatus(200);
	});
};

exports.delete = function(req, res) {
  var userId = req.user.id,
      id = req.params.id;

  if (!id) {
    res.sendStatus(400);
  }


  db.contactModel.findOneAndRemove({_id: id, userId: userId}, function(err, contact) {
    if (err) {
      return res.sendStatus(500);
    }

    try {
      var file_name = contact.photo,
          contact_photo_fname = path.join(uploadDir, file_name);

      fs.unlinkSync(contact_photo_fname);
    } catch (e) {}

    return res.sendStatus(200);
  });
};

// upload and return contact entity
exports.uploadPhoto = function(req, res) {
  var files = req.files,
      tmpfile = files.file.path, // path where multipart middleware save
      userId = req.user.id,
      contact = req.body,
      contact_id = contact._id,
      random_file = '' + (+ new Date()) + (Math.random() * 99999999).toFixed(),
      new_contact_photo = random_file + '.png',
      new_photo_path = path.join(uploadDir, new_contact_photo);

  // save file
  try {
    mkdirp.sync(uploadDir);

    //TODO: convert image to png, crop, etc

    fs.renameSync(tmpfile, new_photo_path);
  } catch (e) {
    return res.sendStatus(500);
  }

  // now save in database contact.photo

  if (! contact_id) {
    // if no "_id" then need to create new contact

    contact.userId = userId;
    contact.photo = new_contact_photo;
    create_contact(contact, function(err, newContact) {
      if (err) {
        // remove saved file
        try { fs.unlinkSync(new_contact_photo); } catch(e) {}
        return res.sendStatus(500);
      } else {
        return res.json(200, {_id: newContact._id, photo: new_contact_photo, isNew: true});
      }
    });

  } else {
    // if exist _id, update contact.photo
    var old_photo = contact.photo,
        query = {_id: contact_id, userId: userId},
        modifier = {$set: {photo: new_contact_photo}},
        options = {};

    db.contactModel.update(query,
                           modifier,
                           options,
                           function(err, data) {
                             if (err || ! data.nModified) {
                               // unlink new file if err or no updated
                               try { fs.unlinkSync(new_photo_path); } catch(e) {}
                               return res.sendStatus(500);
                             }
                             // saved, now unlink old
                             try {
                               if (old_photo) {
                                 var old_photo_path = path.join(uploadDir, old_photo);
                                 fs.unlinkSync(old_photo_path);
                               }
                             } catch(e) {}

                             return res.json(200,
                                             {_id: contact_id, photo: new_contact_photo});
                           });
  }
};

exports.deletePhoto = function(req, res) {
  var id = req.params.id,       // contact id
      userId = req.user.id;

  // check if user is owner of this id, if so, remove file
  var query = db.contactModel.findOne({_id: id, userId: userId});
  query.select('photo');
  query.exec(function(err, contact) {
    if (err) {
  		return res.sendStatus(400);
  	}

    if (!contact) {
      return res.sendStatus(400);
    }

    try {
      var file_name = contact.photo,
          contact_photo_fname = path.join(uploadDir, file_name);

      fs.unlinkSync(contact_photo_fname);
    } catch (e) {
      return res.sendStatus(500);
    }

    return res.sendStatus(200);
  });
};
