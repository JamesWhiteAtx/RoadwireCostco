/*
RoadwireCostco Roadwire Services
(c) 2014 Roadwire, Inc.
*/
'use strict';

angular.module('roadwire.services', []) // 'ngResource'

.factory('NsUrl', ['$http', function ($http) {
    return function (type) {
        return $http.get('/netsuite/' + type, { cache: true })
            .then(function (result) {
                var url = result.data.url;
                return url;
            }, function (reason) {
                return reason;
            });
    };
}])

.factory('NsUrlJsonP', ['NsUrl', function (NsUrl) {
    return function (type) {
        return NsUrl(type)
            .then(function (url) {
                return url + "&callback=JSON_CALLBACK";
            }, function (reason) {
                return $q.reject(reason);
            });
    };
}])

.factory('Selector', ['$http', '$q', 'NsUrlJsonP', function ($http, $q, NsUrlJsonP) {
    return function (parmObj) {
        return NsUrlJsonP('leaslctr')
            .then(function (url) {
                return $http.jsonp(url, { params: parmObj });
            }, function (reason) {
                return $q.reject(reason);
            });
    };
}])

.factory('LoadGglMaps', ['$http', '$window', '$q', function ($http, $window, $q) {
    return function (gglMps) {
        // thanks to Neil Soult https://gist.github.com/neilsoult/7255583

        function load_script() {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBvV2XB3ToYVHeUNMbTrr2Otq7ngt5pHD8&sensor=true&libraries=geometry&callback=gglsrvccallback';
            document.body.appendChild(s);
        }

        function lazyLoadApi(key) {
            var deferred = $q.defer();
            $window.gglsrvccallback = function () {
                if ($window.google && $window.google.maps) {
                    deferred.resolve($window.google.maps);
                } else {
                    deferred.reject('gmaps not loaded');
                }
                $window.gglsrvccallback = undefined;
            };

            load_script();
            return deferred.promise;
        }

        if (gglMps && $window.google && (gglMps == $window.google.maps)) {
            return $q.when(gglMps);
        } else if ($window.google && $window.google.maps) {
            return $q.when($window.google.maps);
        } else {
            return lazyLoadApi();
        };

    };
}])

.factory('Installers', ['$http', function ($http) {
    return function () {
        return $http.get('/content/installers.json', { cache: true })
            .then(function (result) {
                return result.data;
            }, function (reason) {
                return reason;
            });
    };
}])

.factory('ColorList', ['$http', function ($http) {
    return function () {
        return $http.get('/api/content/colors', { cache: true })
            .then(function (result) {
                return result.data;
            }, function (reason) {
                return reason;
            });
    };
}])

.factory('InstMarkers', ['$q', 'Installers', 'LoadGglMaps', function ($q, Installers, LoadGglMaps) {

    var makeMarkers = function (fcn, gglMps) {
        var infowindow = new gglMps.InfoWindow({
            content: "Installer Location"
        });

        return Installers()
            .then(function (locs) {
                var markers = [];
                angular.forEach(locs, function (location) {
                    var latLng = new gglMps.LatLng(location.latitude, location.longitude);
                    var marker = new gglMps.Marker({
                        position: latLng,
                        title: location.title,
                        icon: 'http://maps.gstatic.com/mapfiles/markers2/measle.png'
                    });

                    markers.push(marker);
                    marker.location = location;
                    marker.infowindow = infowindow;

                    if (angular.isFunction(fcn)) {
                        fcn(marker);
                    }
                });
                return markers;
            });
    };

    var cacheMarkers;

    return function (fcn, gglMps) {
        if (cacheMarkers) {
            if (angular.isFunction(fcn)) {
                angular.forEach(cacheMarkers, function (marker) {
                    fcn(marker);
                });
            };
            return $q.when(cacheMarkers);
        } else {
            return LoadGglMaps(gglMps).then(function (gglMps) {
                return makeMarkers(fcn, gglMps).then(function (markers) {
                    cacheMarkers = markers;
                    return cacheMarkers;
                });
            });
        };
    };
}])

.factory('MarkersProx', ['$q', 'LoadGglMaps', function ($q, LoadGglMaps) {

    var deci = function (num) {
        return parseFloat(Math.round(num * 100) / 100).toFixed(2);
    };

    var sortProx = function (address, markers, fcn, gglMps) {
        var deferred = $q.defer();
        var geocoder = new gglMps.Geocoder();
        geocoder.geocode({ address: address },
            function (results_array, status) {
                if (status != gglMps.GeocoderStatus.OK) {
                    deferred.reject('No location found for "'+address+'"');
                    return;
                };
                //var ltlgAddr = new gglMps.LatLng(results_array[0].geometry.location.lat(),results_array[0].geometry.location.lng());
                var result = results_array[0];

                angular.forEach(markers, function (marker, idx) {
                    var ltlgShop = marker.position;
                    var proximitymeter = gglMps.geometry.spherical.computeDistanceBetween(result.geometry.location, ltlgShop);
                    var proximitymiles = proximitymeter * 0.000621371192;

                    marker.proximitymiles = proximitymiles;
                    marker.distance = deci(proximitymiles) + ' miles';
                });

                markers.sort(function (a, b) { return a.proximitymiles - b.proximitymiles });

                if (angular.isFunction(fcn)) {
                    fcn(markers, result);
                };
                deferred.resolve(markers);
            });
        return deferred.promise;
    };

    return function (address, markers, fcn, gglMps) {
        return LoadGglMaps(gglMps).then(function (gglMps) {
            return sortProx(address, markers, fcn, gglMps);
        });
    };
}])

.factory('FindInst', ['$q', 'InstMarkers', 'MarkersProx', function ($q, InstMarkers, MarkersProx) {
    return function (addr, radius) {
        var srchAddr;
        var instLocs = [];
        var deferred = $q.defer();
        InstMarkers().then(function (markers) {
            MarkersProx(addr, markers, function (markers, result) {
                srchAddr = result.formatted_address;
            })
            .then(
                function (markers) {
                    var marker;
                    for (var i = 0, len = markers.length; i < len; i++) {
                        marker = markers[i];

                        if (angular.isNumber(radius)) {
                            if (angular.isNumber(marker.proximitymiles) && (marker.proximitymiles > radius)) {
                                break;
                            }
                        } else if (i > 10) {
                            break;
                        }
                        if (angular.isNumber(marker.proximitymiles)) {
                            instLocs.push(marker);
                        };
                    };
                    deferred.resolve({ srchAddr: srchAddr, instLocs: instLocs });
                },
                function (err) {
                    deferred.reject(err);
                }
            )
        });
        return deferred.promise;
    };
}])

.factory('UsaMap', ['$timeout', 'LoadGglMaps', function ($timeout, LoadGglMaps) {
    var makeMap = function (mapDiv, gglMps) {
        var map;

        var ltlgCenter = new gglMps.LatLng(38.50, -94.93);// - 93.40);
        //var zoom = 5;
        var boundsUsa = new gglMps.LatLngBounds(new gglMps.LatLng(44.33714334714611, -110.39872070312504), new gglMps.LatLng(32.35854297823947, -81.30692382812504));
        var geocoder = new gglMps.Geocoder();
        geocoder.geocode({ address: 'USA' }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                ltlgCenter = results[0].geometry.location;
                boundsUsa = results[0].geometry.viewport;
                if (map && map.recenter) {
                    map.recenter();
                };
            }
        });

        var mapProp = {
            //center: ltlgCenter,
            //zoom: zoom,
            mapTypeId: gglMps.MapTypeId.ROADMAP
        };

        map = new gglMps.Map(document.getElementById(mapDiv), mapProp);

        var locMarker = new gglMps.Marker({
            position: ltlgCenter,
            title: 'location marker',
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow.png',
            visible: false
        });
        locMarker.setMap(map);

        locMarker.infowindow = new gglMps.InfoWindow({
            content: 'Current position'
        });

        locMarker.openInfo = function (cont) {
            if (cont) {
                locMarker.infowindow.content = cont;
                locMarker.title = cont;
            }
            locMarker.infowindow.open(map, locMarker);
        };

        gglMps.event.addListener(locMarker, 'click', function () {
            locMarker.openInfo();
        });

        var recenter = function () {
            //map.setCenter(ltlgCenter);
            //map.setZoom(zoom);
            map.fitBounds(boundsUsa);

            /*
            var rectangle = new google.maps.Rectangle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#ffd800',
                fillOpacity: 0.35,
                map: map,
                bounds: boundsUsa
            });
            map.setZoom(map.getZoom() + 1);
            */
        };

        map.locMarker = locMarker;
        map.recenter = recenter;

        return map;
    };

    return function (mapDiv, gglMps) {
        return LoadGglMaps(gglMps).then(function (gglMps) {
            return makeMap(mapDiv, gglMps);
        });
    };
}])

.factory('InstMap', ['LoadGglMaps', 'UsaMap', 'InstMarkers', 'MarkersProx', function (LoadGglMaps, UsaMap, InstMarkers, MarkersProx) {
    return function (mapDiv, gglMps) {
        var map;
        return LoadGglMaps(gglMps)
            .then(function (gMps) {
                if (!gglMps) {
                    gglMps = gMps;
                };
                // after google maps aquired, create map object
                return UsaMap(mapDiv, gglMps);
            })
            .then(function (gMap) {
                map = gMap;
                return map;
            })
            .then(function (map) {
                // after map object made, define extra functions
                map.proxInstallers = function (addr, fcn) {
                    return MarkersProx(addr, map.markers, function (markers, result) {
                        map.locMarker.openInfo(result.formatted_address);
                        map.locMarker.setPosition(result.geometry.location);
                        map.locMarker.setVisible(true);

                        var bounds = new gglMps.LatLngBounds();
                        var proxs = [];
                        angular.forEach(markers, function (marker, idx) {
                            if (idx < 5) {
                                marker.setVisible(true);
                                marker.setIcon(null);
                                bounds.extend(marker.position);
                                proxs.push(marker);
                            } else {
                                marker.setVisible(false);
                            };
                        });
                        bounds.extend(map.locMarker.position);
                        map.fitBounds(bounds);

                        if (angular.isFunction(fcn)) {
                            fcn(proxs);
                        };
                    },
                    gglMps);
                };

                map.reset = function () {
                    if (map.locMarker && map.locMarker.infowindow) {
                        map.locMarker.infowindow.close();
                    };
                    if (map.markers) {
                        angular.forEach(map.markers, function (marker) {
                            marker.setIcon('http://maps.gstatic.com/mapfiles/markers2/measle.png');
                            marker.setVisible(true);
                        });
                    };
                    map.recenter();
                };

                return map;
            })
            .then(function (map) {
                // after core map defined, assign installer markers to map
                return InstMarkers(function (marker) {
                    marker.setMap(map);

                    marker.openInfo = function () {
                        var html = '<div><p>' + marker.title + '</p>';
                        if (marker.distance) {
                            html += '<p>' + marker.distance + '</p>';
                        };
                        html += '</div>';
                        marker.infowindow.content = html;
                        marker.infowindow.open(map, marker);
                    };
                    marker.closeInfo = function () {
                        marker.infowindow.close();
                    };

                    gglMps.event.addListener(marker, 'click', function () {
                        marker.openInfo();
                    });
                },
                gglMps);
            })
            .then(function (markers) {
                // markers are assigned, set map property 
                map.markers = markers;
                // after all setup, return promise resolve to map to caller
                return map;
            })
        ;
    };

}])

.factory('WhyInstDlg', ['$modal', 'FindInst', function ($modal, FindInst) {

    var whyInstCtrl = function ($scope, $modalInstance, FindInst) {
        $scope.close = function () {
            $modalInstance.close();
        };

        $scope.isloading = false;
        $scope.srchAddr;
        $scope.radius = 100;
        $scope.proxLocs = [];

        $scope.findInstallers = function (addr, radius) {
            $scope.isloading = true;
            $scope.srchAddr = null;
            $scope.proxLocs = [];

            var prom = FindInst(addr, radius)
            prom.then(
                function (result) {
                    $scope.srchAddr = result.srchAddr;
                    $scope.proxLocs = result.instLocs;
                },
                function (err) {
                    $scope.srchAddr = err;
                }
            );
            prom['finally'](function (data) {
                $scope.isloading = false;
                //$scope.$apply();
            });
        };
    };

    return function () {
        var modalInstance = $modal.open({
            templateUrl: '/Partial/Home/WhyInstall',
            controller: whyInstCtrl,
            windowClass: 'why-install'
        });
    };
}])
;
