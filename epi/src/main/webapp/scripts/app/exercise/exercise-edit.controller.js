'use strict';

angular.module('epiApp').controller(
		'ExerciseEditController',
		function(Exercise, $stateParams, File, $filter, Group, ConfirmationDialogService) {

			var vm = this;
			vm.exercise = {};
			loadExercise($stateParams.id);

			vm.downloadFile = downloadFile;
			vm.updateStudentsOnGroupChange = updateStudentsOnGroupChange;
			vm.uploadFile = uploadFile;
			vm.downloadFile = downloadFile;
			vm.updateExercise = updateExercise;
			vm.addMediaLink = addMediaLink;
			vm.newMediaLink = "" ;
			vm.removeMediaLink = removeMediaLink;

			function loadExercise(id) {
				Exercise.getExercise(id).then(function(data) {
					vm.exercise = data
					loadFiles(id);
					initStudents(); 
					initDisciplines();
				});
			}
			;

			function initDisciplines(){
				vm.exercise.allDisciplines.$promise.then(function(data){
					vm.exercise.disciplines = Exercise._getDataFromAllArray(data, vm.exercise.disciplines);
				}); 
				

			}
			
			function loadFiles(id) {
				Exercise.getFiles(id).then(function(data) {
					vm.exercise.uploadedFiles = data
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

			function updateExercise() {
				Exercise.update(vm.exercise);
			}

			function initStudents(){
				var id = vm.exercise.group.id;
				if (id != null) {
					Group.findStudents({
						'id' : id
					}, function(allStudents) {
						vm.exercise.allStudents = $filter('baseUsersInfos')(
								allStudents);
						vm.exercise.students = Exercise._getDataFromAllArray(vm.exercise.allStudents, vm.exercise.students); 
					});
				}
			}
			
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
			
			
			
			function addMediaLink(){
				if (vm.newMediaLink != ""){
				vm.exercise.mediaUrls.push(vm.newMediaLink);
				vm.newMediaLink = ""
				}
			}

			function removeMediaLink(media){

				for (var i = 0; i < vm.exercise.mediaUrls.length; i++) {
					if (media === vm.exercise.mediaUrls[i]){
						vm.exercise.mediaUrls.splice(i, 1);
					}
				}
			}
		});



