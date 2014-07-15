angular.module('roadwire.directives', [])
.directive('rwInstMap', ['$q', 'InstMap', function ($q, InstMap) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
            gglMaps: '=?',
            map: '=?'
        },
        template:
            '<div id="map-container">'+
                '<form ng-submit="loadInstallers()" id="srchform" name="srchform" novalidate="novalidate" ng-cloak>' +
                    '<label for="locaddr">Location</label>'+
                    '<input type="text" placeholder="current location" title="Enter Location (zip code)" name="locaddr" id="locaddr" ng-model="srchloc" required>'+
                    '<button type="submit" id="btnfind" title="Find Locations" ng-disabled="srchform.locaddr.$error.required">'+
                        '<span class="glyphicon glyphicon-search"></span>'+
                        'Find Locations'+
                    '</button>'+
                    '<button type="button" id="btnreset" title="Reset Map" ng-click="reset()">'+
                        '<span class="glyphicon glyphicon-refresh"></span>'+
                    '</button>' +
                    '<select ng-show="proxs && (proxs.length > 0)" ng-model="prox" ng-options="marker.proxDisp for marker in proxs">' +
                        '<option value="">-- {{proxs.length}} nearest locations --</option>' +
                    '</select>' +
                '</form>' +
                '<div ng-transclude></div>'+
                '<div id="map-canvas" map-refresh>map-canvas</div>' +
            '</div>',

        controller: function ($scope) {
            $scope.deferred = $q.defer();

            this.mapQ = function() {
                return $scope.deferred.promise;
            }
        },

        link: function (scope, element) {
            scope.proxs = [];
            scope.prox = null;
            var ctrlDiv = document.getElementById('srchform');
            ctrlDiv.style.display = 'none';
            InstMap('map-canvas', scope.gglMaps).then(function (gMap) {
                scope.map = gMap;
                ctrlDiv.index = 1;
                scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(ctrlDiv);

                scope.loadInstallers = function () {
                    scope.prox = null;
                    scope.proxs = [];
                    scope.map.proxInstallers(scope.srchloc,
                        function (proxs) {
                            angular.forEach(proxs, function (marker) {
                                marker.proxDisp = marker.distance + ' ' + marker.title;
                            });
                            scope.proxs = proxs;
                            scope.$apply();
                        }
                    );
                };
                scope.reset = function () {
                    scope.prox = null;
                    scope.proxs = [];
                    scope.map.reset();
                };
                ctrlDiv.style.display = 'block';

                scope.$watch('prox', function (marker, prev) {
                    if (prev && angular.isFunction(prev.closeInfo)) {
                        prev.closeInfo();
                    };
                    if (marker && angular.isFunction(marker.openInfo)) {
                        marker.openInfo();
                    }
                });
                scope.deferred.resolve(gMap);
            });
        }
    };
}])

.directive('gglMapCtrl', function ($timeout) {
    return {
        restrict: 'A',
        require: '^rwInstMap',
        link: function (scope, elem, attrs, instMapCtrl) {
            elem.hide();
            instMapCtrl.mapQ()
            .then(function (map) {
                var ctrlDiv = elem[0];
                ctrlDiv.index = 1;
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(ctrlDiv);
                elem.show();
            }, function (reason) {
                elem.hide();
            });
        }
    }
})

.directive('mapRefresh', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {
		    $timeout(function () {
		        if (scope.map) {
		            var center = scope.map.getCenter();
		            google.maps.event.trigger(scope.map, "resize");
		            scope.map.setCenter(center);
		        };
			});
		}
	}
})

;
