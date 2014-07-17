/*
Roadwire Costco 
(c) 2014 Roadwire, Inc.
*/
costco
.controller('CostcoCtrl', ['$rootScope', '$scope', '$location', 'WhyInstDlg', function ($rootScope, $scope, $location, WhyInstDlg) {
    $scope.routeLea = function () {
        $location.path('/leather');
    };
    $scope.routeHtr = function () {
        $location.path('/heaters');
    };
    $scope.routeInst = function () {
        $location.path('/install');
    };
    $scope.routeConfirm = function () {
        $location.path('/confirm');
    };

    $scope.whyInstall = function () {
        WhyInstDlg();
    };

}])

.controller('TestCtrl', ['$scope', function ($scope) {
    $scope.test = "test";

    $scope.show2 = false;
    $scope.show3 = false;
    $scope.show4 = false;

    $scope.toggle2 = function () {
        $scope.show2 = !$scope.show2;
    };
    $scope.toggle3 = function () {
        $scope.show3 = !$scope.show3;
    };
    $scope.toggle4 = function () {
        $scope.show4 = !$scope.show4;
    };
}])

.controller('LeaCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.trimIsLoading = function () {
        return (($scope.trim) && ($scope.trim.isLoading))
        || (($scope.car) && ($scope.car.isLoading))
        || (($scope.ptrn) && ($scope.ptrn.isLoading));
    }
    $scope.trimHasOpts = function () {
        return (($scope.trim) && ($scope.trim.list) && ($scope.trim.list.length > 1))
        || (($scope.car) && ($scope.car.list) && ($scope.car.list.length > 1))
        || (($scope.ptrn) && ($scope.ptrn.list) && ($scope.ptrn.list.length > 1));
    };
    $scope.trimShowLoading = function () {
        return $scope.trimIsLoading() && !$scope.trimHasOpts();
    };
    $scope.trimShowOpts = function () {
        return $scope.trimHasOpts();
    };


    $scope.intIsLoading = function () {
        return ($scope.int) && (($scope.int.isLoading));
    };
    $scope.intHasOpts = function () {
        return ($scope.int) && (($scope.int.list) && ($scope.int.list.length > 1));
    };
    $scope.intShowLoading = function () {
        return $scope.intIsLoading() && !$scope.intHasOpts();
    };
    $scope.intShowOpts = function () {
        return $scope.intHasOpts();
    };

    $scope.kitHasOpts = function () {
        return ($scope.kit) && (($scope.kit.list) && ($scope.kit.list.length > 0));
    };

    $scope.kitShowLoading = function () {
        $scope.kit.isloading && !$scope.kitHasOpts();
    };
    $scope.kitShowOpts = function () { 
        return $scope.kitHasOpts() || $scope.kit.isloading;
    };

    $scope.pickKit = function (idx) {
        $scope.kit.obj = $scope.kit.list[idx];
        Data.order.loadSlctr();
        $scope.routeConfirm();
    };

    $scope.price = function () {
        if ($scope.ptrn && $scope.ptrn.obj) {
            return Data.prodSrvc.leaPrice($scope.ptrn.obj.rowsid);
        };
    };

    $scope.lightbkg = true;

    function isUndefinedOrNull(val) {
        return (angular.isUndefined(val) || val == null);
    };

    function sameVals(newVal, oldVal) {
        return (newVal === oldVal) || (isUndefinedOrNull(newVal) && isUndefinedOrNull(oldVal));
    };

    var assgnSlctLevel = function (lvlDefn) {
        $scope[lvlDefn.name] = lvlDefn;

        var watchStr = lvlDefn.name + '.obj';
        $scope.$watch(watchStr, function (newVal, oldVal) {
            if (sameVals(newVal, oldVal)) { return; };

            if (!isUndefinedOrNull(lvlDefn.obj)) {
                lvlDefn.loadNextLvl();
            } else {
                lvlDefn.clearNextLvl();
            };
            //$scope.levelChanged();
        });

        return lvlDefn;
    };

    Data.walkLevels(assgnSlctLevel);

    if ($scope.make.list.length < 1) {
        $scope.make.loadLvl();
    };
}])

.controller('HtrCtrl', ['$scope', 'Data', function ($scope, Data) {
    
    var heaters = 2;
    var rows;
    rows = Data.order.getRows();
    $scope.rows = rows;

    $scope.price = Data.prodSrvc.getHtrDiff(rows, heaters);
    
    $scope.addHtrs = function () {
        Data.order.loadHtrs(heaters);
        $scope.routeConfirm();
    };
    $scope.noHtrs = function () {
        Data.order.loadHtrs(heaters);
        $scope.routeConfirm();
    };


    /*
    var dispPrc = function (disp, price) {
        return { checked: false, disp: disp, price: price };
    }
    $scope.heater1 = dispPrc(Data.prodSrvc.htrDisp(1), Data.prodSrvc.htrPrice(1));
    $scope.heater2 = dispPrc(Data.prodSrvc.htrDisp(2), Data.prodSrvc.htrPrice(1));
    $scope.discount = dispPrc(Data.prodSrvc.htrDiscDisp(2), Data.prodSrvc.htrDisc(2) * -1);
    var calcHeaters = function () {
        if ($scope.heater1.checked) {
            if ($scope.heater2.checked) {
                Data.heaters = 2;
            } else {
                Data.heaters = 1;
            };
        } else {
            $scope.heater2.checked = false;
            Data.heaters = 0;
        };
        
        $scope.total = Data.prodSrvc.htrPrice(Data.heaters);
        $scope.heaters = Data.heaters;
    };
    $scope.$watch('heater1.checked', function (newVal, oldVal) {
        if (newVal === oldVal) { return; };
        calcHeaters();
    });
    $scope.$watch('heater2.checked', function (newVal, oldVal) {
        if (newVal === oldVal) { return; };
        calcHeaters();
    });
    $scope.heaters = Data.heaters;
    if (Data.heaters > 0) {
        $scope.heater1.checked = true;
        if (Data.heaters > 1) {
            $scope.heater2.checked = true;
        };
    };
*/
}])

.controller('InstCtrl', ['$scope', 'Data', 'Installers', function ($scope, Data, Installers) {
    $scope.installers = [];

    Installers()
    .then(function (locs) {
        $scope.installers = locs;
    });
}])

.controller('ConfirmCtrl', ['$scope', 'Data', function ($scope, Data) {
    $scope.lines = [];
    var data = Data;
    
    var addLine = function (title, installed, url, edtFcn, delFcn) {
        var line = {
            title: title,
            installed: installed,
            url: url,
            items: [],
            edtFcn: edtFcn, 
            delFcn: delFcn
        };

        line.item = function (descr, total) {
            line.items.push({descr: descr, total: total});
            return line;
        };

        $scope.lines.push(line);
        return line;
    };

    var calcTotal = function () {
        $scope.total = 0;
        angular.forEach($scope.lines, function (line) {
            angular.forEach(line.items, function (item) {
                if (angular.isNumber(item.total)) {
                    $scope.total += item.total;
                };
            });
        });
    };

    var delLine = function (idx) {
        $scope.lines.splice(idx, 1);
        calcTotal();
    };

    var delLea = function (idx) {
        Data.order.clearLea();
        delLine(idx);
    };
    var delHea = function (idx) {
        Data.clearHtrs();
        delLine(idx);
    };

    $scope.hasProd = function () {
        return Data.order.hasProd();
    };
    $scope.hasMember = function () {
        return Data.member.complete();
    };

    $scope.confirmable = function () {
        return Data.confirmable();
    };
    
    var objProp = function (str, obj, nm) {
        str = str || '';
        nm = nm || 'name';
        if (obj && obj[nm]) {
            str = str + ' ' + obj[nm];
        };
        return str.trim();
    };

    //if (Data.selector.kitSelected()) {
    //Data.order.loadProds();
    //} else {
    //    Data.order.car.make = { id: '1', name: 'CODA' };
    //    Data.order.car.year = { id: '2', name: '2012' };
    //    Data.order.car.model = { id: '3', name: 'ELECTRIC' };
    //    Data.order.car.body = { id: '4', name: 'BODY' };
    //    Data.order.car.trim = { id: '5', name: 'Base' };
    //    Data.order.car.car = { id: '6', name: 'coda electri base' };
    //    Data.order.car.int = { id: '8', name: 'Green' };

    //    Data.order.lea.ptrn = { id: '7', name: '123231' };
    //    Data.order.lea.kit = { id: '9', name: '123232-PT' };
    //    Data.order.lea.color = '122 Quick Silver';
    //    Data.order.lea.dispUrl = 'https://system.sandbox.netsuite.com//core/media/media.nl?id=224&c=801095&h=b2c9a5bec52d11efe3b5';
    //    Data.order.lea.price = 1299;

    //    Data.order.loadHtrs(2);
    //};

    var descr = '';

    if (Data.order.hasCar()) {
        descr = objProp('', Data.order.car.make);
        descr = objProp(descr, Data.order.car.year);
        descr = objProp(descr, Data.order.car.model);
        descr = objProp(descr, Data.order.car.car);
        addLine('Your Vehicle', false, null, function () { $scope.routeLea(); }).item(descr);
    };

    if (Data.order.hasLea()) {
        var leaLine = addLine('Leather Seat', true, Data.order.lea.dispUrl, function () { $scope.routeLea(); }, delLea);

        leaLine.item(Data.order.lea.rowsDisp, Data.order.lea.price);

        descr = objProp('Color: ', Data.order.lea, 'color');
        leaLine.item(descr);

        descr = objProp('Part Number: ', Data.order.lea.kit);
        leaLine.item(descr);

        descr = objProp('Pattern: ', Data.order.lea.ptrn);
        leaLine.item(descr);
    };

    if (Data.order.hasHtrs()) {
        var heatLine = addLine('Seat Heaters', true, null, function () { $scope.routeHtr(); }, delHea)
            .item(Data.order.htrs.drv.disp, Data.order.htrs.drv.price);

        if (Data.order.htrs.psg) {
            heatLine.item(Data.order.htrs.psg.disp, Data.order.htrs.psg.price);
        }
        if (Data.order.htrs.disc) {
            heatLine.item(Data.order.htrs.disc.disp, Data.order.htrs.disc.price * -1);
        }
    };

    calcTotal();
    $scope.prodPrice = Data.order.getTotal();
    
    $scope.alerts = [];
    var addAlert = function (quest, info, yes, addFcn) {
        var alert = { quest: quest, info: info, yes: yes, addFcn: addFcn };
        $scope.alerts.push(alert);
    };

    if (!Data.order.hasLea()) {
        addAlert('Interested in adding Leather Seat Covers?', 'Roadwire offers the finest leather interiors in the business. Take a look at our excellent offers!', 'Shop for Leather Seat Covers', $scope.routeLea);
    };

    if (!Data.order.hasHtrs()) {
        addAlert('Interested in adding Seat Heaters?', 'Roadwire offers the finest seat heating systems in the business. Take a look at our excellent offers!', 'Shop for Seat Heaters', $scope.routeHtr);
    };

    $scope.member = Data.member;

    var x;
    $scope.test = function () {
            x = prody.func(22);
    };

}])

.controller('MapCtrl', ['$scope', 'gglMaps', function ($scope, gglMaps) {

    $scope.gglMaps = gglMaps;

    $scope.clicky = function ()
    {
        var z = $scope.map;
        alert('clicky');
    }
    /*
    var map = InstMap("map-canvas");
    $scope.zipcode = null;
    $scope.loadInstallers = function () {
        map.proxInstallers($scope.zipcode);
    };
    $scope.reset = function () {
        map.reset();
    };
    */
}])

;