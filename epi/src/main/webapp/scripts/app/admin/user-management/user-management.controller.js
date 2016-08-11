'use strict';

angular.module('epiApp')
    .controller('UserManagementController', function ($scope, Principal, User, Upload, ParseLinks, Language) {
        $scope.users = [];
        $scope.authorities = ["ROLE_TEACHER", "ROLE_ADMIN", "ROLE_STUDENT"];
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
		
		Principal.identity().then(function(account) {
            $scope.currentAccount = account;
        });
        $scope.page = 1;
        $scope.sort = []; 
        $scope.loadAll = function () {
        	var userSearchModel = $scope.userSearchModel;
        	var pageable = {page: $scope.page - 1, size: 10 , sort : $scope.sort}; 
        	var requestParamaters = _mergObjects(userSearchModel, pageable); 
            User.query(requestParamaters, function (result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.totalItems = headers('X-Total-Count');
                $scope.users = result;
            });
        };

        $scope.loadPage = function (page) {
            $scope.page = page;
            $scope.loadAll();
        };
       

        $scope.setActive = function (user, isActivated) {
            user.activated = isActivated;
            user.createdDate = null; 
            user.lastModifiedDate = null; 
            User.update(user, function () {
                $scope.loadAll();
                $scope.clear();
            });
        };

        $scope.clear = function () {
            $scope.user = {
                id: null, login: null, firstName: null, lastName: null, email: null,
                activated: null, langKey: null, createdBy: null, createdDate: null,
                lastModifiedBy: null, lastModifiedDate: null, resetDate: null,
                resetKey: null, authorities: null
            };
            if($scope.editForm){
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
            }
        };
        
        
        $scope.resetUserSearchModel = function(){
        	$scope.userSearchModel = {
            		login : null, 
            		firstName: null, 
            		lastName: null, 
            		authorities : null
            }
        	$scope.loadAll();
        }
        $scope.resetUserSearchModel();
        
        function _mergObjects(obj1,obj2){
            var obj3 = {};
            for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
            for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
            return obj3;
        }
        
    	$scope.loadFromFile = function (file) {
			Upload.upload({
				url : 'api/loadusers',
				data : {
					file : file
				}
			}).then(
					function(resp) {
						console.log('Success ' + resp.config.data.file.name
								+ 'uploaded. Response: ' + resp.data);
						//vm.exercise.uploadedFiles.push(resp.data);
					});
			$scope.loadAll();
		}
		;
    });
