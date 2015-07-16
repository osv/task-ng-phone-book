angular.module('app').

  controller('loginCtrl', ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {
    // remove later, now for testing only
    AuthenticationService.login();
  }]).

  controller('navBarCtrl', ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {
    $scope.signedIn = function() {
      return AuthenticationService.isAuthenticated();
    };
  }]);
