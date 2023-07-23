
/* IMPORT */

import compile from './compile';
import exec from './exec';
import parse from './parse';
import tokenize from './tokenize';
import validate from './validate';

/* MAIN */

const safex = {
  compile,
  exec,
  parse,
  tokenize,
  validate
};

/* EXPORT */

export default safex;
