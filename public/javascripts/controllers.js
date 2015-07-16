angular.module('app').

  controller('loginCtrl', [
    '$scope', 'AuthenticationService',
    function($scope, AuthenticationService) {
      $scope.signIn = function(username, password) {
        // TODO: Api call
        AuthenticationService.login(username, 'abcdef');
        console.log('sign in', AuthenticationService.getUserName());
      };

      $scope.signUp = function(username, password) {
        // TODO: API call
        AuthenticationService.login(username, 'abcdef');
      };

    }]).

  controller('navBarCtrl', [
    '$scope', 'AuthenticationService',
    function($scope, AuthenticationService) {
      $scope.signedIn = function() {
        $scope.username = AuthenticationService.getUserName();
        return AuthenticationService.isAuthenticated();
      };

      $scope.logOut = function() {
        AuthenticationService.logout();
      };

    }]);
