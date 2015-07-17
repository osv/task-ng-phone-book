angular.module('app').

  controller('loginCtrl', [
    '$scope', 'AuthenticationService',
    function($scope, AuthenticationService) {
      $scope.username = '';

      $scope.signIn = function(username, password) {
        // TODO: Api call
        AuthenticationService.login(username, 'abcdef');
        toastr.success('Wellcome back, ' + AuthenticationService.getUserName());
      };

      $scope.signUp = function(username, password) {
        // TODO: API call
        AuthenticationService.login(username, 'abcdef');

      };

      $scope.logOut = function() {
        AuthenticationService.logout();
      };

      $scope.isSignedIn = function() {
        $scope.username = AuthenticationService.getUserName();
        return AuthenticationService.isAuthenticated();
      };
    }]);
