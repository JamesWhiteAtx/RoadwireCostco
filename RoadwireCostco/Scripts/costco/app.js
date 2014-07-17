/*
RoadwireCostco Costco App
(c) 2014 Roadwire, Inc.
*/

var costco = angular.module('costco', ['ngRoute', 'ngResource', 'routeStyles', 'ngAnimate', 'ui.bootstrap',
    'roadwire.directives', 'roadwire.services', 'costco.services', 'costco.directives'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/leather', {
            title: 'leather',
            templateUrl: '/Partial/Home/Leather',
            controller: "LeaCtrl",
            resolve: { Data: function (DataDeferred) { return DataDeferred(); } }
        });
        $routeProvider.when('/heaters', {
            title: 'heaters',
            templateUrl: '/Partial/Home/Heaters',
            controller: "HtrCtrl",
            resolve: { Data: function (DataDeferred) { return DataDeferred(); } }
        });
        $routeProvider.when('/install', {
            title: 'install',
            templateUrl: '/Partial/Home/Install',
            controller: "InstCtrl",
            resolve: { Data: function (DataDeferred) { return DataDeferred(); } }
        });
        $routeProvider.when('/confirm', {
            title: 'confirm',
            templateUrl: '/Partial/Home/Confirm',
            controller: "ConfirmCtrl",
            resolve: { Data: function (DataDeferred) { return DataDeferred(); } }
        });
        $routeProvider.when('/map', {
            title: 'map',
            templateUrl: '/Partial/Home/Map',
            controller: 'MapCtrl',
            css: '/Content/roadwire/map.css',
            resolve: {
                gglMaps: function ($q, LoadGglMaps) {
                    return LoadGglMaps();
                }
            }
        });

        $routeProvider.otherwise({ redirectTo: '/leather' });
    }])
    .run(['$rootScope', '$location', 'WidgetData', function ($rootScope, $location, WidgetData) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ((next.$$route) && (next.$$route.originalPath == '/heaters')) {
                var data = WidgetData();
                if (!data.order.hasLea()) {
                    $location.path("/leather");
                };
            };
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            if (current.$$route) {
                document.title = current.$$route.title;
            }
        });

    }])

;

//costco;


