
/* IMPORT */

import compile from './compile';

/* MAIN */

const validate = ( expression: string ): boolean => {

  try {

    compile ( expression );

    return true;

  } catch {

    return false;

  }

};

/* EXPORT */

export default validate;
