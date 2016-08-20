'use strict';

angular
		.module('epiApp')
		.controller(
				'ClassManagementController',
				function($scope, SchoolYear, Level, Group, ParseLinks,
						$uibModal, $state, $filter) {

					init();
					$scope.loadAll = loadAll;
					$scope.resetClassSearchModel = resetClassSearchModel;
					$scope.openNewModal = openNewModal;
					$scope.openEditModal = openEditModal;
					$scope.openDeleteModal = openDeleteModal; 

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

					function openNewModal() {
						return $uibModal
								.open({
									templateUrl : '/scripts/app/admin/class/class-management-dialog.html',
									controller : 'ClassManagementDialogController',
									size : 'lg',
									resolve : {
										groupEntity : function() {
											var model = {
												id : null,
												name : "",
												level : null,
												schoolYear : null,
												students : []
											};
											return model;
										}
									}
								}).result.then(function(result) {
			                        $state.go('class-management', null, { reload: true });
						}, function() {
							$state.go('class-management');
						})
					}
					;

					function openEditModal(id) {
						return $uibModal
								.open({
									templateUrl : '/scripts/app/admin/class/class-management-dialog.html',
									controller : 'ClassManagementDialogController',
									size : 'lg',
									resolve : {
										groupEntity : [ 'Group',
												function(Group) {
													return Group.get({
														"id" : id
													});
												} ]
									}
								}).result.then(function(result) {
			                        $state.go('class-management', null, { reload: true });
						}, function() {
							$state.go('class-management');
						})
					}
					;
					
					function openDeleteModal(id) {
						 $uibModal.open({
		                        templateUrl: 'scripts/app/admin/class/class-management-delete-dialog.html',
		                        controller: 'classManagementDeleteController',
		                        size: 'md',
		                    	resolve : {
									groupEntity : [ 'Group',
											function(Group) {
												return Group.get({
													"id" : id
												});
											} ]
								}
		                       
		                    }).result.then(function(result) {
		                        $state.go('class-management', null, { reload: true });
		                    }, function() {
		                        $state.go('^');
		                    })
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
		[
				'$scope',
				'$filter',
				'Students',
				'Group',
				'SchoolYear',
				'Level',
				'groupEntity',
				'$uibModalInstance',
				'AlertService',
				function($scope, $filter, Students, Group, SchoolYear, Level,
						groupEntity, $uibModalInstance, AlertService) {

					$scope.students = [];
					$scope.saveGroup = saveGroup;
					var leftFilterText = "";
					activate();
					init();
					var selectedStudents; 

					// //////////////

					function init() {
						$scope.page = 0;
						loadMoreStudents("");
						initSchoolYears();
						initLevels();
						initGroup();
					}

					function initGroup() {
						if (groupEntity == undefined) {
							throw new Error("groupEntity is null !");
						} 
						if(groupEntity.$promise == undefined){
							$scope.class = groupEntity
						}else {
							groupEntity.$promise.then(function(data) {
							data.students = $filter("baseUsersInfos")(data.students);
							$scope.class = data;
							updateSelectedStudents();
							});
						}
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

					function saveGroup() {
						console.log("save called")
						$scope.class.students = selectedStudents;
						Group.save($scope.class, onSaveSuccess, onSaveError)

					}

					$scope.clear = function() {
						$uibModalInstance.dismiss('cancel');
					};

					var onSaveSuccess = function(result) {
						$scope.isSaving = false;
						$uibModalInstance.close(result);
					};

					var onSaveError = function(result) {
						  AlertService.add(
	                                {
	                                    type: "danger",
	                                    msg: "heelo",
	                                    params: [],
	                                    timeout: 5000,
	                                    toast: AlertService.isToast(),
	                                    scoped: true
	                                },
	                                $scope.alerts
	                            )
					};

					function loadMoreStudents(text) {
						var pageSize = 10;
						var pageable = {
							page : $scope.page,
							size : pageSize
						};
						var searchModel = {
							searchText : text
						};
						var requestParamaters = _mergObjects(searchModel,
								pageable);
						Students.query(requestParamaters, function(result,
								headers) {
							$scope.totalItems = headers('X-Total-Count');
							if (result.length > 0) {
								result = removeSelectedStudents(result);
								var studentsName = $filter('baseUsersInfos')(
										result);
								$scope.students = $scope.students
										.concat($filter("baseUsersInfos")(
												result));
								$scope.page = $scope.page + 1;
							}
						});

					}

					function removeSelectedStudents(students) {
						if($scope.class == undefined){
							return; 
						}
						angular.forEach($scope.class.students, function(
								selectedStudent, index) {
							angular.forEach(students, function(student,
									indexInner) {
								if (selectedStudent.id == student.id) {
									students.splice(indexInner, 1);
								}
							});
						});
						return students;
					}

					// TODO change it
					function calculateCurrentPageNumber(totalItems,
							numberOfElemet) {
						if (totalItems == null || totalItems == undefined) {
							return 0;
						}
						return (totalItems / numberOfElemet) - 1;
					}

					function activate() {
						$scope.leftValue = [];
						var leftcounter = 0;
						var rightcounter = 0;
						$scope.addValue = [];
						$scope.removeValue = [];

						$scope.options = {
							leftContainerScrollEnd : function() {
								loadMoreStudents(leftFilterText);
							},
							rightContainerScrollEnd : function() {
								return true;
							},
							leftContainerSearch : function(text) {
								$scope.students = [];
								$scope.page = $scope.page = 0;
								leftFilterText = text;
								loadMoreStudents(leftFilterText);
							},
							rightContainerSearch : function(text) {
								$scope.class.students = $filter('filter')(
										selectedStudents, {
											'name' : text
										})
							},
							leftContainerLabel : 'Eleves disponibles',
							rightContainerLabel : 'Eleves selectionnés',
							onMoveRight : function() {
								selectedStudents = selectedStudents.concat($scope.addValue);
								$scope.addValue = [];
							},
							onMoveLeft : function() {
								angular.forEach($scope.class.students, function(
										selectedStudent, index) {
									angular.forEach(students, function(student,
											indexInner) {
										if (selectedStudent.id == student.id) {
											students.splice(indexInner, 1);
										}
									});
								});
							}
						};

					}

					function updateSelectedStudents() {
						selectedStudents = angular.copy($scope.class.students)
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

				} ]);


angular.module('epiApp')
	.controller('classManagementDeleteController', function($scope, $uibModalInstance, groupEntity, Group) {

        $scope.group = groupEntity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function () {
        	Group.delete({id: groupEntity.id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });



angular.module('epiApp')
.controller('classManagementDetailController', function ($scope, $stateParams, groupEntity) {
    $scope.group = groupEntity; 
});
