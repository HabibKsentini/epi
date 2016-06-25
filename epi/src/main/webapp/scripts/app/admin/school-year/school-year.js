'use strict';

angular.module('epiApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('school-year-management', {
                parent: 'admin',
                url: '/school-year-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'school-year.home.title'
                },
                views: {
                    'content@site': {
                        templateUrl: 'scripts/app/admin/school-year/school-year.html',
                        controller: 'SchoolYearManagementController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user.management');
                        return $translate.refresh();
                    }]
                }
            })
    });
