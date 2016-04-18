'use strict';

angular.module('epiApp').config(
		function($stateProvider) {
			$stateProvider.state('login', {
				url : '/',
				data : {
					authorities : [],
					pageTitle : 'login.title'
				},
				views : {
					'root@' : {
						templateUrl : 'scripts/app/account/login/login.html',
						controller : 'LoginController'
					}
				},
				resolve : {
					translatePartialLoader : [ '$translate',
							'$translatePartialLoader',
							function($translate, $translatePartialLoader) {
								$translatePartialLoader.addPart('login');
								$translatePartialLoader.addPart('global');
								return $translate.refresh();
							} ]
				}
			});
		});
