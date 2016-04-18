'use strict';

angular.module('epiApp').controller(
		'ExerciseController',
		function($scope, Exercise, Group, $filter, Upload, File) {
			/* jshint validthis: true */
			var vm = this;
			vm.exercise = {};
			vm.updateGroupOnLevelChange = updateGroupOnLevelChange;
			vm.updateStudentsOnGroupChange = updateStudentsOnGroupChange;
			vm.uploadFile = uploadFile;
			vm.downloadFile = downloadFile;
			vm.updateExercise = updateExercise;
			vm.cancel = cancel; 
			// //////////

			initExercise();

			// //////////

			function initExercise() {
				Exercise.getEmpty().then(function(exercise) {
					vm.exercise = exercise;
				})
			}
			;

			function cancel() {
				Exercise.remove($stateParams.id).then(function() {
					$state.go("home");
				});
			}

			function updateGroupOnLevelChange() {
				var levelId = vm.exercise.level.id;
				if (levelId != null) {
					Group.findByLevelId({
						'levelId' : levelId
					}, function(allGroups) {
						vm.exercise.allGroups = allGroups;
						vm.exercise.groups = [];
					});
				}
			}
			;

			function updateStudentsOnGroupChange() {
				var id = vm.exercise.group.id;
				if (id != null) {
					Group.findStudents({
						'id' : id
					}, function(allStudents) {
						vm.exercise.allStudents = $filter('baseUsersInfos')(
								allStudents);
						vm.exercise.students = [];
					});
				}
			}
			;

			function uploadFile(file) {
				Upload.upload({
					url : 'exercises/uploadFile',
					data : {
						file : file,
						'teachingExerciseId' : vm.exercise.id
					}
				}).then(
						function(resp) {
							console.log('Success ' + resp.config.data.file.name
									+ 'uploaded. Response: ' + resp.data);
							vm.exercise.uploadedFiles.push(resp.data);
						});
			}
			;

			function downloadFile(fileId) {
				File.download(fileId).then(function(success) {
					console.log('success : ' + success);
				}, function(error) {
					console.log('error : ' + error);
				});

			}
			;

			function updateExercise() {
				Exercise.update(vm.exercise);
			}

			// //////////

			$scope.isOpen = true;

		});

(function() {
	'use strict';

	angular.module('epiApp').controller('ConfirmationDialogController',
			ConfirmationDialogController);

	ConfirmationDialogController.$inject = [ '$scope', 'translationCode',
			'translationParam', '$uibModalInstance' ];

	function ConfirmationDialogController($scope, translationCode,
			translationParam, $modalInstance) {
		$scope.translationCode = translationCode;
		$scope.translationParam = translationParam;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};

		$scope.ok = function() {
			$modalInstance.close();
		};

	}
})();