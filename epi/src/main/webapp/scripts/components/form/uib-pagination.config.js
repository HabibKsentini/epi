'use strict';

angular.module('epiApp')
    .config(function (uibPaginationConfig) {
        uibPaginationConfig.itemsPerPage = 10;
        uibPaginationConfig.maxSize = 5;
        uibPaginationConfig.boundaryLinks = true;
        uibPaginationConfig.firstText = '«';
        uibPaginationConfig.previousText = '‹';
        uibPaginationConfig.nextText = '›';
        uibPaginationConfig.lastText = '»';
    });
