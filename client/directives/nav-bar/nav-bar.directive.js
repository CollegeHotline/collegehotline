'use strict';

angular.module('collegeHotlineRefactor')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/nav-bar/nav-bar.html'
    };
  });
