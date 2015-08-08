/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface IntervalItemInterface {
  left: number,
  width: number,
  top: number,
  from: number,
  to: number
}

interface NumberOfSubarraysVisualizationScopeInterface extends ScopeInterface {
  numberList: Array<number>,
  intervalList: Array<IntervalItemInterface>
}

angular.module('sumToZero').
  directive('numberOfSubarraysVisualization', /*@ngInject*/(NumberOfSubArraysCalculator:NumberOfSubArraysCalculatorInterface) => {
    return {
      restrict: 'E',
      scope: {
        numberList: '='
      },
      templateUrl: 'directives/number-of-subarrays-visualization/number-of-subarrays-visualization.tmpl.html',
      link: (scope:NumberOfSubarraysVisualizationScopeInterface, element:DOMElementInterface) =>
      {
        let $element = $(element);
        let calculateIntervalList = (numberList:Array<number>) => {
          let subArrayIntervals:Array<IntervalDetailsInterface> = NumberOfSubArraysCalculator.calculateIntervals(numberList);
          let compressedSubarrayIntervals:Array<Array<IntervalDetailsInterface>> = NumberOfSubArraysCalculator.compressIntervals(subArrayIntervals);
          let sumWidthPartials:any[] = [];
          let $numberBlocks = $element.find('.number-block');
          for (let i = 0; i < $numberBlocks.length; ++i) {
            sumWidthPartials.push((i > 0 ? _.last(sumWidthPartials) : 0) + $numberBlocks[i].clientWidth + 2);
          }

          const INTERVAL_HEIGHT_PX = 20;
          const INTERVAL_SHIFT_PX = 3;

          scope.intervalList = [];

          _.forEach(compressedSubarrayIntervals, (intervalsPackage, index) => {
            _.forEach(intervalsPackage, (interval:IntervalDetailsInterface) => {
              let left = (interval.indexBegin > 0 ? sumWidthPartials[interval.indexBegin - 1] : 0);
              let width = sumWidthPartials[interval.indexEnd] - left;

              scope.intervalList.push({
                width: width - 2 * INTERVAL_SHIFT_PX,
                left: left + INTERVAL_SHIFT_PX,
                top: INTERVAL_HEIGHT_PX * index,
                from: interval.indexBegin,
                to: interval.indexEnd
              });
            });
          });
        };

        scope.intervalList = [];
        scope.$applyAsync(() => {
          calculateIntervalList(scope.numberList);
          scope.$watch('numberList', (newNumberList, oldNumberList) => {
            if (newNumberList !== oldNumberList) {
              scope.$applyAsync(() => {
                calculateIntervalList(newNumberList);
              });
            }
          });
        });
      }
    };
  });