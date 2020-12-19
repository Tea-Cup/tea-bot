import { hasOwnProperty, isFunction } from './util';

if (!hasOwnProperty(Array, 'contains'))
  Array.prototype.contains = function (
    arg: any | ((this: void, value: any, index: number, obj: any[]) => boolean)
  ) {
    if (isFunction(arg)) return !!this.find(arg);
    return this.includes(arg);
  };
