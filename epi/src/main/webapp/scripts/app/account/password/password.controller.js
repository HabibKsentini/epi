'use strict';

angular.module('epiApp')
    .controller('PasswordDialogController', function ($scope, PasswordChangeService, $stateParams,  Principal, $uibModalInstance) {
        
    	
    	

        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.changePassword = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $scope.error = null;
                $scope.success = null;
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.doNotMatch = null;
                PasswordChangeService.change($stateParams.login, $scope.password).then(function () {
                    $scope.error = null;
                    $scope.success = 'OK';
                    if($uibModalInstance){
                    	$uibModalInstance.dismiss('cancel');
                    }
                }).catch(function () {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                });
            }
        };
        
        
        $scope.clear = function(){
        	$uibModalInstance.dismiss('cancel');
        }
        
    });


angular.module('epiApp')
.controller('PasswordController', function ($scope, Auth, Principal) {
    
	
	init();
	
	function init(){
		Principal.identity().then(function(account) {
            $scope.account = account;
        });	
	}
	

    $scope.success = null;
    $scope.error = null;
    $scope.doNotMatch = null;
    $scope.changePassword = function () {
        if ($scope.password !== $scope.confirmPassword) {
            $scope.error = null;
            $scope.success = null;
            $scope.doNotMatch = 'ERROR';
        } else {
            $scope.doNotMatch = null;
            Auth.changePassword($scope.password).then(function () {
                $scope.error = null;
                $scope.success = 'OK';
                if($uibModalInstance){
                	$uibModalInstance.dismiss('cancel');
                }
            }).catch(function () {
                $scope.success = null;
                $scope.error = 'ERROR';
            });
        }
    };
    
    
    $scope.clear = function(){
    	$uibModalInstance.dismiss('cancel');
    }
    
});

