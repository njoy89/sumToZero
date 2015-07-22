/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface MainCtrlScopeInterface {
    numberList: String
}

angular.module('sumToZero').
    controller('MainCtrl', ($scope : MainCtrlScopeInterface) => {
        $scope.numberList = '[ ]';
    });