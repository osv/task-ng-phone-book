'use strict';
/* global toastr:false */

angular.module('app', ['ui.router', 'ngResource', 'appServices', 'ngFileUpload'])
  .constant('toastr', toastr)

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.
      state('login', {
        url: '/login',
        templateUrl: '/partials/login.form.html',
        controller: 'loginCtrl'
      }).
      state('signUp', {
        url: '/signUp',
        templateUrl: '/partials/signup.form.html',
        controller: 'loginCtrl'
      }).
      state('home', {
        url: '/',
        templateUrl: '/partials/main.html',
        controller: 'contactCtrl',
        resolve: { authenticate: authenticate }
      });

    $urlRouterProvider.otherwise('/');

    // http://stackoverflow.com/a/20230786
    function authenticate($q, AuthenticationService, $state, $timeout) {

      if (AuthenticationService.isAuthenticated()) {
        // Resolve the promise successfully
        return $q.when();
      } else {
        // The next bit of code is asynchronously tricky.
        console.log('Auth required, Redirect to login page');

        $timeout(function() {
          // This code runs after the authentication promise has been rejected.
          // Go to the log-in page
          $state.go('login');
        });

        // Reject the authentication promise to prevent the state from loading
        return $q.reject();
      }
    }

    // I know, here no minification, but want make it good for minification
    authenticate.$inject = ['$q', 'AuthenticationService', '$state', '$timeout'];
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

  .run([
    '$rootScope', '$state',
    function($rootScope, $state) {
      // I prefer keep in root scope state
      // $stateParam good to keep too, but here no parammed routes
      $rootScope.$state = $state;
  }]);
