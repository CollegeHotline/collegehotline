'use strict';

angular.module('collegeHotlineRefactor')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'views/about/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'vm'
      });
  });
