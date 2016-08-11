(function() {
	'use strict';

	angular.module('epiApp').factory('HateoasDataUtil', HateoasDataUtil);

	function HateoasDataUtil($resource) {
		var service = {
			getEmbeddedDataWithout_Links : getEmbeddedDataWithout_Links
		}
		return service;
		
		function getEmbeddedDataWithout_Links(data) {
			data = angular.fromJson(data);
			var remove_links = function(topic) {
				delete topic['_links']
				return topic;
			};
			var firstObjectName = Object.keys(data._embedded)[0];
			if(firstObjectName){
				return data._embedded[firstObjectName].map(remove_links);
			}
			return []; 
		}
	}

})();