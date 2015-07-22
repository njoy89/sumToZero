/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface NumberOfSubarraysReportScopeInterface extends ScopeInterface {
  numberList: Array<number>,
  result: number
}

angular.module('sumToZero').
  directive('numberOfSubarraysReport', /*@ngInject*/() => {
    return {
      restrict: 'E',
      scope: {
        numberList: '='
      },
      templateUrl: 'directives/number-of-subarrays-report.tmpl.html',
      controller: /*@ngInject*/($scope:NumberOfSubarraysReportScopeInterface,
                                NumberOfSubArraysCalculator:NumberOfSubArraysCalculatorInterface) =>
      {
        $scope.result = NumberOfSubArraysCalculator.calculate($scope.numberList);

        $scope.$watch('numberList', (newNumberList, oldNumberList) => {
          if (newNumberList !== oldNumberList) {
            $scope.result = NumberOfSubArraysCalculator.calculate(newNumberList);
          }
        });
      }
    };
  });