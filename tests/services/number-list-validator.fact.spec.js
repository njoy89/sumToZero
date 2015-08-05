/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

describe('NumberListValidator', () => {
  let NumberListValidator;

  beforeEach(angular.mock.module('sumToZero'));
  beforeEach(angular.mock.inject((_NumberListValidator_) => {
    NumberListValidator = _NumberListValidator_;
  }));

  it('should be defined', () => {
    expect(NumberListValidator).toBeDefined();
    expect(NumberListValidator).toEqual(jasmine.any(Object));
  });

  describe('should have defined validate method', () => {
    it('', () => {
      expect(NumberListValidator.validate).toBeDefined();
      expect(NumberListValidator.validate).toEqual(jasmine.any(Function));
    });

    it('which validates an empty array', () => {
      let result = NumberListValidator.validate('[ ]');
      expect(result.valid).toBe(true);
      expect(result.parsed).toEqual([]);
    });

    it('which validates an valid array consisting of several numbers', () => {
      let result = NumberListValidator.validate('[ 1, 2,   3.0,   -10, 0, -10.3 ]');
      expect(result.valid).toBe(true);
      expect(result.parsed).toEqual([1, 2, 3.0, -10, 0, -10.3]);
    });

    it('which does not validate a string which is not a serialized array', () => {
      let result = NumberListValidator.validate('[ 1, 2, ');
      expect(result.valid).toBe(false);
      expect(result.parsed).toBe(null);
    });

    it('which does not validate an array which is not consisted of entirely numbers', () => {
      let testArrayWithNonnumbers = (str) => {
        let result = NumberListValidator.validate(str);
        expect(result.valid).toBe(false);
        expect(result.reason).toEqual('all items have to be numbers');
        expect(result.parsed).toBe(null);
      };

      testArrayWithNonnumbers('[ null ]');
      testArrayWithNonnumbers('[ { \"1\": 1} ]');
      testArrayWithNonnumbers('[ 1, 2, \"3\"]');
    });
  });
});
