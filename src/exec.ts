
/* IMPORT */

import compile from './compile';
import type {Context} from './types';

/* MAIN */

const exec = ( expression: string, context?: Context ): unknown => {

  return compile ( expression )( context );

};

/* EXPORT */

export default exec;
