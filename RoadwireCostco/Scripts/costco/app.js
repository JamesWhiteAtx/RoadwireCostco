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
            resolve: { Data: function (WidgetData) { return WidgetData(); } }
        });
        $routeProvider.when('/heaters', {
            title: 'heaters',
            templateUrl: '/Partial/Home/Heaters',
            controller: "HtrCtrl",
            resolve: { Data: function (WidgetData) { return WidgetData(); } }
        });
        $routeProvider.when('/install', {
            title: 'install',
            templateUrl: '/Partial/Home/Install',
            controller: "InstCtrl",
            resolve: { Data: function (WidgetData) { return WidgetData(); } }
        });
        $routeProvider.when('/confirm', {
            title: 'confirm',
            templateUrl: '/Partial/Home/Confirm',
            controller: "ConfirmCtrl",
            resolve: { Data: function (WidgetData) { return WidgetData();} }
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
;

costco.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.$$route) {
            document.title = current.$$route.title;
        }
    });

}])
;


