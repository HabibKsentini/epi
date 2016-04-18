'use strict';

angular.module('epiApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/home',
                data: {
                    authorities: []
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/main/main.html',
                        controller: 'MainController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('exercise');
                        return $translate.refresh();
                    }]
                }
            });
    });

