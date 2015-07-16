angular.module('appServices', [])
  .factory('AuthenticationService', function() {
    var isAuthenticated = false;
    var auth = {
      isAuthenticated: function() { return isAuthenticated; },
      login: function() { isAuthenticated = true; },
      logout: function() { isAuthenticated = false; },
    };

    return auth;
  });
