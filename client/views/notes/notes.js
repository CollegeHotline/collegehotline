'use strict';

angular.module('collegeHotlineRefactor')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/notes', {
        templateUrl: 'views/notes/notes.html',
        controller: 'NotesCtrl',
        controllerAs: 'vm'
      });
  });
