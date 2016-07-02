<<<<<<< HEAD
'use strict';

angular.module('epiApp')
    .controller('SidebarController', function ($scope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.collapseVar = 0;

        Principal.identity().then(function(data){
        	$scope.userName = data.firstName + " " + data.lastName; 
        })
        
        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };
        

		$scope.check = function(x) {
			if (x == $scope.collapseVar)
				$scope.collapseVar = 0;
			else
				$scope.collapseVar = x;
		};
        
=======
'use strict';

angular.module('epiApp')
    .controller('SidebarController', function ($scope, $location, $state, Auth, Principal, ENV) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.collapseVar = 0;

        Principal.identity().then(function(data){
        	$scope.userName = data.firstName + " " + data.lastName; 
        })
        
        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };
        

		$scope.check = function(x) {
			if (x == $scope.collapseVar)
				$scope.collapseVar = 0;
			else
				$scope.collapseVar = x;
		};
        
>>>>>>> branch 'master' of https://github.com/HabibKsentini/epi.git
    });