'use strict';

angular.module('epiApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('school-year-management', {
                parent: 'site',
                url: '/school-year-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'school-year.home.title'
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/admin/schoolYear/schooYear.html',
                        controller: 'SchoolYearManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('schoolYear.managment');
                        return $translate.refresh();
                    }]
                }
            })
            
              .state('school-year-management.new', {
                parent: 'school-year-management',
                url: '/new',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: '/scripts/app/admin/schoolYear/school-year-management-dialog.html',
                        controller: 'SchoolYearManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null, 
                                    active: false
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('school-year-management', null, { reload: true });
                    }, function() {
                        $state.go('school-year-management');
                    })
                }]
            })
            
            
            .state('school-year-management.edit', {
                parent: 'school-year-management',
                url: '/{id}/edit',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: '/scripts/app/admin/schoolYear/school-year-management-dialog.html',
                        controller: 'SchoolYearManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['SchoolYear', function(SchoolYear) {
                                return SchoolYear.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('school-year-management', null, { reload: true });
                    }, function() {
                        $state.go('school-year-management');
                    })
                }]
            })
            
    });