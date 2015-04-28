'use strict';

angular.module('collegeHotlineRefactor').controller('NotesCtrl', function ($scope, $resource, Auth) {

    
	var NotesBasic = $resource('/api/note/basic');
	var NotesBasicCreate = $resource('/api/note/basic/create');
	var NotesBasicUpdate = $resource('/api/note/basic/update'); 
	var NotesBasicUpdateShortGoals = $resource('/api/note/basic/updateShortGoals');
	var NotesBasicUpdateLongGoals = $resource('/api/note/basic/updateLongGoals');
	var NotesBasicSaveQuestion1 = $resource('/api/note/basic/saveQuestion1');
	var NotesBasicSaveQuestion2 = $resource('/api/note/basic/saveQuestion2');
	var NotesBasicLoad = $resource('/api/note/load');


	$scope.goals = [];
	$scope.ltgoals = [];
	
	var phoneSearch = function(){
		var searchNote = new NotesBasic();
		searchNote.phoneNumber = $scope.phoneNumberSearch;
		if (searchNote.phoneNumber != null && searchNote.phoneNumber !== undefined) {
        	
		NotesBasic.query(searchNote, function (results){
			if(results.length > 0){

				$scope.phoneNumber = results[0].phoneNumber;
				$scope.firstName = results[0].studentName.first;
				$scope.lastName = results[0].studentName.last;
				$scope.schoolName = results[0].schoolName;
				$scope.currentYear = results[0].currentYear;
				$scope.studentAddress = results[0].studentAddress;
				$scope.goals = results[0].goals;
				$scope.ltgoals = results[0].ltgoals;
			}
			else{
				alert("Phone Number Does Not Exist. Please Fill Out Basic Info and Submit.");
				$scope.phoneNumber = $scope.phoneNumberSearch;
			}
		});
		}
		else{
			alert("Phone Number Does Not Exist. Please Fill Out Basic Info and Submit.");
		}
	}


	$scope.loadCaller = function(){
		NotesBasicLoad.query(new NotesBasic(), function(results){
			$scope.phoneNumberSearch = results[0].currentCall;
			phoneSearch();
		})
	}

	$scope.phoneSearch = phoneSearch;

	$scope.createNewNote = function() {
		NotesBasic.query({phoneNumber : $scope.phoneNumber}, function (results){
			if(results.length == 0){
				var newNote = new NotesBasicCreate();
				newNote.phoneNumber = $scope.phoneNumber;
				newNote.studentName = { first: $scope.firstName, last: $scope.lastName};
				newNote.schoolName = $scope.schoolName;
				newNote.currentYear = $scope.currentYear;
				newNote.studentAddress = $scope.studentAddress;
				$scope.phoneNumberSearch = newNote.phoneNumber;

				newNote.$save(function(result){
					$scope.phoneNumber = '';
					$scope.firstName = '';
					$scope.lastName = '';
					$scope.schoolName = '';
					$scope.currentYear = '';
					while ($scope.goals.length > 0) {
						$scope.goals.pop();
					}
					while ($scope.ltgoals.length > 0) {
						$scope.ltgoals.pop();
					}
					$scope.phoneSearch();
				});
			}
			else
			{
				var newNote = new NotesBasicUpdate();
				newNote.phoneNumber = $scope.phoneNumber;
				newNote.studentName = { first: $scope.firstName, last: $scope.lastName};
				newNote.schoolName = $scope.schoolName;
				newNote.currentYear = $scope.currentYear;
				newNote.studentAddress = $scope.studentAddress;


				newNote.$save(function(result){
					$scope.phoneNumber = '';
					$scope.firstName = '';
					$scope.lastName = '';
					$scope.schoolName = '';
					$scope.currentYear = '';
					$scope.studentAddress = '';

					$scope.phoneSearch();

				});
			}
		});
		
	}

	$scope.createNewGoal = function(){
		NotesBasic.query({phoneNumber : $scope.phoneNumber}, function (results){
			if(results.length == 0){
				//need alert to handle cases where user not found
			}
			else
			{
				var updateNoteShortGoals = new NotesBasicUpdateShortGoals();
				updateNoteShortGoals.phoneNumber = $scope.phoneNumber;
				updateNoteShortGoals.goals = $scope.newGoal;
				updateNoteShortGoals.checked = false;
				updateNoteShortGoals.$save(function(result){
					$scope.goals.push({body: $scope.newGoal});
					$scope.newGoal = '';
				});
			}	
		});
	}

	$scope.saveQuestion1 = function(){
		if(!$scope.question1.match(/\S/)){
			//if quetions is empty, do nothing
		}
		else{
			NotesBasic.query({phoneNumber : $scope.phoneNumber}, function (results){
				if(results.length == 0){
					//need alert to handle cases where user not found
				}
				else if(results[0].question1.length != 0 &&  results[0].question1[0].body == $scope.question1){
					//do nothing
				}
				else{
					var notesSaveQuestion1 = new NotesBasicSaveQuestion1();
					notesSaveQuestion1.phoneNumber = $scope.phoneNumber;
					notesSaveQuestion1.question1 = $scope.question1;
					notesSaveQuestion1.$save(function(result){});
				}	
			});
		}
	}

	$scope.saveQuestion2 = function(){
		if(!$scope.question1.match(/\S/)){
			//if quetions is empty, do nothing
		}
		else{
			NotesBasic.query({phoneNumber : $scope.phoneNumber}, function (results){
				if(results.length == 0){
						//need alert to handle cases where user not found
				}
				else if(results[0].question2.length != 0 &&  results[0].question2[0].body == $scope.question2){
					//do nothing
				}
				else
				{
					var notesSaveQuestion2 = new NotesBasicSaveQuestion2();
					notesSaveQuestion2.phoneNumber = $scope.phoneNumber;
					notesSaveQuestion2.question2 = $scope.question2;
					notesSaveQuestion2.$save(function(result){});
				}	
			});
		}
	}

  });
