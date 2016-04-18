
/**
 * Opens a confirmation dialog with the buttons ok/cancel and the text
 * translated by the translate code.
 * 
 * @param translateCode
 *          The text to insert into the modal, given by a translation code.
 * @returns {*} The $modalInstance
 * @author hksentini
 * @example ConfirmationDialogService.openConfirmationDialog('translateCode').result
 *          .then(methodNameToInvokeOnClickOK);
 */
(function() {
  'use strict';

  angular.module('epiApp').factory('ConfirmationDialogService',
          ConfirmationDialogService);
  ConfirmationDialogService.$inject = ['$uibModal'];

  function ConfirmationDialogService($modal) {
    var service = {
      openConfirmationDialog: openConfirmationDialog
    };
    return service;
    function openConfirmationDialog(translateCode, translationParam) {
      return $modal
              .open({
                backdrop: 'static',
                templateUrl: '/scripts/components/dialog/confirmation-dialog.tpl',
                controller: 'ConfirmationDialogController',
                resolve: {
                  translationCode: function() {
                    return translateCode;
                  }, 
                  translationParam: function(){
                	  return translationParam || ""; 
                  }
                }
              });
    }

  }
})();