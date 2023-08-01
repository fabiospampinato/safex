
/* MAIN */

const hasOwn = ( target: object, key: string ): boolean => {

  return Object.prototype.hasOwnProperty.call ( target, key );

};

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

/* EXPORT */

export {hasOwn, isFunction, isString};
