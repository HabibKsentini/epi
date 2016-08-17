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
                        templateUrl: '/scripts/app/admin/class/class-management-detail.html',
                        controller: 'classManagementDetailController'
                    }
                },
                resolve: {
                	  translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                          $translatePartialLoader.addPart('class.management');
                          return $translate.refresh();
                      }],
                	groupEntity : [ 'Group','$stateParams',
									function(Group, $stateParams) {
										return Group.get({
											"id" : $stateParams.id									});
									} ]
                }
            })
    });
