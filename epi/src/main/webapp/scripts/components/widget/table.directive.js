
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







angular.module('epiApp')
.factory('Helper', function () {
  'use strict';
  return {
    closestSlider: function (elem) {
      var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
      if (matchesSelector.bind(elem)('I')) {
        return elem.parentNode;
      }
      return elem;
    },
    getOffset: function (elem, fixedPosition) {
      var
        scrollX = 0,
        scrollY = 0,
        rect = elem.getBoundingClientRect();
      while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
        if (!fixedPosition && elem.tagName === 'BODY') {
          scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
          scrollY += document.documentElement.scrollTop || elem.scrollTop;
        } else {
          scrollX += elem.scrollLeft;
          scrollY += elem.scrollTop;
        }
        elem = elem.offsetParent;
      }
      return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        scrollX: scrollX,
        scrollY: scrollY
      };
    },
    // a set of RE's that can match strings and generate color tuples. https://github.com/jquery/jquery-color/
    stringParsers: [
      {
        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function (execResult) {
          return [
            execResult[1],
            execResult[2],
            execResult[3],
            execResult[4]
          ];
        }
      },
      {
        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function (execResult) {
          return [
            2.55 * execResult[1],
            2.55 * execResult[2],
            2.55 * execResult[3],
            execResult[4]
          ];
        }
      },
      {
        re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
        parse: function (execResult) {
          return [
            parseInt(execResult[1], 16),
            parseInt(execResult[2], 16),
            parseInt(execResult[3], 16)
          ];
        }
      },
      {
        re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
        parse: function (execResult) {
          return [
            parseInt(execResult[1] + execResult[1], 16),
            parseInt(execResult[2] + execResult[2], 16),
            parseInt(execResult[3] + execResult[3], 16)
          ];
        }
      }
    ]
  };
})
.factory('Color', ['Helper', function (Helper) {
  'use strict';
  return {
    value: {
      h: 1,
      s: 1,
      b: 1,
      a: 1
    },
    // translate a format from Color object to a string
    'rgb': function () {
      var rgb = this.toRGB();
      return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    },
    'rgba': function () {
      var rgb = this.toRGB();
      return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
    },
    'hex': function () {
      return  this.toHex();
    },

    // HSBtoRGB from RaphaelJS
    RGBtoHSB: function (r, g, b, a) {
      r /= 255;
      g /= 255;
      b /= 255;

      var H, S, V, C;
      V = Math.max(r, g, b);
      C = V - Math.min(r, g, b);
      H = (C === 0 ? null :
          V === r ? (g - b) / C :
              V === g ? (b - r) / C + 2 :
                  (r - g) / C + 4
          );
      H = ((H + 360) % 6) * 60 / 360;
      S = C === 0 ? 0 : C / V;
      return {h: H || 1, s: S, b: V, a: a || 1};
    },

    //parse a string to HSB
    setColor: function (val) {
      val = (val) ? val.toLowerCase() : val;
      for (var key in Helper.stringParsers) {
        if (Helper.stringParsers.hasOwnProperty(key)) {
          var parser = Helper.stringParsers[key];
          var match = parser.re.exec(val),
              values = match && parser.parse(match);
          if (values) {
            this.value = this.RGBtoHSB.apply(null, values);
            return false;
          }
        }
      }
    },

    setHue: function (h) {
      this.value.h = 1 - h;
    },

    setSaturation: function (s) {
      this.value.s = s;
    },

    setLightness: function (b) {
      this.value.b = 1 - b;
    },

    setAlpha: function (a) {
      this.value.a = parseInt((1 - a) * 100, 10) / 100;
    },

    // HSBtoRGB from RaphaelJS
    // https://github.com/DmitryBaranovskiy/raphael/
    toRGB: function (h, s, b, a) {
      if (!h) {
        h = this.value.h;
        s = this.value.s;
        b = this.value.b;
      }
      h *= 360;
      var R, G, B, X, C;
      h = (h % 360) / 60;
      C = b * s;
      X = C * (1 - Math.abs(h % 2 - 1));
      R = G = B = b - C;

      h = ~~h;
      R += [C, X, 0, 0, X, C][h];
      G += [X, C, C, X, 0, 0][h];
      B += [0, 0, X, C, C, X][h];
      return {
        r: Math.round(R * 255),
        g: Math.round(G * 255),
        b: Math.round(B * 255),
        a: a || this.value.a
      };
    },

    toHex: function (h, s, b, a) {
      var rgb = this.toRGB(h, s, b, a);
      return '#' + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1);
    }
  };
}])
.factory('Slider', ['Helper', function (Helper) {
  'use strict';
  var
      slider = {
        maxLeft: 0,
        maxTop: 0,
        callLeft: null,
        callTop: null,
        knob: {
          top: 0,
          left: 0
        }
      },
      pointer = {};

  return {
    getSlider: function() {
      return slider;
    },
    getLeftPosition: function(event) {
      return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || pointer.left) - pointer.left)));
    },
    getTopPosition: function(event) {
      return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || pointer.top) - pointer.top)));
    },
    setSlider: function (event, fixedPosition) {
      var
        target = Helper.closestSlider(event.target),
        targetOffset = Helper.getOffset(target, fixedPosition),
        rect = target.getBoundingClientRect(),
        offsetX = event.clientX - rect.left,
        offsetY = event.clientY - rect.top;

      slider.knob = target.children[0].style;
      slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX;
      slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY;

      pointer = {
        left: event.pageX - (offsetX - slider.left),
        top: event.pageY - (offsetY - slider.top)
      };
    },
    setSaturation: function(event, fixedPosition, componentSize) {
      slider = {
        maxLeft: componentSize,
        maxTop: componentSize,
        callLeft: 'setSaturation',
        callTop: 'setLightness'
      };
      this.setSlider(event, fixedPosition);
    },
    setHue: function(event, fixedPosition, componentSize) {
      slider = {
        maxLeft: 0,
        maxTop: componentSize,
        callLeft: false,
        callTop: 'setHue'
      };
      this.setSlider(event, fixedPosition);
    },
    setAlpha: function(event, fixedPosition, componentSize) {
      slider = {
        maxLeft: 0,
        maxTop: componentSize,
        callLeft: false,
        callTop: 'setAlpha'
      };
      this.setSlider(event, fixedPosition);
    },
    setKnob: function(top, left) {
      slider.knob.top = top + 'px';
      slider.knob.left = left + 'px';
    }
  };
}])
.directive('colorpicker', ['$document', '$compile', 'Color', 'Slider', 'Helper', function ($document, $compile, Color, Slider, Helper) {
  'use strict';
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function ($scope, elem, attrs, ngModel) {
      var
          thisFormat = attrs.colorpicker ? attrs.colorpicker : 'hex',
          position = angular.isDefined(attrs.colorpickerPosition) ? attrs.colorpickerPosition : 'bottom',
          inline = angular.isDefined(attrs.colorpickerInline) ? attrs.colorpickerInline : false,
          fixedPosition = angular.isDefined(attrs.colorpickerFixedPosition) ? attrs.colorpickerFixedPosition : false,
          target = angular.isDefined(attrs.colorpickerParent) ? elem.parent() : angular.element(document.body),
          withInput = angular.isDefined(attrs.colorpickerWithInput) ? attrs.colorpickerWithInput : false,
          componentSize = angular.isDefined(attrs.colorpickerSize) ? attrs.colorpickerSize : 100,
          componentSizePx = componentSize + 'px',
          inputTemplate = withInput ? '<input type="text" name="colorpicker-input" spellcheck="false">' : '',
          closeButton = !inline ? '<button type="button" class="close close-colorpicker">&times;</button>' : '',
          template =
              '<div class="colorpicker dropdown">' +
                  '<div class="dropdown-menu">' +
                  '<colorpicker-saturation><i></i></colorpicker-saturation>' +
                  '<colorpicker-hue><i></i></colorpicker-hue>' +
                  '<colorpicker-alpha><i></i></colorpicker-alpha>' +
                  '<colorpicker-preview></colorpicker-preview>' +
                  inputTemplate +
                  closeButton +
                  '</div>' +
                  '</div>',
          colorpickerTemplate = angular.element(template),
          pickerColor = Color,
          componentSizePx,
          sliderAlpha,
          sliderHue = colorpickerTemplate.find('colorpicker-hue'),
          sliderSaturation = colorpickerTemplate.find('colorpicker-saturation'),
          colorpickerPreview = colorpickerTemplate.find('colorpicker-preview'),
          pickerColorPointers = colorpickerTemplate.find('i');

      $compile(colorpickerTemplate)($scope);
      colorpickerTemplate.css('min-width', parseInt(componentSize) + 29 + 'px');
      sliderSaturation.css({
        'width' : componentSizePx,
        'height' : componentSizePx
      });
      sliderHue.css('height', componentSizePx);

      if (withInput) {
        var pickerColorInput = colorpickerTemplate.find('input');
        pickerColorInput.css('width', componentSizePx);
        pickerColorInput
            .on('mousedown', function(event) {
              event.stopPropagation();
            })
          .on('keyup', function() {
            var newColor = this.value;
            elem.val(newColor);
            if (ngModel && ngModel.$modelValue !== newColor) {
              $scope.$apply(ngModel.$setViewValue(newColor));
              update(true);
            }
          });
      }

      function bindMouseEvents() {
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      }

      if (thisFormat === 'rgba') {
        colorpickerTemplate.addClass('alpha');
        sliderAlpha = colorpickerTemplate.find('colorpicker-alpha');
        sliderAlpha.css('height', componentSizePx);
        sliderAlpha
            .on('click', function(event) {
              Slider.setAlpha(event, fixedPosition, componentSize);
              mousemove(event);
            })
            .on('mousedown', function(event) {
              Slider.setAlpha(event, fixedPosition, componentSize);
              bindMouseEvents();
            })
            .on('mouseup', function(event){
              emitEvent('colorpicker-selected-alpha');
            });
      }

      sliderHue
          .on('click', function(event) {
            Slider.setHue(event, fixedPosition, componentSize);
            mousemove(event);
          })
          .on('mousedown', function(event) {
            Slider.setHue(event, fixedPosition, componentSize);
            bindMouseEvents();
          })
          .on('mouseup', function(event){
            emitEvent('colorpicker-selected-hue');
          });

      sliderSaturation
          .on('click', function(event) {
            Slider.setSaturation(event, fixedPosition, componentSize);
            mousemove(event);
            if (angular.isDefined(attrs.colorpickerCloseOnSelect)) {
              hideColorpickerTemplate();
            }
          })
          .on('mousedown', function(event) {
            Slider.setSaturation(event, fixedPosition, componentSize);
            bindMouseEvents();
          })
          .on('mouseup', function(event){
            emitEvent('colorpicker-selected-saturation');
          });

      if (fixedPosition) {
        colorpickerTemplate.addClass('colorpicker-fixed-position');
      }

      colorpickerTemplate.addClass('colorpicker-position-' + position);
      if (inline === 'true') {
        colorpickerTemplate.addClass('colorpicker-inline');
      }

      target.append(colorpickerTemplate);

      if (ngModel) {
        ngModel.$render = function () {
          elem.val(ngModel.$viewValue);

          update();
        };
      }

      elem.on('blur keyup change', function() {
        update();
      });

      elem.on('$destroy', function() {
        colorpickerTemplate.remove();
      });

      function previewColor() {
        try {
          colorpickerPreview.css('backgroundColor', pickerColor[thisFormat]());
        } catch (e) {
          colorpickerPreview.css('backgroundColor', pickerColor.toHex());
        }
        sliderSaturation.css('backgroundColor', pickerColor.toHex(pickerColor.value.h, 1, 1, 1));
        if (thisFormat === 'rgba') {
          sliderAlpha.css.backgroundColor = pickerColor.toHex();
        }
      }

      function mousemove(event) {
        var 
            left = Slider.getLeftPosition(event),
            top = Slider.getTopPosition(event),
            slider = Slider.getSlider();

        Slider.setKnob(top, left);

        if (slider.callLeft) {
          pickerColor[slider.callLeft].call(pickerColor, left / componentSize);
        }
        if (slider.callTop) {
          pickerColor[slider.callTop].call(pickerColor, top / componentSize);
        }
        previewColor();
        var newColor = pickerColor[thisFormat]();
        elem.val(newColor);
        if (ngModel) {
          $scope.$apply(ngModel.$setViewValue(newColor));
        }
        if (withInput) {
          pickerColorInput.val(newColor);
        }
        return false;
      }

      function mouseup() {
        emitEvent('colorpicker-selected');
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }

      function update(omitInnerInput) {
        pickerColor.setColor(elem.val());
        if (withInput && !omitInnerInput) {
          pickerColorInput.val(elem.val());
        }
        pickerColorPointers.eq(0).css({
          left: pickerColor.value.s * componentSize + 'px',
          top: componentSize - pickerColor.value.b * componentSize + 'px'
        });
        pickerColorPointers.eq(1).css('top', componentSize * (1 - pickerColor.value.h) + 'px');
        pickerColorPointers.eq(2).css('top', componentSize * (1 - pickerColor.value.a) + 'px');
        previewColor();
      }

      function getColorpickerTemplatePosition() {
        var
            positionValue,
            positionOffset = Helper.getOffset(elem[0]);

        if(angular.isDefined(attrs.colorpickerParent)) {
          positionOffset.left = 0;
          positionOffset.top = 0;
        }

        if (position === 'top') {
          positionValue =  {
            'top': positionOffset.top - 147,
            'left': positionOffset.left
          };
        } else if (position === 'right') {
          positionValue = {
            'top': positionOffset.top,
            'left': positionOffset.left + 126
          };
        } else if (position === 'bottom') {
          positionValue = {
            'top': positionOffset.top + elem[0].offsetHeight + 2,
            'left': positionOffset.left
          };
        } else if (position === 'left') {
          positionValue = {
            'top': positionOffset.top,
            'left': positionOffset.left - 150
          };
        }
        return {
          'top': positionValue.top + 'px',
          'left': positionValue.left + 'px'
        };
      }

      function documentMousedownHandler() {
        hideColorpickerTemplate();
      }

      function showColorpickerTemplate() {

        if (!colorpickerTemplate.hasClass('colorpicker-visible')) {
          update();
          colorpickerTemplate
            .addClass('colorpicker-visible')
            .css(getColorpickerTemplatePosition());
          emitEvent('colorpicker-shown');

          if (inline === false) {
            // register global mousedown event to hide the colorpicker
            $document.on('mousedown', documentMousedownHandler);
          }

          if (attrs.colorpickerIsOpen) {
            $scope[attrs.colorpickerIsOpen] = true;
            if (!$scope.$$phase) {
              $scope.$digest(); //trigger the watcher to fire
            }
          }
        }
      }

      if (inline === false) {
        elem.on('click', showColorpickerTemplate);
      } else {
        showColorpickerTemplate();
      }

      colorpickerTemplate.on('mousedown', function (event) {
        event.stopPropagation();
        event.preventDefault();
      });

      function emitEvent(name) {
        if (ngModel) {
          $scope.$emit(name, {
            name: attrs.ngModel,
            value: ngModel.$modelValue
          });
        }
      }

      function hideColorpickerTemplate() {
        if (colorpickerTemplate.hasClass('colorpicker-visible')) {
          colorpickerTemplate.removeClass('colorpicker-visible');
          emitEvent('colorpicker-closed');
          // unregister the global mousedown event
          $document.off('mousedown', documentMousedownHandler);

          if (attrs.colorpickerIsOpen) {
            $scope[attrs.colorpickerIsOpen] = false;
            if (!$scope.$$phase) {
              $scope.$digest(); //trigger the watcher to fire
            }
          }
        }
      }

      colorpickerTemplate.find('button').on('click', function () {
        hideColorpickerTemplate();
      });

      if (attrs.colorpickerIsOpen) {
        $scope.$watch(attrs.colorpickerIsOpen, function(shouldBeOpen) {

          if (shouldBeOpen === true) {
            showColorpickerTemplate();
          } else if (shouldBeOpen === false) {
            hideColorpickerTemplate();
          }

        });
      }
    }
  };
}]);
