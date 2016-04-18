
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