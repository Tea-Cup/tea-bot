export function hasOwnProperty(obj: any, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(func: any): func is Function {
  return func && Object.toString.call(func) === '[object Function]';
}
export function keysOf<T>(obj: T): string[] {
  return Object.keys(obj).map((key) => String(key));
}

export interface Collection<V> {
  [k: string]: V;
}
export interface GenericObject {
  [k: string]: any;
}
