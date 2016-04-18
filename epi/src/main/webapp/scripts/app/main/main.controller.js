'use strict';

angular
		.module('epiApp')
		.controller(
				'MainController',
				function($scope, Principal, Exercise) {
					$scope.exerciseWithStatusInPrepartionAndWaitingForValidation = [];
					$scope.markedForReadExercies = []; 
					
					// ///////////
					checkAuthentification(); 
					getInPrepartionAndWaitingForValidation();
					getMarkedForReadExercies(); 
					// //////////
					function getInPrepartionAndWaitingForValidation() {
						Exercise.getInPrepartionAndWaitingForValidation()
								.then(function(data) {
									$scope.exerciseWithStatusInPrepartionAndWaitingForValidation = data;
								});
					}
					
					function getMarkedForReadExercies(){
						Exercise.getMarkedForRead().then(function(exercises){
							$scope.markedForReadExercies = exercises
						})
					}

					function checkAuthentification() {
						Principal.identity().then(function(account) {
							$scope.account = account;
							$scope.isAuthenticated = Principal.isAuthenticated;
						});
					}
				});
