
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';
import type {NodeRoot} from './types';

/* MAIN */

const _parse = ( expression: string ): NodeRoot => {

  return parse ( expression, Grammar )[0];

};

/* EXPORT */

export default _parse;
