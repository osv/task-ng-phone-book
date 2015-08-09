angular.module('app').

  controller('loginCtrl', [
    '$scope', '$location', 'AuthenticationService', 'UserService', 'toastr', 'promiseLogError',
    function($scope, $location, AuthenticationService, UserService, toastr, promiseLogError) {
      $scope.signIn = function() {
        var username = $('#inputUsername').val(),
            password = $('#inputPassword').val();

        UserService.signIn(username, password)
          .then(function(res) {
            var token = res.data.token;
            // save token and username
            AuthenticationService.login(username, token);
            // popup info box
            toastr.success('Wellcome back, ' + AuthenticationService.getUserName());
          })
          .catch(promiseLogError);
      };

      $scope.signUp = function(username, password) {
        if (! AuthenticationService.isAuthenticated()) {
          UserService.register(username, password)
            .then(function() {
              return UserService.signIn(username, password);
            })
            .then(function(res) {
              var token = res.data.token;
              AuthenticationService.login(username, token);
              toastr.success('Hello, ' + username);
            })
            .catch(promiseLogError);
        }
      };

      $scope.logOut = function() {
        if (AuthenticationService.isAuthenticated()) {
          UserService.logOut()
            .finally(function() {
              AuthenticationService.logout();
          });
        }
      };

      $scope.isSignedIn = function() {
        $scope.username = AuthenticationService.getUserName();
        return AuthenticationService.isAuthenticated();
      };
    }])

  .controller('contactCtrl', [
    '$scope', 'ContactService', 'toastr', 'promiseLogError',
    function($scope, ContactService, toastr, promiseLogError) {
      $scope.contacts = [];

      // promise for fetch contact list, we reuse it later in this controller
      var fetchContacts = function() {
        return ContactService.list()
        .then(function(res) {
          $scope.contacts = res.data;
          console.log(res.data);
        })
        .catch(promiseLogError);
      };

      fetchContacts();

      // on selecect from contact list: fetch full contact data
      $scope.select = function(id) {
        ContactService.read(id)
          .then(function(res) {
            var contact = res.data;
            $scope.contact = contact;
          })
          .catch(promiseLogError);
      };

      // clear current "contact" model
      $scope.create = function() {
        $scope.contact = {};
      };

      $scope.removeSelected = function() {
        var contact = $scope.contact;

        if (! contact || ! contact._id) {
          return;
        }

        ContactService.remove(contact._id)
          .then(fetchContacts)
          .then(function() {
            $scope.contact = {}; // clear model, TODO: maybe select first contact?
            toastr.info('Contact removed: ' + contact.firstName);
          })
          .catch(promiseLogError);
      };

      $scope.isSelected = function(contact) {
        return $scope.contact && $scope.contact._id === contact._id;
      };

      $scope.isNew = function() {
        return ! ($scope.contact && $scope.contact.hasOwnProperty('_id'));
      };
      $scope.saveContact = function() {
        var contact = $scope.contact;

        // Update or create contact depend in existing "_id" property of contact
        if (contact._id) {
          ContactService.update(contact)
            .then(fetchContacts)
            .then(function() {
              toastr.success('Updated contact of ' + contact.firstName);
            })
            .catch(promiseLogError);
        } else {
          ContactService.create(contact)
            .then(fetchContacts)
            .then(function(res) {
              $scope.contact = {};              // clear model
              toastr.success('Contact "' + contact.firstName + '" saved');
            })
            .catch(promiseLogError);
        }
      };

      $scope.upload = function(files) {
        var file = files[0],
            contact = $scope.contact;

        if (! file || ! contact || ! contact.firstName) {
          return;
        }

        ContactService.uploadPhoto(file, contact)
          .then(function(res) {

            // update current contact with new retrieved data
            var data = res.data;
            $scope.contact._id = data._id;
            $scope.contact.photo = data.photo;

            if (data.isNew) {
              toastr.success('Photo uploaded and saved contact');
            } else {
              toastr.success('Photo uploaded');
            }

          })
          .then(fetchContacts)
          .catch(promiseLogError);
      };

      $scope.removePhoto = function() {
        var contact = $scope.contact;
        if (contact && contact._id) {
          ContactService.removePhoto(contact._id)
            .then(function() {
              $scope.contact.photo = '';
              toastr.info('Photo removed');
            })
            .catch(promiseLogError);
        }
      };

      // can upload only if firstName not empty because it required on create contact
      $scope.canUpload = function() {
        return ! ($scope.contact && $scope.contact.firstName && $scope.contact.firstName.length);
      };

      // if not set "photo" property of contact than cant remove uploaded photo
      $scope.canRemoveUpload = function() {
        return ! ($scope.contact && $scope.contact.photo && $scope.contact.photo.length);
      };
    }
  ]);
