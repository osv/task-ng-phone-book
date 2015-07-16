'use strict';

angular.module('app', ['ngRoute', 'appServices']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: '/partials/login.form.html',
        controller: 'loginCtrl'
      }).
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'loginCtrl',
        access: { requiredAuthentication: true }
      });
  }]).
  run(['$rootScope', '$location', '$window', 'AuthenticationService',
       function($rootScope, $location, $window, AuthenticationService) {
         $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
           // Redirect to login page if our authservice (isAuthenticated) is false and no token
           if (nextRoute != null && nextRoute.access != null &&
               nextRoute.access.requiredAuthentication &&
               !AuthenticationService.isAuthenticated() && !$window.sessionStorage.token) {

             console.log('Auth required, Redirect to login page');
             $location.path('/login');
           }
         });
       }]);
