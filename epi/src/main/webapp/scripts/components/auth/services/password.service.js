'use strict';

angular.module('epiApp')
    .factory('Password', function ($resource) {
        return $resource('api/account/change_password', {}, {
        });
    });

angular.module('epiApp')
    .factory('PasswordResetInit', function ($resource) {
        return $resource('api/account/reset_password/init', {}, {
        })
    });

angular.module('epiApp')
    .factory('PasswordResetFinish', function ($resource) {
        return $resource('api/account/reset_password/finish', {}, {
        })
    });


angular.module('epiApp').factory(
		'PasswordChangeService',
		function($q, $http) {

			var PasswordChangeService = {
				change : change
			}
			return PasswordChangeService;

			function change(login, password) {
				var url = '/api/account/change_password/' + login; 
				var defer = $q.defer();
				$http.post(url, password)
				   .then(
				       function(data){
				    	   defer.resolve(data); 
				       }, 
				       function(response){
				    	   deferred.reject("Error");
				       }
				    );
				return defer.promise;

			}

		});
