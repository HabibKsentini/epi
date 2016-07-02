'use strict';



angular
		.module('epiApp')
		.config(
				function($stateProvider) {
					$stateProvider
							.state(
									'exercise',
									{
										abstract : true,
										parent : 'site',
										url : '/exercise',
										views : {
											'content@site' : {
												templateUrl : 'scripts/app/exercise/app.tpl.exercise.html',
												controller : 'ExerciseController',
												controllerAs : 'ExerciseController'
											}
										},
										resolve : {
											mainTranslatePartialLoader : [
													'$translate',
													'$translatePartialLoader',
													function($translate,
															$translatePartialLoader) {
														$translatePartialLoader
																.addPart('exercise');
														return $translate
																.refresh();
													} ]
										}
									})

							.state(
									'exercise-edit',
									{
										parent : 'site',
										url : '/exercise/edit/:id',
										data : {
											authorities : []
										},
										views : {
											'content@site' : {
												templateUrl : 'scripts/app/exercise/exercise-edit.html', 
												controller : 'ExerciseEditController',
												controllerAs : 'ExerciseController'
											}
										},
										resolve : {
											mainTranslatePartialLoader : [
													'$translate',
													'$translatePartialLoader',
													function($translate,
															$translatePartialLoader) {
														$translatePartialLoader
																.addPart('exercise');
														return $translate
																.refresh();
													} ]
										}
									})

							.state(
									'exercise-details',
									{
										parent : 'site',
										url : '/exercise/details/:id',
										data : {
											authorities : []
										},
										views : {
											'content@site' : {
												templateUrl : 'scripts/app/exercise/exercise-details.html',
												controller : 'ExerciseDetailsController',
												controllerAs : 'ExerciseDetailsController'

											}
										},
										resolve : {
											mainTranslatePartialLoader : [
													'$translate',
													'$translatePartialLoader',
													function($translate,
															$translatePartialLoader) {
														$translatePartialLoader
																.addPart('exercise');
														return $translate
																.refresh();
													} ]
										}
									})
							.state(
									'exercise-new',
									{
										parent : 'exercise',
										url : '/new',
										data : {
											authorities : []
										},
										views : {
											'exercise-content@exercise' : {
												templateUrl : 'scripts/app/exercise/exercise.html',
											}
										}
									})
							.state(
									'exercise-preview',
									{
										parent : 'exercise',
										url : '/preview',
										data : {
											authorities : []
										},
										views : {
											'exercise-content@exercise' : {
												templateUrl : 'scripts/app/exercise/exercise-preview.html',
											}
										}
									});

				});
