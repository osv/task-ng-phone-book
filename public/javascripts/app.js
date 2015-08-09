'use strict';
/* global toastr:false */

angular.module('app', ['ngRoute', 'appServices', 'ngFileUpload'])
  .constant('toastr', toastr)

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: '/partials/login.form.html',
        controller: 'loginCtrl'
      }).
      when('/signUp', {
        templateUrl: '/partials/signup.form.html',
        controller: 'loginCtrl'
      }).
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'contactCtrl',
        access: { requiredAuthentication: true }
      });
  }])

  .config(['toastr', function(toastr) {
    /* global toastr:false, moment:false */
    $.extend(toastr.options, {
      progressBar: true,
    });
  }])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
  }])

  .filter('formatContact', function() {
    return function(contact) {
      var firstName = contact.firstName,
          secondName = contact.surName || '';
      return firstName + ' ' + secondName;
    };
  })

  .run(['$rootScope', '$location', '$window', 'AuthenticationService',
       function($rootScope, $location, $window, AuthenticationService) {
         $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
           // Redirect to login page if our authservice (isAuthenticated) is false and no token
           if (nextRoute != null && nextRoute.access != null &&
               nextRoute.access.requiredAuthentication &&
               !AuthenticationService.isAuthenticated()) {

             console.log('Auth required, Redirect to login page');
             $location.path('/login');
           }
         });
       }]);
