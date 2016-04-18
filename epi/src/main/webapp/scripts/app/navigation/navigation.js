'use strict';

angular.module('epiApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('navigation', {
                parent: 'site',
                url: '/navigation',
                data: {
                    authorities: []
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'NavigationController'
                        
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('exercise');
                        return $translate.refresh();
                    }]
                }
            })
            .state('navigationSearch', {
                parent: 'site',
                url: '/navigation/:id',
                data: {
                    authorities: []
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/navigation/navigation-search.html',
                        controller: 'NavigationSearchController',
                        controllerAs: 'NavigationSearchController'
                        
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('exercise');
                        $translatePartialLoader.addPart('main');
                        return $translate.refresh();
                    }]
                }
            }); 
    });
