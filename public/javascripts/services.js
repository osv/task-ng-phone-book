var REST_URL = ''; // maybe need it to be configurable ex.: 'http://localhost:3000';

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
          $location.path('/');
        },

        logout: function() {
          delete $window.localStorage.token;
          delete $window.localStorage.username;
          $location.path('/login');
        },
      };

      return auth;
    }])

  .factory('UserService', ['$http', function ($http) {
    return {
      signIn: function(username, password) {
        return $http.post(REST_URL + '/api/user/signin', {username: username, password: password});
      },

      logOut: function() {
        return $http.get(REST_URL + '/api/user/logout');
      },

      register: function(username, password) {
        return $http.post(REST_URL + '/api/user/register', {username: username, password: password});
      }
    };
  }]);
