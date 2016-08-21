'use strict';

angular
		.module('epiApp')
		.config(
				function($stateProvider) {
					$stateProvider
							.state(
									'topic-management',
									{
										parent : 'site',
										url : '/topic-management',
										data : {
											authorities : [ 'ROLE_ADMIN' ],
											pageTitle : 'topic.home.title'
										},
										views : {
											'content@site' : {
												templateUrl : 'scripts/app/admin/topic/topic.html',
												controller : 'TopicManagementController'
											}
										},
										resolve : {
											translatePartialLoader : [
													'$translate',
													'$translatePartialLoader',
													function($translate,
															$translatePartialLoader) {
														$translatePartialLoader
																.addPart('topic');
														return $translate
																.refresh();
													} ]
										}
									})
									
									
									  .state('topic-management.new', {
                parent: 'topic-management',
                url: '/new',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: '/scripts/app/admin/topic/topic-dialog.html',
                        controller: 'TopicManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null, 
                                    topicColor: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('topic-management', null, { reload: true });
                    }, function() {
                        $state.go('topic-management');
                    })
                }]
            })
            
            
            .state('topic-management.edit', {
                parent: 'topic-management',
                url: '/{id}/edit',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: '/scripts/app/admin/topic/topic-dialog.html',
                        controller: 'TopicManagementDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Topic', function(Topic) {
                                return Topic.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('topic-management', null, { reload: true });
                    }, function() {
                        $state.go('topic-management');
                    })
                }]
            })
            
               .state('topic-management.delete', {
                parent: 'topic-management',
                url: '/{id}/delete',
                data: {
                	 authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/admin/topic/topic-delete-dialog.html',
                        controller: 'TopicManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Topic', function(Topic) {
                                return Topic.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            }); 
									
				});








'use strict';

angular.module('epiApp').controller('TopicManagementController',
		function($scope, Topic) {

			init();

			function init() {
				Topic.query().$promise.then(function(data) {
					$scope.topics = data;
				});	
			}

		});


angular.module('epiApp').controller('TopicManagementDialogController',
		function($scope, entity, Topic, $uibModalInstance) {

			initTopic(); 
			$scope.clear = clear;
			$scope.save = save;

			function initTopic() {
				if (entity == undefined) {
					throw new Error("topic is null !");
				}
				if (entity.$promise == undefined) {
					$scope.topic = entity;
				} else {
					entity.$promise.then(function(data) {
						$scope.topic = data;
					})
				}
			}

			function save() {
				Topic.save($scope.topic, onSaveSuccess, onSaveError);
			}

			function onSaveSuccess(result) {
				$uibModalInstance.close(result);
			}

			function onSaveError(result) {
				console.log("save error");
			}

			function clear() {
				$uibModalInstance.dismiss('cancel');
			}
			;

		});


'use strict';

angular.module('epiApp')
	.controller('TopicManagementDeleteController', function($scope, $uibModalInstance, entity, Topic) {
		
		init(); 
		
		function init(){
		        entity.$promise.then(function(data) {
					$scope.topic = data;
				})
		        
		}        
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function () {
            Topic.delete({id: $scope.topic.id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
