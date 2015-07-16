angular.module('appServices', [])
  .factory('AuthenticationService', [
    '$window', '$location',
    function($window, $location) {
      var auth = {
        getUserName: function() {
          return $window.localStorage.username; },

        isAuthenticated: function() { return $window.localStorage.token; },

        login: function(username, token) {
          $window.localStorage.token = token;
          $window.localStorage.username = username;
        },

        logout: function() {
          delete $window.localStorage.token;
          delete $window.localStorage.username;
          $location.path("/login");
        },
      };

      return auth;
    }]);
