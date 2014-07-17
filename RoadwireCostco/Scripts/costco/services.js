﻿'use strict';

angular.module('costco.services', []) // 'ngResource'
.value('version', '0.1')

.factory('SlctLevel', ['$http', 'Selector', function ($http, Selector) {

    var makeSlctLevel = function(options) {
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
        lvlDefn.getNextLvl = function () { return nextLvl; }

        lvlDefn.makeNext = function (options) {
            options.prev = lvlDefn;
            nextLvl = makeSlctLevel(options);
            return nextLvl;
        };

        function isUndefinedOrNull(val) {
            return (angular.isUndefined(val) || val == null);
        };

        function sameVals(newVal, oldVal) {
            return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
        };

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
            lvlDefn.isLoading = false;
        };

        lvlDefn.loadLvl = function () {
            lvlDefn.preLoad();

            Selector(lvlDefn.makeParm())
                .then(function (result) {
                    if (result.data.success) {
                        lvlDefn.loadSuccess(result.data);
                    } else {
                        lvlDefn.loadFail();
                    };
                }, function (reason) {
                    lvlDefn.loadFail(reason);
                });

        };

        return lvlDefn;
    };

    return makeSlctLevel;
}])

.factory('SelectorList', ['SlctLevel', 'NsUrl', 'ColorList', function (SlctLevel, NsUrl, ColorList) {

    var defnParm = function (parm, name, prop) {
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

    var yrParms = [defnParm('makeid', makeNm, 'id')]
    var mdParms = yrParms.concat([defnParm('year', yearNm, 'name')]);
    var bdParms = mdParms.concat([defnParm('modelid', modelNm, 'id')]);
    var trParms = bdParms.concat([defnParm('bodyid', bodyNm, 'id')]);
    var crParms = trParms.concat([defnParm('trimid', trimNm, 'id')]);
    var ptParms = [defnParm('carid', carNm, 'id')]
    var intParms = ptParms.concat([defnParm('ptrnid', ptrnNm, 'id')]);
    var kitParms = intParms.concat([defnParm('intcolid', intNm, 'id')]);

    var makeLevels = function () {
        var mkLvl = SlctLevel({ name: makeNm, title: 'Make', type: 'makes', list: 'makes' });
        var lvl = mkLvl.makeNext({ name: yearNm, title: 'Year', type: 'years', list: 'years', parms: yrParms });
        lvl = lvl.makeNext({ name: modelNm, title: 'Model', type: 'models', list: 'models', parms: mdParms });
        lvl = lvl.makeNext({ name: bodyNm, title: 'Body', type: 'bodies', list: 'bodies', parms: bdParms });
        lvl = lvl.makeNext({ name: trimNm, title: 'Trim', type: 'trims', list: 'trims', parms: trParms });
        lvl = lvl.makeNext({ name: carNm, title: 'Vehicle', type: 'cars', list: 'cars', parms: crParms });
        lvl = lvl.makeNext({
            name: ptrnNm, title: 'Configuration', type: 'carptrns', list: 'patterns', parms: ptParms,
            listFcn: function (list) {
                return $.map(list, function (item) {
                    if ((item.rowsid == 1) || (item.rowsid == 2) || (item.rowsid == 3)) {
                        item.ptrnname = item.name;
                        item.name = item.seldescr;
                        return item;
                    }
                });
            }
        });
        lvl = lvl.makeNext({ name: intNm, title: 'Interior Color', type: 'carintcols', list: 'intColors', parms: intParms });
        lvl = lvl.makeNext({
            name: kitNm, title: 'Leather Color', type: 'ptrnrecscostco', list: 'kits', parms: kitParms,
            listFcn: function (list) {

                var ntAvlUrl = '/Content/Images/img_not_avail.png';
                var imgUrl = function (base, rest) {
                    if ((base) && (rest)) {
                        return base + rest;
                    } else {
                        return ntAvlUrl;
                    }
                };

                var kits = $.map(list, function (item) {
                    if ((item.isspecial === true) || (item.isclearance === true)) {
                        return null
                    };
                    item.partno = item.name;
                    item.colorCd = item.leacolorname.substring(0, 3);
                    NsUrl('imgbase')
                        .then(function (url) {
                            item.mainUrl = imgUrl(url, item.storeimgurl);
                            item.colorUrl = imgUrl(url, item.swatchimgurl);
                        }, function (reason) {
                            item.mainUrl = imgUrl(false);
                            item.colorUrl = imgUrl(false);
                        });
                    return item;
                });

                ColorList().then(function (colors) {
                    angular.forEach(kits, function (kit) {
                        angular.forEach(colors, function (color) {
                            if (kit.colorCd == color.Code) {
                                kit.colorUrl = color.Url;
                                return false;
                            };
                        });
                    });
                });

                return kits;
            }
        });

        return mkLvl;
    };

    var rootLvl;
    return function () {
        if (!rootLvl) {
            rootLvl = makeLevels();
        };
        return rootLvl;
    };
}])

.factory('WidgetData', ['SelectorList', 'ProductService', 'ProdList', function (SelectorList, ProductService, ProdList) {
    var data;
    var prodList;
    var prodSrvc;

    var makeData = function () {
        if (!data) {
            data = {};
        };
        if (!data.rootLvl) {
            data.rootLvl = SelectorList();
        };
        
        data.walkLevels = function (fcn) {
            var lvl = data.rootLvl;
            while (lvl) {
                if (angular.isFunction(fcn)) {
                    fcn(lvl);
                };
                lvl = lvl.getNextLvl();
            };
        };

        if (!data.selector) {
            var selector = {};

            data.walkLevels(function (lvlDefn) {
                selector[lvlDefn.name] = lvlDefn;
            });

            selector.kitSelected = function () {
                return (selector.kit.obj && selector.kit.obj.id);
            }

            data.selector = selector;
        };

        if (!data.member) {
            var member = {
                email:'',
                lastname:'',
                postal:'',
                phone:''
            };

            member.complete = function () {
                return (member.email) && (member.lastname) && (member.postal) && (member.phone);
            };

            data.member = member;
        };

        if (!data.order) {
            var order = {
                car: {},
                lea: {},
                htrs: {}
            };

            order.clearCar = function () {
                order.car = {};
            };
            order.clearLea = function () {
                order.lea = {};
            };
            order.clearHtrs = function () {
                order.htrs = {};
            };

            order.loadSlctr = function () {
                var car = {};
                var lea = {};

                data.walkLevels(function (lvlDefn) {
                    car[lvlDefn.name] = {};
                    var obj = data.selector[lvlDefn.name].obj;
                    if (obj) {
                        car[lvlDefn.name] = { id: obj.id, name: obj.name };
                    };
                });

                lea.ptrn = car.ptrn;
                lea.kit = car.kit;

                lea.color = data.selector.kit.obj ? data.selector.kit.obj.leacolorname : null;
                lea.dispUrl = data.selector.kit.obj ? data.selector.kit.obj.colorUrl : null;
                lea.rows = lea.ptrn.obj ? lea.ptrn.obj.rowsid : 0;
                lea.rowsDisp = prodSrvc.leaDisp(lea.rows);
                lea.price = prodSrvc.leaPrice(lea.rows);

                order.car = car;
                order.lea = lea;
            };

            order.hasCar = function () {
                return ((order.car) && (order.car.car) && (order.car.car.id));
            };
            order.hasLea = function () {
                return ((order.lea) && (order.lea.kit) && (order.lea.kit.id));
            };

            order.getRows = function () {
                if (order.hasLea()) {
                    return order.lea.rows || 0;
                } else {
                    return 0;
                }
            };

            order.loadHtrs = function (heaters) {
                var htrs = {
                    qty: heaters,
                    drv: null,
                    psg: null,
                    disc: null
                };

                var dispPrc = function (disp, price) {
                    return { disp: disp, price: price };
                };

                if (htrs.qty > 0) {
                    htrs.drv = dispPrc(prodSrvc.htrDisp(1), prodSrvc.htrPrice(1));
                    if (htrs.qty == 2) {
                        htrs.psg = dispPrc(prodSrvc.htrDisp(2), prodSrvc.htrPrice(1));
                        htrs.disc = dispPrc(prodSrvc.htrDiscDisp(2), prodSrvc.htrDisc(2));
                    };
                };

                htrs.price = prodSrvc.getHtrDiff(order.getRows(), htrs.qty);

                order.htrs = htrs;
            };

            order.hasHtrs = function () {
                return ((order.htrs) && (order.htrs.qty));
            };

            order.getHtrs = function () {
                if (order.hasHtrs()) {
                    return order.htrs.qty || 0;
                } else {
                    return 0;
                };
            };

            order.getTotal = function () {
                return prodSrvc.getPrice(order.getRows(), order.getHtrs());
            };

            order.hasProd = function () {
                return (order.hasLea() || order.hasHtrs());
            };

            data.order = order;
        };

        data.confirmable = function () {
            return data.order.hasProd() && data.member.complete();
        };

        return data;
    };

    return function () {
        data = makeData();

        if (data.prodSrvc) {
            return data;
        } else {
            return ProdList.list().$promise
                .then(function (prods) {
                    prodList = prods;
                    prodSrvc = ProductService(prodList);
                    data.prodSrvc = prodSrvc;
                    return data;
                });
        }
    };

}])

.factory('ProdList', ['$resource', function ($resource) {
    return $resource('/content/ccprods.json', {},
        {
            list: {
                isArray: true,
                cache: true,
                method: 'GET'
            }
        }
    );
}])

.factory('ProductService', [function () {
    var prodList;

    var getProd = function (rows, htrs) {
        rows = rows || 0;
        htrs = htrs || 0;
        var result;
        angular.forEach(prodList, function (prod) {
            var prows = prod.LeatherRows || 0;
            var phtrs = prod.Heaters || 0;
            if ((prows == rows) && (phtrs == htrs)) {
                result = prod;
                return false;
            };
        });
        return result;
    };
    
    var getPrice = function (rows, htrs) {
        var prod = getProd(rows, htrs);
        return prod ? prod.Price : null;
    };

    var getHtrDiff = function (rows, htrs) {
        var justLea = getPrice(rows) || 0;
        var leaHtr = getPrice(rows, htrs) || 0;
        var diff = leaHtr - justLea;
        return diff;
    };

    var leaDisp = function (rowid) {
        var base = 'Row Leather Seat Cover';
        if (rowid == 1) {
            return '1 ' + base;
        } else if (rowid == 2) {
            return '2 ' + base;
        } else if (rowid == 3) {
            return '3 ' + base;
        } else {
            return null;
        }
    };
    var leaPrice = function (rows) {
        return getPrice(rows);
    };

    var htrDisp = function (seq) {
        if (seq == 1) {
            return 'Driver Side Seat Heater';
        } else if (seq == 2) {
            return 'Passenger Side Seat Heater';
        } else {
            return null;
        }
    };
    var htrPrice = function (qty) {
        return getPrice(null, qty);
    };
    
    var htrDiscDisp = function (qty) {
        if (qty == 2) {
            return 'Multiple Heaters Discount';
        } else {
            return null;
        }
    };
    var htrDisc = function (qty) {
        if (qty == 1) {
            return 0;
        } else if (qty == 2) {
            return (htrPrice(1) * 2) - htrPrice(2);
        } else {
            return null;
        }
    };

    var prod = {
        getProd: getProd,
        getPrice: getPrice,
        getHtrDiff: getHtrDiff,
        leaDisp: leaDisp,
        leaPrice: leaPrice,
        htrDisp: htrDisp,
        htrPrice: htrPrice,
        htrDiscDisp: htrDiscDisp,
        htrDisc: htrDisc
    };

    return function (list) {
        prodList = list;
        return prod;
    };
}])

;