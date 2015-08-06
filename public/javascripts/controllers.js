angular.module('app').

  controller('loginCtrl', [
    '$scope', '$location', 'AuthenticationService', 'UserService',
    function($scope, $location, AuthenticationService, UserService) {
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
    '$scope', 'UploadsService', 'Contacts',
    function($scope, UploadsService, Contacts) {
      $scope.contacts = [];

      // promise for fetch contact list, we reuse it later in this controller
      var fetchContacts = function() {
        return Contacts.query().$promise
        .then(function(res) {
          $scope.contacts = res;
          console.log(res);
        })
        .catch(promiseLogError);
      };

      fetchContacts();

      // on selecect from contact list: fetch full contact data
      $scope.select = function(id) {
        var updateContactFields = function(res) {
            var contact = res;
            $scope.contact = contact;
        };

        Contacts.get({id: id})
          .$promise
          .then(updateContactFields)
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

        var clearContacts = function() {
          $scope.contact = {}; // clear model, TODO: maybe select first contact?
          toastr.info('Contact removed: ' + contact.firstName);
        };

        Contacts.remove({id: contact._id}).$promise
          .then(fetchContacts)
          .then(clearContacts)
          .catch(promiseLogError);
      };

      $scope.isSelected = function(contact) {
        return $scope.contact && $scope.contact._id === contact._id;
      };

      $scope.isNew = function() {
        return ! ($scope.contact && $scope.contact.hasOwnProperty('_id'));
      };

      $scope.saveContact = function() {
        var contact = $scope.contact,
            $id = contact._id;

        // Update or create contact depend in existing "_id" property of contact
        if ($id) {
          var showMessage = function() {
              toastr.success('Updated contact of ' + contact.firstName);
          };

          Contacts.update({id: $id}, contact).$promise
            .then(fetchContacts)
            .then(showMessage)
            .catch(promiseLogError);
        } else {

          var showMessage = function() {
              $scope.contact = {};              // clear model
              toastr.success('Contact "' + contact.firstName + '" saved');
          };

          Contacts.save(contact).$promise
            .then(fetchContacts)
            .then(showMessage)
            .catch(promiseLogError);
        }
      };

      $scope.upload = function(files) {
        var file = files[0],
            contact = $scope.contact;

        if (! file || ! contact || ! contact.firstName) {
          return;
        }

        UploadsService.uploadPhoto(file, contact)
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
          UploadsService.removePhoto(contact._id)
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
