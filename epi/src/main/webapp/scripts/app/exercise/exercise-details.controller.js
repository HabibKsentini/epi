'use strict';

angular.module('epiApp').controller(
		'ExerciseDetailsController',
		function(Exercise, $stateParams, File, Principal,
				ConfirmationDialogService, $state, Topic) {

			var vm = this;
			vm.exercise = {};
			loadExercise($stateParams.id);
			vm.isCurrentUserValidtor = false;
			vm.downloadFile = downloadFile;
			vm.validate = validate;
			vm.goToWaitingForValidation = goToWaitingForValidation
			vm.remove = remove;
			vm.setMarkforReadToTrue = setMarkforReadToTrue; 
			
			function setMarkforReadToTrue(){
				Exercise.setMarkForRead(vm.exercise.id); 
			}

			function goToWaitingForValidation() {
				Exercise.goToWaitingForValidation(vm.exercise.id);
			}

			function validate() {
				Exercise.validate(vm.exercise.id);
			}
			
			function getTopicColors(index){
				
				var colors = [ 'themed-background-fire',
						'themed-background-autumn',
						'themed-background-spring',
						'themed-background-dark-autumn',
						'themed-background-amethyst',
						'themed-background-night',
						'themed-background-dark',
						'themed-background-flatie'];
				return colors[index - 1]; 
			}

			function loadExercise(id) {
				Exercise.get(id).then(function(data) {
					vm.exercise = data
					vm.topicColor = getTopicColors(data.topic.id); 
					loadFiles(id);
					isValidator();
				});
			}

			function loadFiles(id) {
				Exercise.getFiles(id).then(function(data) {
					vm.exercise.uploadedFiles = data
				});
			}

			function isValidator() {
				Principal.identity(false).then(function(identity) {
					if (identity.login == vm.exercise.validator.login) {
						vm.isCurrentUserValidtor = true;
					}
				});
			}

			function downloadFile(fileId) {
				File.download(fileId).then(function(success) {
					console.log('success : ' + success);
				}, function(error) {
					console.log('error : ' + error);
				});

			}

			function remove() {

				ConfirmationDialogService
						.openConfirmationDialog('entity.delete.body').result
						.then(function() {
							Exercise.remove($stateParams.id).then(function() {
								$state.go("home");
							});
						});

			}

		});