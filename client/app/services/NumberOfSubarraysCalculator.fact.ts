/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface CalculateInterface {
  (arr:Array<number>): number
}

interface NumberOfSubArraysCalculatorInterface {
  calculate: CalculateInterface
}

interface PartialSumsInterface {
  [index: number]: number;
}

angular.module('sumToZero').
  factory('NumberOfSubArraysCalculator', /*@ngInject*/():NumberOfSubArraysCalculatorInterface => {
    let calculate:CalculateInterface = (numberList) => {
      let currentSum:number = 0;
      let partialSums:PartialSumsInterface = {};

      /*
       * time complexity: O(numberList.length * max_cost_of_reference_to_an_object_item)
       */
      for (let i = 0; i < numberList.length; ++i) {
        currentSum += numberList[i];
        partialSums[currentSum] = partialSums[currentSum] || 0;
        partialSums[currentSum]++;
      }

      /*
       * To clarify, a partial sum is defined as follows:
       * partialSum[i] = numberList[0] + numberList[1] + ... + numberList[i]
       *
       * Hence, the expected result equals to:
       * ( sum{s is a possible partial sum} (s over 2) ) + number of such partials sum that sum up to 0.
       * where (s over 2) is a Newton binomial and is equaled to v*(v-1)/2
       */
      return _.reduce(partialSums, (result, v, k) => result + (v * (v - 1) / 2), partialSums[0] || 0);
    };

    return {
      calculate: calculate
    };
  });