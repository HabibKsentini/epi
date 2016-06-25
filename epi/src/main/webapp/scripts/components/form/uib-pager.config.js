'use strict';

angular.module('epiApp')
    .config(function (uibPagerConfig) {
        uibPagerConfig.itemsPerPage = 10;
        uibPagerConfig.previousText = '«';
        uibPagerConfig.nextText = '»';
    });
