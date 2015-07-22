/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface ValidatorInterface {
  (str:string): ValidatorResultInterface
}

interface ValidatorResultInterface {
  'valid': boolean,
  'reason': string,
  'parsed': Array<number>
}

interface NumberListValidatorInterface {
  validate: ValidatorInterface
}

angular.module('sumToZero').
  factory('NumberListValidator', /*@ngInject*/():NumberListValidatorInterface => {
    let validator:ValidatorInterface = (numberListStr) => {
      let composeResult = (validate:boolean, reason:string = '', parsed:Array<number> = null) => {
        return {
          'valid': validate,
          'reason': reason,
          'parsed': parsed
        };
      };

      let parsedNumberList:Array<number>;
      try {
        parsedNumberList = JSON.parse(numberListStr);
      } catch (e) {
        return composeResult(false, `${e}`, null);
      }

      let allItemsAreNumbers = _.every(_.map(parsedNumberList, item => typeof item === 'number'));
      return allItemsAreNumbers ?
        composeResult(true, '', parsedNumberList) :
        composeResult(false, 'all items have to be numbers', null);
    };

    return {
      'validate': validator
    }
  });