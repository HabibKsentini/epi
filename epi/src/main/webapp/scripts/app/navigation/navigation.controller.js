'use strict';

angular.module('epiApp').controller('NavigationController', function(Topic) {
	/* jshint validthis: true */
	var vm = this;
	vm.topics = [];
	getAllTopic();

	function getAllTopic() {
		Topic.query().$promise.then(function(topics) {
			vm.topics = topics;
		});
	}
});

angular
		.module('epiApp')
		.controller(
				'NavigationSearchController',
				function(Exercise, Topic, Group, NavigationService,
						$stateParams) {
					/* jshint validthis: true */
					var vm = this;
					vm.topics = [];
					vm.groups = [];
					vm.totalItems = 0;
					vm.pageable = {};
					vm.exercise = {};
					vm.exercises = [];
					vm.refreshPage = refreshPage;

					// /
					NavigationService
							.setTopicIdInExerciseSearchModel($stateParams.id);
					getAllTopic();
					getAllGroup();
					initExerciseSearchModelAndPagebleModelFromServiceAndLoadAll();

					function initExerciseSearchModelAndPagebleModelFromServiceAndLoadAll() {
						NavigationService.getExerciseSearchModel().then(
								function(exercise) {
									vm.exercise = exercise;
									NavigationService.getPageable().then(
											function(pageable) {
												vm.pageable = pageable;
												loadAll(exercise, pageable);
											})
								})
					}

					function refreshPage() {
						loadAll(vm.exercise, vm.pageable);
					}

					function loadAll(exerciseSearchModel, paginationModel) {
						var pageable = angular.copy(paginationModel);
						var searchModel = angular.copy(exerciseSearchModel);
						var pageRequest = angular.copy(paginationModel);
						pageRequest.page += -1;
						var transformedSearchModel = _transformExerciseSearchModelBeforSearch(angular
								.copy(exerciseSearchModel));
						var data = merge_options(transformedSearchModel,
								pageRequest);
						Exercise.query(data).then(function(result) {
							vm.totalItems = result.totalElements;
							vm.exercises = result.content;
							_setSearchData(pageable, searchModel);
						});
					}

					function getAllTopic() {
						Topic.query().$promise.then(function(topics) {
							vm.topics = topics;
						});
					}

					function getAllGroup() {
						Group.query({
							"projection" : "withCompleteName"
						}).$promise.then(function(groups) {
							vm.groups = groups;
						});
					}

					/**
					 * Transform:
					 * 
					 * userSearchModel.profile.id --> profileId And
					 * userSearchModel.department.id --> departmentId
					 */
					function _transformExerciseSearchModelBeforSearch(
							exerciseSearchModel) {
						var groupId = exerciseSearchModel.group != null ? exerciseSearchModel.group.id
								: null;
						var topicId = exerciseSearchModel.topic != null ? exerciseSearchModel.topic.id
								: null;
						exerciseSearchModel.groupId = groupId;
						exerciseSearchModel.topicId = topicId;
						delete exerciseSearchModel.group;
						delete exerciseSearchModel.topic;
						return exerciseSearchModel;
					}

					function _setSearchData(pageable, searchModel) {
						vm.pageable = pageable;
						vm.exercise = searchModel;
						NavigationService.setPageable(pageable);
						NavigationService.setExerciseSearchModel(searchModel);
					}

					function merge_options(obj1, obj2) {
						var obj3 = {};
						for ( var attrname in obj1) {
							obj3[attrname] = obj1[attrname];
						}
						for ( var attrname in obj2) {
							obj3[attrname] = obj2[attrname];
						}
						return obj3;
					}
				});

(function() {
	'use strict';

	angular.module('epiApp').factory('NavigationService', NavigationService);
	NavigationService.$inject = [ '$q' ];

	function NavigationService($q) {
		var service = {
			getExerciseSearchModel : getExerciseSearchModel,
			setExerciseSearchModel : setExerciseSearchModel,
			getPageable : getPageable,
			setPageable : setPageable,
			setTopicIdInExerciseSearchModel : setTopicIdInExerciseSearchModel
		};

		var exerciseSearchModel = {
			"subject" : null,
			"topic" : {
				id : null
			},
			"group" : {
				id : null
			}
		};

		var pageable = {
			"page" : 1,
			"size" : 5,
			"sort" : []
		};

		function getExerciseSearchModel() {
			var deferred = $q.defer();
			deferred.resolve(exerciseSearchModel);
			return deferred.promise;
		}

		function setExerciseSearchModel(value) {
			exerciseSearchModel = value;
		}

		function setTopicIdInExerciseSearchModel(topicId) {
			exerciseSearchModel.topic = {}; 
			exerciseSearchModel.topic.id = topicId;
		}

		function getPageable() {
			var deferred = $q.defer();
			deferred.resolve(pageable);
			return deferred.promise;
		}

		function setPageable(value) {
			pageable = value;
		}
		return service;
	}
})();