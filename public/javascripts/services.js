angular.module('appServices', [])
  .factory('AuthenticationService', [
    '$window', '$location',
    function($window, $location) {
      var is_authenticated = false;
      var user_name = '';
      var auth = {
        getUserName: function() { return user_name; },

        isAuthenticated: function() { return is_authenticated; },

        login: function(username, token) {
          is_authenticated = true;
          user_name = username;
          $window.sessionStorage.token = token;
        },

        logout: function() {
          is_authenticated = false;
          delete $window.sessionStorage.token;
          $location.path("/login");
        },
      };

      return auth;
    }]);
