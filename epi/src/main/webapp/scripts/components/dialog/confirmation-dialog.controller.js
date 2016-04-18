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