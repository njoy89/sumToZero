/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface CalculateNumberInterface {
  (arr:Array<number>): number
}

interface IntervalDetailsInterface {
  indexBegin: number,
  indexEnd: number
}

interface CalculateIntervalsInterface {
  (arr:Array<number>): Array<IntervalDetailsInterface>
}

interface NumberOfSubArraysCalculatorInterface {
  calculateNumber: CalculateNumberInterface,
  calculateIntervals: CalculateIntervalsInterface
}

interface PartialSumsInterface {
  [index: number]: number;
}

angular.module('sumToZero').
  factory('NumberOfSubArraysCalculator', /*@ngInject*/():NumberOfSubArraysCalculatorInterface => {
    let calculateNumber:CalculateNumberInterface = (numberList) => {
      let currentSum:number = 0;
      let aggrPartialSums:PartialSumsInterface = {};

      /*
       * The effective algorithm is used here.
       * Time complexity: O(numberList.length * max_cost_of_reference_to_an_object_item)
       * Memory complexity: O(numberList.length)
       */
      for (let i = 0; i < numberList.length; ++i) {
        currentSum += numberList[i];
        aggrPartialSums[currentSum] = aggrPartialSums[currentSum] || 0;
        aggrPartialSums[currentSum]++;
      }

      /*
       * To clarify, a partial sum is defined as follows:
       * numberList[0] + numberList[1] + ... + numberList[i]
       * and
       * aggrPartialSums[s] = |{ i : s = numberList[0] + ... + numberList[i] }|
       *
       * Hence, the expected result equals to:
       * ( sum{s is a possible partial sum} (s over 2) ) + number of such partials sum that sum up to 0.
       * where (s over 2) is a Newton binomial and is equaled to v*(v-1)/2
       */
      return _.reduce(aggrPartialSums, (result, v, k) => result + (v * (v - 1) / 2), aggrPartialSums[0] || 0);
    };

    let calculateIntervals:CalculateIntervalsInterface = (numberList) => {
      /*
       * NOTE! The number of all such sub-arrays whose elements sum up to 0 is upper bounded by O(number.list ^ 2),
       * so the following algorithm can be naive whose time complexity is O(number.list ^ 2) as well.
       *
       * The functions returns all sub-arrays whose elements sum up to 0.
       */

      let partialSums:PartialSumsInterface = [];
      let resultIntervals:Array<IntervalDetailsInterface> = [];

      partialSums = _.reduce(numberList, (acc, v) => {
        acc.push((_.last(acc) || 0) + v);
        return acc;
      }, []);

      for (let i = 0; i < numberList.length; ++i) {
        for (let j = i; j < numberList.length; ++j) {
          let intervalSum = partialSums[j] - (i > 0 ? partialSums[i - 1] : 0);

          // intervalSum is the sum of the sub-array numberList[i], numberList[i + 1], ..., numberList[j]
          if (intervalSum === 0) {
            resultIntervals.push({
              indexBegin: i,
              indexEnd: j
            });
          }
        }
      }

      return resultIntervals;
    };

    return {
      calculateNumber: calculateNumber,
      calculateIntervals: calculateIntervals
    };
  });
