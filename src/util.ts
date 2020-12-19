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

export type ValidationSchemaType =
  | 'string'
  | 'number'
  | { [k: string]: ValidationSchema };
export interface ValidationSchema {
  type: ValidationSchemaType;
  array?: boolean;
  optional?: boolean;
}
export function validateStructure(obj: GenericObject, schema: ValidationSchema) {
  if (obj === null || obj === undefined) {
    return !!schema.optional;
  }
  if (Array.isArray(obj)) {
    if (!schema.array) return false;
    for (const el of obj) {
      if (!validateValue(el, schema.type)) return false;
    }
    return true;
  }
  return validateValue(obj, schema.type);
}
function validateValue(val: GenericObject, type: ValidationSchemaType) {
  if (type === 'string') return typeof val === 'string';
  if (type === 'number') return typeof val === 'number';

  const typeKeys = keysOf(type);
  const valKeys = keysOf(val);
  const inner: string[] = [];
  const outer: string[] = [];

  throw new Error('TODO: Not implemented');
}
