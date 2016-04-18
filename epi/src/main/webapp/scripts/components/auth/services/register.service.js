'use strict';

angular.module('epiApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


