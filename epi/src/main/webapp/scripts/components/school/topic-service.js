'use strict';

angular.module('epiApp').factory(
		'Topic',
		function($resource, HateoasDataUtil) {
			return $resource('/topics/:id', {}, {
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