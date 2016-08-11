'use strict';

angular.module('epiApp')
		.controller(
				'ClassManagementController',
				function($scope, SchoolYear, Level, Group, ParseLinks) {

					init();
					$scope.loadAll = loadAll;
					$scope.resetClassSearchModel = resetClassSearchModel;

					function loadAll() {
						var classSearchModel = $scope.classSearchModel;
						var pageable = {
							page : $scope.page - 1,
							size : 10,
							sort : $scope.sort
						};
						var requestParamaters = _mergObjects(classSearchModel,
								pageable);
						Group.search(requestParamaters, function(result,
								headers) {
							$scope.links = ParseLinks.parse(headers('link'));
							$scope.totalItems = headers('X-Total-Count');
							$scope.groups = result;
						});
					}
					;

					function initSearchModel() {
						$scope.classSearchModel = {
							levelId : null,
							schoolYearId : null,
							name : null
						}
					}

					function init() {
						initSchoolYears();
						initLevels();
						initSearchModel();
						initPagitionAndSorting();
						loadAll();
					}

					function initPagitionAndSorting() {
						$scope.page = 1;
						$scope.sort = [];
					}

					function resetClassSearchModel() {
						initSearchModel();
						loadAll();
					}

					function initSchoolYears() {
						SchoolYear.query().$promise.then(function(data) {
							$scope.schoolYears = data;
						})
					}

					function initLevels() {
						Level.query().$promise.then(function(data) {
							$scope.levels = data;
						})
					}

					function _mergObjects(obj1, obj2) {
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

angular.module('epiApp').controller(
		'ClassManagementDialogController',
		function($scope, $filter, Students) {

			$scope.students = [];
			var leftFilterText = "";
			activate();

			// //////////////

			function activate() {
				$scope.leftValue = [];
				var leftcounter = 0;
				$scope.rightValue = [];
				var rightcounter = 0;
				$scope.addValue = [];
				$scope.removeValue = [];
			

				function loadMoreStudents(text) {
					leftFilterText = text || leftFilterText;
					var requestParamaters = {
						searchText : leftFilterText
					};
					Students.query(requestParamaters,
							function(result, headers) {
								$scope.totalItems = headers('X-Total-Count');
								var studentsName =  $filter('baseUsersInfos')(
										result);
								$scope.students = $scope.students
										.concat($filter("baseUsersInfos")(result));
							});

				}
				function loadMoreRight() {
				}

				function loadStudents(text) {
					loadMoreStudents(text);
				}

				$scope.options = {
					leftContainerScrollEnd : function() {
						loadMoreStudents()
					},
					rightContainerScrollEnd : function() {
						loadMoreRight();
					},
					leftContainerSearch : function(text) {
						$scope.students = [];
						loadStudents(text);
					},
					rightContainerSearch : function(text) {
						$scope.rightValue = $filter('filter')(rightValue, {
							'name' : text
						})
					},
					leftContainerLabel : 'Available Lists',
					rightContainerLabel : 'Selected Lists',
					onMoveRight : function() {
						console.log('right');
						console.log($scope.addValue);

					},
					onMoveLeft : function() {
						console.log('left');
						console.log($scope.removeValue);
					}

				};
				console.log($scope.options)
				loadMoreStudents();
				loadMoreRight();
				var leftValue = angular.copy($scope.leftValue)
				var rightValue = angular.copy($scope.rightValue)

			}

		});
