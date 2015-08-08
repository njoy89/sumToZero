/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

describe('NumberOfSubArraysCalculator', () => {
  let NumberOfSubArraysCalculator;

  let getRandomArrayOfNElements = (n, minVal, maxVal) => _.map(Array(n), () => {
    return Math.floor(Math.random() * (Math.abs(minVal) + Math.abs(maxVal)) - Math.abs(minVal))
  });
  let countSubArraysBruteForce = (numberList) => {
    let partialSums = _.reduce(numberList, (acc, v) => {
        acc.push((_.last(acc) || 0) + v);
        return acc;
      }, []);
    let result = 0;

    for (let i = 0; i < numberList.length; ++i) {
      for (let j = i; j < numberList.length; ++j) {
        let intervalSum = partialSums[j] - (i > 0 ? partialSums[i - 1] : 0);
        result += (intervalSum === 0) ? 1 : 0;
      }
    }

    return result;
  };
  let testRandomArr = (n, minVal, maxVal) => {
    let randomArr = getRandomArrayOfNElements(n, minVal, maxVal);
    expect(NumberOfSubArraysCalculator.calculateNumber(randomArr)).toEqual(countSubArraysBruteForce(randomArr));
  };
  let containsInterval = (intervals, indexBegin, indexEnd) => {
    expect(intervals).toContain(jasmine.objectContaining({indexBegin: indexBegin, indexEnd: indexEnd}));
  };

  beforeEach(angular.mock.module('sumToZero'));
  beforeEach(angular.mock.inject((_NumberOfSubArraysCalculator_) => {
    NumberOfSubArraysCalculator = _NumberOfSubArraysCalculator_;
  }));

  it('should be defined', () => {
    expect(NumberOfSubArraysCalculator).toBeDefined();
    expect(NumberOfSubArraysCalculator).toEqual(jasmine.any(Object));
  });

  describe('should have defined calculateNumber method', () => {
    it('', () => {
      expect(NumberOfSubArraysCalculator.calculateNumber).toBeDefined();
      expect(NumberOfSubArraysCalculator.calculateNumber).toEqual(jasmine.any(Function));
    });

    it('which returns 0 if there is not any desired sub-array', () => {
      expect(NumberOfSubArraysCalculator.calculateNumber([])).toEqual(0);
      expect(NumberOfSubArraysCalculator.calculateNumber([1])).toEqual(0);
      expect(NumberOfSubArraysCalculator.calculateNumber([-1.2, 1.1])).toEqual(0);
      expect(NumberOfSubArraysCalculator.calculateNumber([1, 2, 3])).toEqual(0);
      expect(NumberOfSubArraysCalculator.calculateNumber([1, -2, 3, -4, 5, -6, 7])).toEqual(0);
    });

    it('which returns positive value if there exist desired sub-arrays', () => {
      expect(NumberOfSubArraysCalculator.calculateNumber([1, -1])).toEqual(1);
      expect(NumberOfSubArraysCalculator.calculateNumber([3, -5, 1, -1, 3])).toEqual(1);
      expect(NumberOfSubArraysCalculator.calculateNumber([0])).toEqual(1);
      expect(NumberOfSubArraysCalculator.calculateNumber([0, 0, 0])).toEqual(6);
      expect(NumberOfSubArraysCalculator.calculateNumber([0, 0, -1, 1, 0])).toEqual(10);
      expect(NumberOfSubArraysCalculator.calculateNumber([1, 2, -3, 0, 1, 2, 0])).toEqual(7);
    });

    it('which returns proper result for random array of 100 elements', () => {
      testRandomArr(100, -1, 1);
    });

    it('which returns proper result for random array of 1000 elements', () => {
      testRandomArr(1000, -5, 5);
    });

    it('which returns proper result for random array of 10000 elements', () => {
      testRandomArr(10000, -10, 10);
    });
  });

  describe('should have defined calculateIntervals method', () => {
    it('', () => {
      expect(NumberOfSubArraysCalculator.calculateIntervals).toBeDefined();
      expect(NumberOfSubArraysCalculator.calculateIntervals).toEqual(jasmine.any(Function));
    });

    it('which does not return any interval if there is not any desired sub-array', () => {
      expect(NumberOfSubArraysCalculator.calculateIntervals([])).toEqual([]);
      expect(NumberOfSubArraysCalculator.calculateIntervals([1])).toEqual([]);
      expect(NumberOfSubArraysCalculator.calculateIntervals([-1.2, 1.1])).toEqual([]);
      expect(NumberOfSubArraysCalculator.calculateIntervals([1, 2, 3])).toEqual([]);
      expect(NumberOfSubArraysCalculator.calculateIntervals([1, -2, 3, -4, 5, -6, 7])).toEqual([]);
    });

    it('which returns positive number of intervals if there exist desired sub-arrays', () => {
      let intervals;

      intervals = NumberOfSubArraysCalculator.calculateIntervals([1, -1]);
      expect(intervals.length).toBe(1);
      containsInterval(intervals, 0, 1);

      intervals = NumberOfSubArraysCalculator.calculateIntervals([3, -5, 1, -1, 3]);
      expect(intervals.length).toBe(1);
      containsInterval(intervals, 2, 3);

      intervals = NumberOfSubArraysCalculator.calculateIntervals([0]);
      expect(intervals.length).toBe(1);
      containsInterval(intervals, 0, 0);

      intervals = NumberOfSubArraysCalculator.calculateIntervals([0, 0, 0]);
      expect(intervals.length).toBe(6);
      containsInterval(intervals, 0, 2);
      containsInterval(intervals, 1, 2);

      intervals = NumberOfSubArraysCalculator.calculateIntervals([0, 0, -1, 1, 0]);
      expect(intervals.length).toBe(10);
      containsInterval(intervals, 2, 3);
      containsInterval(intervals, 1, 4);

      intervals = NumberOfSubArraysCalculator.calculateIntervals([1, 2, -3, 0, 1, 2, 0]);
      expect(intervals.length).toBe(7);
      containsInterval(intervals, 2, 5);
      containsInterval(intervals, 0, 2);
      containsInterval(intervals, 2, 6);
    });
  });

  describe('should have defined compressIntervals method', () => {
    let makeInterval = (a, b) => {
      return {
        indexBegin: a,
        indexEnd: b
      };
    };
    let numberBelongsToInterval = (number, interval) => {
      return (interval.indexBegin <= number) && (number <= interval.indexEnd);
    };
    let intervalsIntersect = (interval1, interval2) => {
      return numberBelongsToInterval(interval1.indexBegin, interval2) ||
        numberBelongsToInterval(interval2.indexBegin, interval1);
    };
    let packageIsValid = (currPackage) => {
      // each package is valid if all intervals belonging to it do not intersect with each other
      for (let i = 0; i < currPackage.length; ++i) {
        for (let j = i + 1; j < currPackage.length; ++j) {
          if (intervalsIntersect(currPackage[i], currPackage[j])) {
            return false;
          }
        }
      }
      return true;
    };
    let packagesAreValid = (packages) => {
      return _.every(_.map(packages, packageIsValid));
    };

    it('', () => {
      expect(NumberOfSubArraysCalculator.compressIntervals).toBeDefined();
      expect(NumberOfSubArraysCalculator.compressIntervals).toEqual(jasmine.any(Function));
    });

    it('which compresses two non-overlapping intervals', () => {
      let packages = NumberOfSubArraysCalculator.compressIntervals([makeInterval(0, 2), makeInterval(3, 4)]);
      expect(packages.length).toBe(1);
      expect(packagesAreValid(packages)).toBe(true);
    });

    it('which does not do anything with two edged-overlapping intervals', () => {
      let packages = NumberOfSubArraysCalculator.compressIntervals([makeInterval(0, 2), makeInterval(2, 4)]);
      expect(packages.length).toBe(2);
      expect(packagesAreValid(packages)).toBe(true);
    });

    it('which compresses several small intervals which consecutive ones overlap with each other on the edge', () => {
      let packages = NumberOfSubArraysCalculator.compressIntervals([
        makeInterval(0, 1), makeInterval(1, 2), makeInterval(2, 3), makeInterval(3, 4), makeInterval(4, 5), makeInterval(5, 6)
      ]);
      expect(packages.length).toBe(2);
      expect(packagesAreValid(packages)).toBe(true);
    });

    it('which does not compress any interval as each of them intersect with each other', () => {
      let packages = NumberOfSubArraysCalculator.compressIntervals([
        makeInterval(0, 10), makeInterval(1, 9), makeInterval(2, 8), makeInterval(3, 7), makeInterval(4, 6)
      ]);
      expect(packages.length).toBe(5);
      expect(packagesAreValid(packages)).toBe(true);
    });

    describe('which uses intervalsIntersect function', () => {
      it('', () => {
        expect(intervalsIntersect).toBeDefined();
        expect(intervalsIntersect).toEqual(jasmine.any(Function));
      });

      it('which determines that two intervals intersect', () => {
        expect(intervalsIntersect(makeInterval(0, 2), makeInterval(1, 3))).toBe(true);
        expect(intervalsIntersect(makeInterval(-10, -5), makeInterval(-8, -6))).toBe(true);
        expect(intervalsIntersect(makeInterval(0, 1), makeInterval(-1, 2))).toBe(true);
        expect(intervalsIntersect(makeInterval(5, 7), makeInterval(7, 9))).toBe(true);
        expect(intervalsIntersect(makeInterval(-1, 0), makeInterval(-3, -1))).toBe(true);
      });

      it('which determines that two interval do not intersect', () => {
        expect(intervalsIntersect(makeInterval(0, 2), makeInterval(3, 5))).toBe(false);
      });
    });
  });
});