'use strict';
var CHApp = angular.module('collegeHotlineRefactor');
CHApp.controller('LoginCtrl', function ($location, Auth) {

    var vm = this;
    vm.name = 'LoginCtrl';
    vm.user = {username: '', password: ''};
    vm.login = function () {
      Auth.login(vm.user).then(function () {
        $location.path('/');
      }).catch(function (err) {
        vm.error = err;
      });
    }
});
