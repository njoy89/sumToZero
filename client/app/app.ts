/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface LodashInterface {
  every: (arr:Array<any>) => boolean,
  map: (obj:Array<any>, fun:(item:any) => any) => Array<any>,
  assign: (obj1:Object, obj2:Object) => Object,
  reduce: (obj1:Object, fun:(item1:any, item2:any, item3:any)=>any, obj2:Object) => any
}

interface ScopeInterface {
  $watch: (str:string, fun:(item1:any, item2:any) => void) => void
}

declare let angular:any;
declare let _:LodashInterface;

angular.module('sumToZero', [
  'ui.bootstrap',
  'sumToZero.partials'
]);