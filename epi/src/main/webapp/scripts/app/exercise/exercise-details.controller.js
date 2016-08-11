'use strict';

angular.module('epiApp').controller(
		'ExerciseDetailsController',
		function($scope, $sce, Exercise, $stateParams, File, Principal,
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
			vm.invalidContentlength = invalidContentlength;
			
			
			
			function invalidContentlength(){

				var myContent = vm.exercise.rawContent;
				return ($(myContent).text()).length < 250;
			}

			function trustSrcMedia(src) {
			    return $sce.trustAsResourceUrl(src);
			  }
			
			function setMarkforReadToTrue(){
				Exercise.setMarkForRead(vm.exercise.id); 
			}

			function goToWaitingForValidation() {
				Exercise.goToWaitingForValidation(vm.exercise.id);
			}

			function validate() {
				Exercise.validate(vm.exercise.id);
				loadExercise($stateParams.id);
			}
			
			
			function loadExercise(id) {
				Exercise.get(id).then(function(data) {
					vm.exercise = data
					loadFiles(id);
				//	isValidator();
					loadMediaURL(data.mediaUrls);
				});
			}

			function loadFiles(id) {
				Exercise.getFiles(id).then(function(data) {
					vm.exercise.uploadedFiles = data
				});
			}

//			function isValidator() {
//				Principal.identity(false).then(function(identity) {
//					if (identity.login == vm.exercise.validator.login) {
//						vm.isCurrentUserValidtor = true;
//					}
//				});
//			}

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
			
			function loadMediaURL(mediaUrls) {
				var urls = [];
				for (var i = 0; i < mediaUrls.length; i++) {
					urls.push({domain: $sce.trustAsResourceUrl(mediaUrls[i])}); 
				}
 			    $scope.urls = urls;
			}
			    
			
		});


