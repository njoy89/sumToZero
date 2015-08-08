/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

interface LodashInterface {
  every: (arr:Array<any>) => boolean,
  map: (obj:Array<any>, fun:(item:any, ix:number) => any) => Array<any>,
  assign: (obj1:Object, obj2:Object) => Object,
  reduce: (obj1:Object, fun:(item1:any, item2:any, item3:any)=>any, obj2:Object) => any,
  last: (obj:Object) => any,
  forEach: (obj:any, fun:(item:any, ix:number) => any) => void;
  any: (arr:Array<any>) => boolean
}

interface ScopeInterface {
  $watch: (str:string, fun:(item1:any, item2:any) => void) => void,
  $applyAsync: (fun:any) => void
}

interface DOMElementInterface {
  find: (sel:string) => any;
}

declare let $:any;
declare let angular:any;
declare let _:LodashInterface;

angular.module('sumToZero', [
  'ui.bootstrap',
  'sumToZero.partials'
]);