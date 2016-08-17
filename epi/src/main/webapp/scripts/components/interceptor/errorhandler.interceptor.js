'use strict';

angular.module('epiApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
        return {
            'responseError': function (response) {
            	var alertKey = response.headers('X-epi-Error');
				var param = response.headers('X-epi-params');
                if (!(response.status == 401 && response.data.path.indexOf("/api/account") == 0 )){
	                $rootScope.$emit('epiApp.httpError', response);
	            }else if (angular.isString(alertKey) && !(response.status == 401)) {
					$rootScope.$emit('epiApp.httpError', response);
				}
                return $q.reject(response);
            }
        };
    });