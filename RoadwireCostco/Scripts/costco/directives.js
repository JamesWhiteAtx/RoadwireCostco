angular.module('costco.directives', [])

.directive('selCarSelect', function () {

    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            attrPlural: "@secPlural",
            attrName: "@secName",
            secMdName: "@secModel",  
            secModel: "=secModel",
            secHide: "@secOnlyOpts"
        },
        template:
            '<div class="sel-opt" ng-class="{selected: secModel.isSelected}" ng-hide="((secHide) && (secModel.list.length < 2))" > ' +
                '<div ng-show="secModel.isLoading"><span class="loading">Loading {{secPlural}}...</span></div>' +
                '<select id="slct-{{secId}}" title="{{secName}}" class="sel-slct"' +
                    'ng-disabled="secModel.isLoading || secModel.list.length == 0" ' +
                    'ng-hide="(secModel.isLoading)" ' +
                    'focus-it="secModel.shouldFocus" ' +
                    'ng-model="secModel.obj" ' +
                    'ng-options="i as i.name for i in secModel.list">' +
                    '<option value="">-- Select {{secName}} --</option>' +
                '</select>' +
            '</div>',
        link: function (scope, element) {
            scope.secName = scope.attrName || scope.secMdName.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            scope.secId = scope.secName.toLowerCase();
            scope.secPlural = scope.attrPlural || scope.secName + "s";
        }
    };
})
.directive('focusIt', function ($timeout) {
    return {
        scope: false,
        link: function (scope, element, attrs) {
            var trigger = attrs['focusIt'];
            if (trigger) {
                scope.$watch(trigger, function (value) {
                    if (value === true) {
                        //element[0].focus();
                        $timeout(function () {
                            element[0].focus();
                        }, 0);
                        scope.trigger = false;
                    }
                });
                element.bind("blur", function (e) {
                    $timeout(function () {
                        scope.$apply(trigger + "=false");
                    }, 0);
                });
            };
        }
    };
})

;