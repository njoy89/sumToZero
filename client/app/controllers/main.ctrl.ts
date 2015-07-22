/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface MainCtrlScopeInterface extends ScopeInterface {
  numberList: string,
  validationResult: ValidatorResultInterface
}

angular.module('sumToZero').
  controller('MainCtrl', /*@ngInject*/($scope:MainCtrlScopeInterface, NumberListValidator:NumberListValidatorInterface) => {
    let numberList:string = '[ ]';
    _.assign($scope, {
      numberList: numberList,
      validationResult: NumberListValidator.validate(numberList)
    });

    $scope.$watch('numberList', (newNumberList, oldNumberList) => {
      if (newNumberList !== oldNumberList) {
        $scope.validationResult = NumberListValidator.validate(newNumberList);
      }
    })
  });