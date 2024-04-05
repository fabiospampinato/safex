
/* IMPORT */

import compile from './compile';
import exec from './exec';
import parse from './parse';
import validate from './validate';
import type {Context, Node} from './types';

/* MAIN */

const safex = {
  compile,
  exec,
  parse,
  validate
};

/* EXPORT */

export default safex;
export type {Context, Node};
