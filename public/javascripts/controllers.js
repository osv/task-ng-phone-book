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

      ContactService.list()
        .then(function(res) {
          $scope.contacts = res.data;
          console.log(res.data);
        })
        .catch(promiseLogError);

      // on selecect from contact list: fetch full contact data
      $scope.select = function(id) {
        $scope.selectedContact = id;
        ContactService.read(id)
          .then(function(res) {
            $scope.contact = res.data;
          })
          .catch(promiseLogError);
      };

      $scope.isSelected = function(contact) {
        return $scope.selectedContact === contact._id;
      };

      $scope.saveContact = function() {
        var contact = $scope.contact;

        ContactService
          .create(contact)
          .then(function() {
            toastr.success('Contact "' + contact.firstName + '" saved');
            $scope.contact = {};
          })
          .catch(promiseLogError);
      };
    }
  ]);
