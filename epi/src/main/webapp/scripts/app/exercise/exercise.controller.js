'use strict';

angular.module('epiApp').controller(
		'ExerciseController',
		function($scope, Exercise, Group, $filter, Upload, File, $state) {
			/* jshint validthis: true */
			var vm = this;
			vm.exercise = {};
			vm.updateGroupOnLevelChange = updateGroupOnLevelChange;
			vm.updateStudentsOnGroupChange = updateStudentsOnGroupChange;
			vm.uploadFile = uploadFile;
			vm.downloadFile = downloadFile;
			vm.updateExercise = updateExercise;
			vm.cancel = cancel; 
			
			vm.addMediaLink = addMediaLink;
			vm.newMediaLink = "" ;
			vm.removeMediaLink = removeMediaLink;
		
			
			$scope.IntroOptions = {
					steps:[
					{
					    element: '#step1',
					    intro: "Barre de boutons pour visualiser, enregistrer ou annuler la création de l'EPI \n l'enregistrement est candionné par le saisi des champs obligatoires !"
					},
					{
					    element: '#step2',
					    intro: "Champs obligatoires pour l'EPI",
					    position: 'top'
					},
					{
					    element: '#step3',
					    intro: "Cette partie permet de lier des vidéos Youtube à l'EPI",
					    position: 'top'
					},
					{
					    element: '#step4',
					    intro: "Cette zone permet le saisi du contenu d'EPI",
					    position: 'top'
					},
					{
					    element: '#step5',
					    intro: "Cette partie permet de joindre des fichiers à l'EPI",
					    position: 'top'
					}    
					],
			        showStepNumbers: false,
			        exitOnOverlayClick: true,
			        exitOnEsc:true,
			        nextLabel: '<strong>Suivant &gt;</strong>',
			        prevLabel: '<span style="color:green">&lt; Précedent</span>',
			        skipLabel: 'Fermer',
			        doneLabel: 'Fin'
			}
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
				Exercise.remove(vm.exercise.id).then(function() {
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
				if (vm.exercise.students.length === 0){
					vm.exercise.students = vm.exercise.allStudents;
				}
				Exercise.update(vm.exercise);
			}

			
			function addMediaLink(){
				if (vm.newMediaLink != ""){
				vm.exercise.mediaUrls.push(vm.newMediaLink);
				vm.newMediaLink = ""
				}
			};

			function removeMediaLink(media){

				for (var i = 0; i < vm.exercise.mediaUrls.length; i++) {
					if (media === vm.exercise.mediaUrls[i]){
						vm.exercise.mediaUrls.splice(i, 1);
					}
				}
			};
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