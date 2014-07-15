/*
Roadwire eBay Store v1.0.2
(c) 2014 Roadwire, Inc.
*/
(function (jPw, $, undefined) {
    jPw.slctUrl = "https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=65&deploy=1&compid=801095&h=692d92024556819e1ec4&callback=JSON_CALLBACK";

    jPw.cachedScript = function (url, options) {
        // allow user to set any option except for dataType, cache, and url
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return $.ajax(options);
    };

    jPw.makeSlctLevel = function ($scope, $http, options) {
        var prevLvl = options.prev;
        var nextLvl;

        var lvlDefn = {
            name: options.name,
            title: options.title,
            type: options.type,
            listProp: options.list,
            parmsArr: options.parms,
            listFcn: options.listFcn,
            obj: undefined,
            list: []
        };

        lvlDefn.getPrevLvl = function () { return prevLvl; }
        lvlDefn.gtNextLvl = function () { return nextLvl; }

        lvlDefn.makeNext = function ($scope, $http, options) {
            options.prev = lvlDefn;
            nextLvl = jPw.makeSlctLevel($scope, $http, options);
            return nextLvl;
        };

        function isUndefinedOrNull(val) {
            return (angular.isUndefined(val) || val == null);
        };

        function sameVals(newVal, oldVal) {
            return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
        };

        $scope[lvlDefn.name] = lvlDefn;
        var watchStr = lvlDefn.name + '.obj';
        $scope.$watch(watchStr, function (newVal, oldVal) {
            if (sameVals(newVal, oldVal)) { return; };

            if (!isUndefinedOrNull(lvlDefn.obj)) {
                lvlDefn.loadNextLvl();
            } else {
                lvlDefn.clearNextLvl();
            };

            $scope.levelChanged();
        });

        lvlDefn.loadNextLvl = function () {
            if (angular.isDefined(nextLvl)) {
                nextLvl.loadLvl();
            };
        };

        lvlDefn.clearLevel = function () {
            lvlDefn.list = [];
            lvlDefn.obj = undefined;
        };

        lvlDefn.clearNextLvl = function () {
            if (angular.isDefined(nextLvl)) {
                nextLvl.clearLevel();
                nextLvl.clearNextLvl();
            };
        };

        lvlDefn.makeParm = function () {
            var parm = { type: lvlDefn.type };

            if (angular.isArray(lvlDefn.parmsArr)) {
                var assigned = 0;
                var tot = lvlDefn.parmsArr.length;
                var prev = lvlDefn.getPrevLvl();
                while ((prev) && (assigned < tot)) {
                    $.each(lvlDefn.parmsArr, function (index, parmDfn) {
                        if ((prev.name == parmDfn.name) && (prev.obj) && (prev.obj.hasOwnProperty(parmDfn.prop))) {
                            parm[parmDfn.parm] = prev.obj[parmDfn.prop];
                            tot++;
                        }
                    });
                    prev = prev.getPrevLvl();
                };
            };
            return parm;
        };

        lvlDefn.preLoad = function () {
            lvlDefn.isLoading = true;
            lvlDefn.list = [];
            lvlDefn.obj = undefined;
        };

        lvlDefn.loadSuccess = function (data) {
            lvlDefn.list = data[lvlDefn.listProp];

            if (angular.isFunction(lvlDefn.listFcn)) {
                lvlDefn.list = lvlDefn.listFcn(lvlDefn.list);
            }

            lvlDefn.isLoading = false;
            if (lvlDefn.list.length === 1) {
                lvlDefn.obj = lvlDefn.list[0];
            } else {
                lvlDefn.shouldFocus = true;
            }
        };

        lvlDefn.loadFail = function () {
            //lvlDefn.clearNextLvl();
            lvlDefn.isLoading = false;
        };

        lvlDefn.loadLvl = function () {
            lvlDefn.preLoad();
            $http.jsonp(jPw.slctUrl, { params: lvlDefn.makeParm() })
                .success(function (data) {
                    if (data.success) {
                        lvlDefn.loadSuccess(data);
                    } else {
                        lvlDefn.loadFail();
                    };
                })
                .error(function (data) {
                    lvlDefn.loadFail();
                })
            ;
        };

        return lvlDefn;
    };

    jPw.defnParm = function (parm, name, prop) {
        return { parm: parm, name: name, prop: prop };
    }

    var makeNm = 'make';
    var yearNm = 'year';
    var modelNm = 'model';
    var bodyNm = 'body';
    var trimNm = 'trim';
    var carNm = 'car';
    var ptrnNm = 'ptrn';
    var intNm = 'int';
    var kitNm = 'kit';

    var yrParms = [jPw.defnParm('makeid', makeNm, 'id')]
    var mdParms = yrParms.concat([jPw.defnParm('year', yearNm, 'name')]);
    var bdParms = mdParms.concat([jPw.defnParm('modelid', modelNm, 'id')]);
    var trParms = bdParms.concat([jPw.defnParm('bodyid', bodyNm, 'id')]);
    var crParms = trParms.concat([jPw.defnParm('trimid', trimNm, 'id')]);
    var ptParms = [jPw.defnParm('carid', carNm, 'id')]
    var intParms = ptParms.concat([jPw.defnParm('ptrnid', ptrnNm, 'id')]);
    var kitParms = intParms.concat([jPw.defnParm('intcolid', intNm, 'id')]);

    jPw.eBayMainCtrlr = function ($scope, $http) {
        $scope.kitsAvailable = false;

        $scope.slctBtn = 'search';

        $scope.levelChanged = function () {
            if ($scope.kit.obj) {
                $scope.kitsAvailable = true;
                $scope.ebaylisturl = $scope.kit.obj.ebaylisturl;
            } else {
                $scope.kitsAvailable = false;
                $scope.ebaylisturl = undefined;
            }
        };

        $scope.gotoItem = function () {
            if ($scope.ebaylisturl) {
                window.location = $scope.ebaylisturl;
            };
        };

        $scope.carSearch = function () {
            var srchUrl = 'http://stores.sandbox.ebay.com/WireRoad/_i.html?submit=Search&_nkw=' + $scope.make.obj.name;
            if ($scope.year.obj) {
                srchUrl = srchUrl + '+' + $scope.year.obj.name;
            };
            if ($scope.model.obj) {
                srchUrl = srchUrl + '+' + $scope.model.obj.name;
            };

            window.location = srchUrl;
        };

        jPw.makeSlctLevel($scope, $http, { name: makeNm, title: 'Make', type: 'makes', list: 'makes' });
        jPw.makeLevels($scope, $http);

        $scope.make.loadLvl();
    };

    jPw.makeLevels = function ($scope, $http) {
        $scope[makeNm].makeNext($scope, $http, { name: yearNm, title: 'Year', type: 'years', list: 'years', parms: yrParms });
        $scope[yearNm].makeNext($scope, $http, { name: modelNm, title: 'Model', type: 'models', list: 'models', parms: mdParms });
        $scope[modelNm].makeNext($scope, $http, { name: bodyNm, title: 'Body', type: 'bodies', list: 'bodies', parms: bdParms });
        $scope[bodyNm].makeNext($scope, $http, { name: trimNm, title: 'Trim', type: 'trims', list: 'trims', parms: trParms });
        $scope[trimNm].makeNext($scope, $http, { name: carNm, title: 'Vehicle', type: 'cars', list: 'cars', parms: crParms });
        $scope[carNm].makeNext($scope, $http, {
            name: ptrnNm, title: 'Configuration', type: 'carptrns', list: 'patterns', parms: ptParms,
            listFcn: function (list) {
                return $.map(list, function (item) {
                    item.ptrnname = item.name;
                    item.name = item.seldescr;
                    return item;
                });
            }
        });
        $scope[ptrnNm].makeNext($scope, $http, { name: intNm, title: 'Interior Color', type: 'carintcols', list: 'intColors', parms: intParms });
        $scope[intNm].makeNext($scope, $http, {
            name: kitNm, title: 'Leather Color', type: 'ptrnrecsebay', list: 'kits', parms: kitParms,
            listFcn: function (list) {
                return $.map(list, function (item) {
                    item.sku = item.name;
                    item.name = item.leacolorname;
                    item.colorurl = 'https://system.netsuite.com' + item.swatchimgurl;
                    return item;
                });
            }
        });
    };

    jPw.eBayMakesCtrlr = function ($scope, $http) {

        jPw.makeSlctLevel($scope, $http, {
            name: makeNm, title: 'Make', type: 'makelogos', list: 'makes',
            listFcn: function (list) {
                return $.map(list, function (item) {
                    item.logourl = 'https://system.netsuite.com' + item.logourl;
                    return item;
                });
            }
        });
        jPw.makeLevels($scope, $http);

        $scope.levelChanged = function () { };

        $scope.pickLogo = function (idx) {
            $scope.make.obj = $scope.make.list[idx];
        };

        $scope.pickList = function (model, idx) {
            model.obj = model.list[idx];
        };

        $scope.make.loadLvl();
    };

    jPw.rwStoreDirectives = function () {
        angular.module('rwstore.directives', [])
    	.directive('selCarSelect', function () {

    	    return {
    	        restrict: 'EA',
    	        replace: true,
    	        transclude: true,
    	        scope: {
    	            secTitle: "@secTitle",
    	            secName: "@secName",
    	            secModel: "=secModel",
    	            slctModel: "=slctModel",
    	            secList: "=secList",
    	            secId: "@secId",
    	            secHide: "@secOnlyOpts"
    	        },
    	        template:
                    '<div class="slctr-opt" ng-class="{selected: secModel.isSelected}" > ' +
                        '<div ng-show="secModel.isLoading" class="loading">Loading {{secTitle}}...</div>' +
                        '<select id="{{secId}}" title="{{secName}}"' +
                            'ng-disabled="secModel.isLoading || secList.length == 0" ' +
                            'ng-hide="(secModel.isLoading) || ((secHide) && (secList.length < 2))" ' +
                            'focus-it="secModel.shouldFocus" ' +
                            'ng-model="slctModel" ' +
                            'ng-options="i as i.name for i in secList">' +
                            '<option value="">-- Select {{secName}} --</option>' +
                        '</select>' +
                    '</div>'
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
    	                        element[0].focus();
    	                        scope.trigger = false;
    	                    }
    	                });
    	            };
    	        }
    	    };
    	})
        .directive('faqQA', function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: { question: '@faqQ' },
                template:
                        '<div class="faq-body">' +
                            '<a href ng-click="toggle()"><h5 class="faq-q"><span class="badge badge-inverse">Q:</span>{{question}}</h5></a>' +
                            '<div ng-hide="hide" >' +
                                '<div class="pull-left"><span class="badge badge-inverse">A:</span></div>' +
                                '<div ng-transclude></div>' +
                            '</div>' +
                        '</div>',
                link: function (scope, element, attrs) {
                    scope.hide = true;
                    scope.toggle = function toggle() {
                        scope.hide = !scope.hide;
                    }
                }
            }
        })

        ;
    };

    jPw.rwStoreApp = function () {
        jPw.rwStoreDirectives();
        rwstore = angular.module('rwstore', ['rwstore.directives']);
        angular.bootstrap($('#storebody'), ['rwstore']);
    };

}(this.jPw = this.jPw || {}, jQuery));

$(document).ready(function () {
    jPw.cachedScript('http://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js').done(
    	function () {
    	    jPw.cachedScript('http://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-resource.min.js').done(
    		jPw.rwStoreApp()
    	);
    	}
    );
});