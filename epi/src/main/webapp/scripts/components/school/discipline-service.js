'use strict';

angular.module('epiApp').factory(
		'Discipline',
		function($resource, HateoasDataUtil) {
			return $resource('/disciplines/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					cache : true,
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				}
			});
		});

angular.module('epiApp').factory(
		'SchoolYear',
		function($resource, HateoasDataUtil) {
			return $resource('/schoolYears/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					cache : true,
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				}
			});
		});

angular.module('epiApp').factory(
		'Topic',
		function($resource, HateoasDataUtil) {

			var images = [ 'assets/images/themeImg/health.png',
					'assets/images/themeImg/arts.png',
					'assets/images/themeImg/ecologie.png',
					'assets/images/themeImg/citizen.png',
					'assets/images/themeImg/antique.png',
					'assets/images/themeImg/language.png',
					'assets/images/themeImg/economie.png',
					'assets/images/themeImg/techno.png' ];

			return $resource('/topics/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					cache : true,
					params : 'sort_by=id',

					transformResponse : function(data) {
						var data = HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
						angular.forEach(data, function(value, i) {
							data[i].image = images[value.id - 1];
						});
						return data;
					}
				}
			});
		});

angular.module('epiApp').factory(
		'Level',
		function($q, $resource, HateoasDataUtil) {
			var Level = $resource('/levels/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					cache : true,
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				}
			});
			return Level;
		});

angular.module('epiApp').factory(
		'Teacher',
		function($q, $resource, HateoasDataUtil) {
			var Level = $resource('/teachers/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					cache : true,
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				}
			});
			return Level;
		});
// /groups/search/all
angular.module('epiApp').factory(
		'Group',
		function($q, $resource, HateoasDataUtil) {
			var Group = $resource('/groups/:id', {}, {
				'query' : {
					method : 'GET',
					isArray : true,
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				},
				'get' : {
					method : 'GET',
					url : 'api/groups/:id',
					transformResponse : function(data) {
						data = angular.fromJson(data);
						return data;
					}
				},

				'delete' : {
					method : 'DELETE',
					url : 'api/groups/:id'
				},
				
				'save' : {
					method : 'POST',
					url : 'api/groups'
				},
				'findByLevelId' : {
					method : 'GET',
					isArray : true,
					cache : true,
					url : '/groups/search/findByLevelId',
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				},

				'findStudents' : {
					method : 'GET',
					isArray : true,
					cache : true,
					url : '/groups/:id/students',
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				},

				'findWithCompleteName' : {
					method : 'GET',
					isArray : true,
					cache : true,
					url : '/groups/completeName',
					transformResponse : function(data) {
						return HateoasDataUtil
								.getEmbeddedDataWithout_Links(data);
					}
				},

				'search' : {
					method : 'GET',
					isArray : true,
					url : '/api/groups',
					transformResponse : function(data) {
						return JSON.parse(data);
					}
				}

			});
			return Group;
		});

angular.module('epiApp').factory(
		'File',
		function($q, $resource, $timeout, $window) {

			var File = {
				resource : resource,
				download : download
			}
			return File;

			function download(id) {
				var defer = $q.defer();
				$timeout(function() {
					$window.location = 'files/' + id + '/download';
				}, 100).then(function() {
					defer.resolve('success');
				}, function() {
					defer.reject('error');
				});
				return defer.promise;

			}

			function resource() {
				var resource = $resource('/files/:id', {}, {
					'query' : {
						method : 'GET',
						isArray : true,
						transformResponse : function(data) {
							return HateoasDataUtil
									.getEmbeddedDataWithout_Links(data);
						}
					}
				});
				return resource;
			}

		});
