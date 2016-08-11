
(function(window, document) {

/**
* NvTable (main) Directive
*
* The directive adds a controller to the table element, which can be used in
* child directives for communication.
* *@author hksentini 
*/
angular.module('epiApp').directive('nvTable', function() {
  return {
    restrict: 'A',
    scope: {
      sorting: '=?', 
      updateFn: '&'
    },
    controller: ['$scope', function($scope) {
      var self = this;


      this.sortingParams = {
        sortArray: [],
        single: true
      };

      // Copy sortArray to scope binding
      $scope.$watch(function() {
        return self.sortingParams.sortArray;
      }, function(sortArray) {
        if (!angular.isArray($scope.sorting)) {
          $scope.sorting = [];
        }
        $scope.sorting.splice(0, $scope.sorting.length);
        for (var i = 0; i < sortArray.length; i++) {
          $scope.sorting.push(sortArray[i]);
        }
        $scope.updateFn();
      }, true);
    }]
  };
});

/**
* SortBy Directive
*
* Add sorting interface to TH elements which have the `sortBy` attribute on
* them. The directive accepts the parameter `sortBy`, which should correspond
* to the key on the table items on which to sort.
*
*     <th sortBy="name">Name</th>
*@author hksentini 
* The directive is required to be on a child of an nvTable, as it communicates
* with the nvTable controller.
*/
angular.module('epiApp').directive('sortBy', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    scope: true,
    require: '^nvTable',
    template: '\
    <th class="sort" ng-click="sort()" ng-class="{\
      \'sort-asc\': state === \'asc\',\
      \'sort-desc\': state === \'desc\'\
    }">\
    </th>',
    
    link: function(scope, element, attrs, controller) {

        // Copy the sorting parameters from the siTable controller. Since
        // we're copying a reference, the parameters will stay in sync.
        var params = controller.sortingParams;

        // Observe the value of the `sortBy` attribute and update the
        // internal model
        attrs.$observe('sortBy', function(sortBy) {
          scope.sortBy = sortBy;
        });

        // If the sortInit attribute is set, then initialize sorting on this
        // header
        if (attrs.sortInit === 'desc') { 
          params.sortArray.push( sortBy + ',desc');
          scope.state = 'desc';
        } else if (attrs.sortInit) {
          params.sortArray.push(attrs.sortBy + ',asc');
          scope.state = 'asc';
        }

        scope.sort = function() {
          var sortBy = attrs.sortBy;
          if (!sortBy || !params) {
            return;
          }

          
          if (params.single) {
            $rootScope.$broadcast('resetSorting');
          }

          // Tri-state: ascending -> descending -> neutral, represented by
          // an array as per Angular's orderBy specification.

          // ascending -> descending
          if (params.sortArray.indexOf(sortBy + ',asc') !== -1) {
        	  var sortParam = sortBy + ',desc'; 
            if (params.single) {
              params.sortArray = [sortParam];
            } else {
              params.sortArray[params.sortArray.indexOf(sortBy + ',asc')] = sortParam;
            }
            scope.state = 'desc';

          // descending -> neutral
          } else if (params.sortArray.indexOf(sortBy + ',desc') !== -1) {
            if (params.single) {
              params.sortArray = [];
            } else {
              params.sortArray.splice(params.sortArray.indexOf(sortBy + ',desc'), 1);
            }
            scope.state = '';

          // neutral -> ascending
          } else {
        	  var sortParam = sortBy + ',asc'; 
            if (params.single) {
              params.sortArray = [sortParam];
            } else {
              params.sortArray.push(sortParam);
            }
            scope.state = 'asc';
          }
        };

        scope.$on('resetSorting', function(event) {
          scope.state = '';
        });

      }
  };
}]);

})(window, document);


(function () {
    'use strict';

    angular.module('epiApp').directive('duallist', ngDuallist)
        .run(templateCache)

    ngDuallist.$inject = ['$rootScope', '$filter', '$parse'];
    templateCache.$inject = ['$templateCache', '$parse'];

    /* @ngInject */
    function ngDuallist($rootScope, $filter, $parse) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                leftscope: '=',
                rightscope: '=',
                'duallistOption': '=',
                leftsearch: '=',
                rightsearch: '=',
                addscope: '=',
                removescope: '='
            },
            bindToController: false,
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'dual/duallist.html';
            },
            replace: true
        };
        return directive;

        function link(scope, element, attrs, controller) {



            if (scope.duallistOption.leftContainerScrollEnd) { // excecute the left container scroll end event
                $(element).find('.left-sub-container').bind('scroll', function () {
                    console.log($(this)[0].scrollHeight - $(this).scrollTop())
                    console.log($(this).outerHeight())
                    if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).height()) {

                        scope.$evalAsync(scope.duallistOption.leftContainerScrollEnd);
                    };
                });
            }

            if (scope.duallistOption.rightContainerScrollEnd) { // execute the righ contained scroll end event
                $(element).find('.right-sub-container').bind('scroll', function () {
                    if ($(this)[0].scrollHeight - $(this).scrollTop() === $(this).height()) {
                        scope.$evalAsync(scope.duallistOption.rightContainerScrollEnd);
                    };
                });
            }
            if (scope.duallistOption.leftContainerSearch) { //left seracg text chage
                $(element).find('#leftsearch').bind("change paste keyup", function () {
                    var value = $(this).val();
                    scope.$evalAsync(scope.duallistOption.leftContainerSearch(value));

                })
            }

            if (scope.duallistOption.rightContainerSearch) { //right serach text chage
                $(element).find('#rightsearch').bind("change paste keyup", function () {
                    var value = $(this).val();
                    scope.$evalAsync(scope.duallistOption.rightContainerSearch(value));

                })
            }

            if (scope.duallistOption.onMoveRight) { //right serach text chage
                $(element).find('#moveRightButton').bind("click", function () {

                    scope.$evalAsync(scope.duallistOption.onMoveRight)

                })
            }


            if (scope.duallistOption.onMoveLeft) { //right serach text chage
                $(element).find('#moveLeftButton').bind("click", function () {

                    scope.$evalAsync(scope.duallistOption.onMoveLeft);

                })
            };






        }

    }

    Controller.$inject = ['$scope'];

    /* @ngInject */
    function Controller($scope) {







        /**
         * @description move the selected item to the right
         */
        $scope.moveRight = function () {


            for (var i = 0; i < $scope.leftscope.length; i++) {
                if ($scope.leftscope[i].selected) {
                    $scope.leftscope[i].selected = false
                    $scope.rightscope.push($scope.leftscope[i]);
                    // get the add objects
                    $scope.addscope.push($scope.leftscope[i]);
                    var index = $scope.leftscope.indexOf($scope.leftscope[i]);
                    $scope.leftscope.splice(index, 1)
                    i--
                }

            }



            $scope.leftSelectAll = false;

        };


        /**
         * @description move the selected item to the left
         */
        $scope.moveLeft = function () {
            //var leftSelectedValue=$filter()
            // console.log($scope.rightscope)
            for (var i = 0; i < $scope.rightscope.length; i++) {
                // console.log(i)
                if ($scope.rightscope[i].selected) {
                    $scope.rightscope[i].selected = false
                    $scope.leftscope.push($scope.rightscope[i]);
                    // get the remove objects
                    $scope.removescope.push($scope.rightscope[i]);
                    var index = $scope.rightscope.indexOf($scope.rightscope[i]);
                    // console.log(index)
                    $scope.rightscope.splice(index, 1)
                    i--
                }

            }
            $scope.rightSelectAll = false;
        };




        /**
         * @description select all left container
         */
        $scope.selectAllLeftContainer = function () {

            angular.forEach($scope.leftscope, function (val) {
                if ($scope.leftSelectAll) {
                    val.selected = true;
                } else {
                    val.selected = false;
                }
            })
        }

        /**
         * @description select all right container
         */
        $scope.selectAllRightContainer = function () {
            angular.forEach($scope.rightscope, function (val) {
                if ($scope.rightSelectAll) {
                    val.selected = true;
                } else {
                    val.selected = false;
                }
            });
        }

    }

    function templateCache($templateCache) {
        $templateCache.put('dual/duallist.html', '<div class="row ngduallist"><div class="col-sm-4 left-container"><label>{{duallistOption.leftContainerLabel}}</label><span class=info-container><span class=info ng-if="leftscope.length > 0">Showing all {{leftscope.length}}</span> <span class=info ng-if="leftscope.length == 0">Empty List</span></span><form class=form-inline><div><div class=input-group><input class=form-control id=leftsearch placeholder=Search><div class=input-group-addon><input title="toggle all" class="all pull-right" ng-model=leftSelectAll ng-change=selectAllLeftContainer() type=checkbox></div></div></div></form><div class=left-sub-container><div class=list-group id=list1><div ng-class="{active:data.selected}" ng-repeat="data in leftscope track by $index" class=list-group-item>{{data.name}} <input class=pull-right ng-model=data.selected type=checkbox></div></div></div></div><div class="col-md-2 v-center"><button id=moveRightButton ng-click=moveRight() title="Send to list 2" class="btn btn-default center-block add"><i class="glyphicon glyphicon-chevron-right"></i></button> <button id=moveLeftButton ng-click=moveLeft() title="Send to list 1" class="btn btn-default center-block remove"><i class="glyphicon glyphicon-chevron-left"></i></button></div><div class="col-sm-4 right-container"><label>{{duallistOption.rightContainerLabel}}</label><span class=info-container><span class=info ng-if="rightscope.length > 0">Showing all {{rightscope.length}}</span> <span class=info ng-if="rightscope.length == 0">Empty List</span></span><form class=form-inline><div><div class=input-group><input class=form-control id=rightsearch placeholder=Search><div class=input-group-addon><input ng-model=rightSelectAll ng-change=selectAllRightContainer() title="toggle all" class="all pull-right" type=checkbox></div></div></div></form><div class=right-sub-container><div class=list-group id=list2><div ng-class="{active:data.selected}" ng-repeat="data in rightscope track by $index" class=list-group-item>{{data.name}} <input ng-model=data.selected class=pull-right type=checkbox></div></div></div></div></div>');

    }






})();







