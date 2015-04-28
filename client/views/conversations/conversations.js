'use strict';

angular.module('collegeHotlineRefactor')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/conversations', {
        templateUrl: 'views/conversations/conversations.html',
        controller: 'ConversationsCtrl',
        controllerAs: 'vm'
      });
  });
