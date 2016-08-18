'use strict';

angular.module('epiApp').controller('SchoolYearManagementController',
		function($scope, SchoolYear) {

			init();

			function init() {
				SchoolYear.query().$promise.then(function(data) {
					$scope.schoolYears = data;
				});
			}

		});

angular.module('epiApp').controller('SchoolYearManagementDialogController',
		function($scope, entity, SchoolYear, $uibModalInstance, $state) {

			initSchoolYear();
			////////
			$scope.clear = clear;
			$scope.save = save;

			function initSchoolYear() {
				if (entity == undefined) {
					throw new Error("school year is null !");
				}
				if (entity.$promise == undefined) {
					$scope.schoolYear = entity;
				} else {
					entity.$promise.then(function(data) {
						$scope.schoolYear = data;
					})
				}
			}

			function save() {
				SchoolYear.save($scope.schoolYear, onSaveSuccess, onSaveError);
			}

			function onSaveSuccess(result) {
				$uibModalInstance.close(result);
				$state.go('school-year-management', {}, {
					reload : true
				});
			}

			function onSaveError(result) {
				console.log("save error");
			}

			function clear() {
				$uibModalInstance.dismiss('cancel');
			}
			;

		});