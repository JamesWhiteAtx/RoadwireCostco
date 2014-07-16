'use strict';

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

.factory('SelectorList', ['SlctLevel', 'NsUrl', function (SlctLevel, NsUrl) {

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

                return $.map(list, function (item) {
                    if ((item.isspecial === true) || (item.isclearance === true)) {
                        return null
                    };
                    item.partno = item.name;
                    NsUrl('imgbase')
                        .then(function (url) {
                            item.mainimgurl = imgUrl(url, item.storeimgurl);
                            item.colorurl = imgUrl(url, item.swatchimgurl);
                            item.displayUrl = item.colorurl;
                        }, function (reason) {
                            item.mainimgurl = imgUrl(false);
                            item.colorurl = imgUrl(false);
                            item.displayUrl = imgUrl(false);
                        });
                    return item;
                });
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

        data.getRows = function () {
            if (data.selector && data.selector.ptrn && data.selector.ptrn.obj) {
                return data.selector.ptrn.obj.rowsid || 0;
            } else {
                return 0;
            }
        };
        

        if (!data.heaters) {
            data.heaters = 0;
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
                lea.dispUrl = data.selector.kit.obj ? data.selector.kit.obj.displayUrl : null;
                lea.rows = data.selector.ptrn.obj ? data.selector.ptrn.obj.rowsid : null;
                lea.rowsDisp = prodSrvc.leaDisp(lea.rows);
                lea.price = prodSrvc.leaPrice(lea.rows);

                order.car = car;
                order.lea = lea;
            };

            order.loadHtrs = function () {
                var htrs = {
                    qty: data.heaters,
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

                order.htrs = htrs;
            };

            order.hasCar = function () {
                return ((order.car.car) && (order.car.car.id));
            };
            order.hasLea = function () {
                return ((order.lea.kit) && (order.lea.kit.id));
            };
            order.hasHtrs = function () {
                return (order.htrs.qty);
            };

            order.hasProd = function () {
                return (order.hasLea() || order.hasHtrs());
            };

            data.order = order;
        };

        data.clearHtrs = function () {
            data.heaters = 0;
            data.order.clearHtrs();
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

.factory('ginch', ['ProdList', function (ProdList) {
    var list;

    var func = function (p) {
        return p;
    }

    var prod = {
        func: func,
    };

    return function () {
        if (prod.list) {
            return prod;
        } else {
            return ProdList.list().$promise
                .then(function (prods) {
                    prod.list = prods;
                    return prod;
                });
        }
    };
}])

.factory('ProductService', [function () {
    var prodList;

    var getProd = function (rows, htrs) {
        var result;
        angular.forEach(prodList, function (prod) {
            if ((prod.LeatherRows == rows) && (prod.Heaters == htrs)) {
                result = prod;
                return false;
            };
        });
        return result;
    };

    var getHtrDiff = function (rows, htrs) {
        var justLea = getProd(rows);
        var leaHtr = getProd(rows, htrs);
        var diff = leaHtr.Price - justLea.Price;
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
    var leaPrice = function (rowid) {
        if (rowid == 1) {
            return 799.00;
        } else if (rowid == 2) {
            return 1299.00;
        } else if (rowid == 3) {
            return 1799.00;
        } else {
            return null;
        }
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
        if (qty == 1) {
            return 249.00;
        } else if (qty == 2) {
            return 449.00;
        } else {
            return null;
        }
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