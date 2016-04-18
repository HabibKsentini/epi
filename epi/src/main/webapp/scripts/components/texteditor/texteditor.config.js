var textAngular = angular.module('textAngular');
textAngular.requires.push('ui.bootstrap');

textAngular.controller('UploadImageModalController', function($scope,
		$uibModalInstance, Upload) {

	$scope.image = '';
	$scope.progress = 0;
	$scope.files = [];

	$scope.upload = function() {
		Upload.upload({
			url : 'exercises/uploadImage',
			file : $scope.file,
			method : 'POST'
		}).progress(function(evt) {
			$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
		}).success(function(data) {
			$scope.progress = 0;
			$scope.image = data.absolutePath;
		});
	};

	$scope.insert = function() {
		$uibModalInstance.close($scope.image);
	};
})

textAngular
		.config(function($provide) {
			$provide
					.decorator(
							'taOptions',
							[
									'$delegate',
									function(taOptions) {
										// $delegate is the taOptions we are
										// decorating
										// here we override the default toolbars
										// and classes specified in taOptions.
										taOptions.forceTextAngularSanitize = true; // set
																					// false
																					// to
																					// allow
																					// the
																					// textAngular-sanitize
																					// provider
																					// to
																					// be
																					// replaced
										taOptions.keyMappings = []; // allow
																	// customizable
																	// keyMappings
																	// for
																	// specialized
																	// key
																	// boards or
																	// languages
										taOptions.toolbar = [
												[ 'h1', 'h2', 'h3', 'h4', 'h5',
														'h6', 'p', 'pre',
														'quote' ],
												[ 'bold', 'italics',
														'underline', 'ul',
														'ol', 'redo', 'undo',
														'insertImage', 'clear' ],
												[ 'justifyLeft',
														'justifyCenter',
														'justifyRight',
														'justifyFull' ],
												[ 'insertLink', 'wordcount',
														'charcount' ] ];
										taOptions.classes = {
											focussed : 'focussed',
											toolbar : 'btn-toolbar',
											toolbarGroup : 'btn-group',
											toolbarButton : 'btn btn-default',
											toolbarButtonActive : 'active',
											disabled : 'disabled',
											textEditor : 'form-control',
											htmlEditor : 'form-control'
										};
										return taOptions; // whatever you
															// return will be
															// the taOptions
									} ]);

			$provide
					.decorator(
							'taOptions',
							[
									'taRegisterTool',
									'$delegate',
									'$uibModal',
									function(taRegisterTool, taOptions, $modal) {
										taRegisterTool(
												'uploadImage',
												{
													tooltip : 'Ins\u00e9rer une image',
													iconclass : "fa fa-image",
													action : function(deferred,
															restoreSelection) {
														$modal
																.open({
																	controller : 'UploadImageModalController',
																	templateUrl : 'scripts/components/texteditor/upload-image-dialog.html'
																}).result
																.then(
																		function(
																				result) {
																			restoreSelection();
																			document
																					.execCommand(
																							'insertImage',
																							true,
																							result);
																			deferred
																					.resolve();
																		},
																		function() {
																			deferred
																					.resolve();
																		});
														return false;
													}
												});
										taOptions.toolbar[1]
												.push('uploadImage');
										return taOptions;
									} ]);

		});
