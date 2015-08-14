var REST_URL = ''; // maybe need it to be configurable ex.: 'http://localhost:3000';

angular.module('appServices', [])
  .factory('AuthenticationService', [
    '$window', '$injector',
    function($window, $injector) {
      var $rootScope = $injector.get('$rootScope');

      var getToken = function() {
        return $window.localStorage.token;
      };

      var auth = {
        getUserName: function() {
          return $window.localStorage.username; },

        isAuthenticated: function() { return !!getToken(); },

        token: getToken,

        login: function(username, token) {
          $window.localStorage.token = token;
          $window.localStorage.username = username;
          $rootScope.$state.go('home');
        },

        logout: function() {
          delete $window.localStorage.token;
          delete $window.localStorage.username;
          $rootScope.$state.go('login');
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
  }])

  .factory('TokenInterceptor', [
    '$q', 'AuthenticationService',
    function ($q, AuthenticationService) {
      return {
        // Add Authorization header if user signed in
        request: function (config) {
          config.headers = config.headers || {};
          if (AuthenticationService.isAuthenticated()) {
            config.headers.Authorization = 'Bearer ' + AuthenticationService.token();
          }
          return config;
        },

        // Revoke client authentication if 401 is received
        responseError: function(rejection) {
          if (rejection != null && rejection.status === 401) {
            AuthenticationService.logout();
          }

          return $q.reject(rejection);
        }
      };
    }])

  .factory('Contacts', [
    '$resource',
    function($resource) {
      return $resource(REST_URL + '/api/contacts/:id', {}, {
        update: {
          method: 'PUT'
        }});
    }
  ])

  .factory('UploadsService', [
    '$http', 'Upload',
    function($http, Upload) {
      return {
        removePhoto: function(id) {
          return $http['delete'](REST_URL + '/api/upload/' + id);
        },

        uploadPhoto: function(file, contact) {
          return Upload.upload({
            url: '/api/upload',
            fields: contact,
            file: file
          });
        }
      };
    }
  ])

// used in "catch" of promise to log error
  .factory('promiseLogError', [
    'toastr',
    function(toastr) {
        return function(error) {
          var status = error.status,
              message = error.statusText;

          toastr.error('<b>' + status + '</b> ' + message);
          console.warn(status, message);
        };
    }]);
