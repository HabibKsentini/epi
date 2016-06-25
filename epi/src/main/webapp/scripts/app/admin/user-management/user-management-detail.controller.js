'use strict';

angular.module('epiApp')
    .controller('UserManagementDetailController', function ($scope, $stateParams, User) {
        $scope.user = {};
        $scope.authorities = ["ROLE_TEACHER", "ROLE_ADMIN", "ROLE_STUDENT"];
        $scope.load = function (login) {
            User.get({login: login}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.login);
    });
