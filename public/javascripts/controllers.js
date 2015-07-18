angular.module('app').

  controller('loginCtrl', [
    '$scope', '$location', 'AuthenticationService', 'UserService',
    function($scope, $location, AuthenticationService, UserService) {
      $scope.signIn = function(username, password) {

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
    '$scope', 'ContactService',
    function($scope, ContactService) {
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
//        $scope.selectedContact = id;
        ContactService.read(id)
          .then(function(res) {
            $scope.contact = res.data;
          })
          .catch(promiseLogError);
      };

      // clear current "contact" model
      $scope.new = function() {
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
    }
  ]);
