'use strict';

angular.module('epiApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('class-management', {
                parent: 'admin',
                url: '/class-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'class-management.home.title'
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/admin/class/class-management.html',
                        controller: 'ClassManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('class.management');
                        return $translate.refresh();
                    }]
                }
            })
            .state('class-management-detail', {
                parent: 'admin',
                url: '/class-management/:id',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'class-management.detail.title'
                },
                views: {
                    'content@site': {
                        templateUrl: '/scripts/app/admin/class/class-management-dialog.html',
                        controller: 'ClassManagementDialogController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
                        return $translate.refresh();
                    }]
                }
            })
            .state('class-management.new', {
                parent: 'class-management',
                url: '/new',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: '/scripts/app/admin/class/class-management-dialog.html',
                        controller: 'ClassManagementDialogController',
                        size: 'lg'
                    }).result.then(function(result) {
                        $state.go('class-management', null, { reload: true });
                    }, function() {
                        $state.go('class-management');
                    })
                }]
            })  
    });
