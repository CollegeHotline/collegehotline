'use strict';
var CHApp = angular.module('collegeHotlineRefactor');
CHApp.controller('SignupCtrl', function ($location, Auth) {

  var vm = this;
  vm.name = 'SignupCtrl';
  vm.user = { 
    username : '',
    email : '', 
    password : '',
    phoneNumber : '',
    firstName : '',
    lastName : ''
  };
  vm.signupError = true;
  vm.emptyRequiredField = false;
  vm.passwordMatch = false;

  vm.checkPassword = function(){
    if(vm.user.username == '' || vm.user.username === undefined ||
       vm.user.phoneNumber == '' || vm.user.phoneNumber === undefined ||
       vm.user.firstName == '' || vm.user.firstName === undefined ||
       vm.user.lastName == '' || vm.user.lastName === undefined ||
       vm.user.email == '' || vm.user.email === undefined ||
       vm.user.phoneNumber == '' || vm.user.phoneNumber === undefined){
      vm.emptyRequiredField = true;
    }
    else{
      vm.emptyRequiredField = false;
    }

    if(vm.user.password !== undefined && vm.user.password != ''){
      if(vm.user.password != vm.user.confirmPassword){
        vm.user.passwordMatch = true;
      }
      else{
        vm.user.passwordMatch = false;
      }
    }

    vm.signupError = vm.emptyRequiredField && vm.passwordMatch;
  }

  vm.signup = function() {
    Auth.signup(vm.user).then(function () {
      $location.path('/');
    }).catch(function (err) {
      console.log(err)
      vm.error = err;
    });
  }
});

