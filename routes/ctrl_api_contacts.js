var db = require('../config/database.js'),
    uploadDir = require('../config/config.js').uploadDir,
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs');

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

  var query = db.contactModel.remove({_id: id, userId: userId});

  query.remove(function(err) {
    if (err) {
  		console.log(err);
  		return res.sendStatus(400);
  	}
		return res.sendStatus(200);
  });
};

exports.uploadPhoto = function(req, res) {
  console.log(req.body, req.files);
  var files = req.files,
      tmpfile = files.file.path, // path where multipart middleware save
      userId = req.user.id,
      contact = req.body,
      contact_id = contact._id;

  // check if user is owner of this contact id, if so, remove file
  var query = db.contactModel.findOne({_id: contact_id, userId: userId});
  query.exec(function(err, result) {
    if (err) {
  		console.log(err);
  		return res.sendStatus(400);
  	}

    if (!result) {
      return res.sendStatus(400);
    }

    var contact_photo_fname = path.join(uploadDir, contact_id + '.png');

    try {
      mkdirp.sync(uploadDir);

      //TODO: convert image to png, crop, etc

      fs.renameSync(tmpfile, contact_photo_fname);
      res.sendStatus(200);
    } catch (e) {
      res.sendStatus(500);
    }
  });
};

exports.deletePhoto = function(req, res) {
  var id = req.params.id,       // contact id
      userId = req.user.id,
      contact_photo_fname = path.join(uploadDir, id + '.png');

  // check if user is owner of this id, if so, remove file
  var query = db.contactModel.findOne({_id: id, userId: userId});
  query.exec(function(err, result) {
    if (err) {
  		console.log(err);
  		return res.sendStatus(400);
  	}

    if (!result) {
      return res.sendStatus(400);
    }

    try {
      console.log('unlink ' + contact_photo_fname);

      fs.unlinkSync(contact_photo_fname);
    } catch (e) {
      return res.sendStatus(500);
    }

    return res.sendStatus(200);
  });
};
