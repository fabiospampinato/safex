
/* IMPORT */

import {validate} from 'grammex';
import Grammar from './grammar';

/* MAIN */

const _validate = ( expression: string ): boolean => {

  return validate ( expression, Grammar );

};

/* EXPORT */

export default _validate;
