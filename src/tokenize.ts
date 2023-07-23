
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';
import type {Token} from './types';

/* CONSTANTS */

const UNARY_ALLOWED_PREV_TYPES = new Set ([ 'groupOpen', 'accessOpen', 'logicalNot', 'bitwiseNot', 'plus', 'negation', 'addition', 'subtraction', undefined ]);

/* HELPERS */

//TODO: This normalization step should just not exist, the grammar should just be more precise

const normalize = ( tokens: Token[] ): Token[] => {

  for ( let i = 0, l = tokens.length; i < l; i++ ) {

    const type = tokens[i].type;
    const ptype = tokens[i - 1]?.type;

    if ( type === 'addition' && UNARY_ALLOWED_PREV_TYPES.has ( ptype ) ) {

      tokens.splice ( i, 1, { type: 'plus' } );

    } else if ( type === 'subtraction' && UNARY_ALLOWED_PREV_TYPES.has ( ptype ) ) {

      tokens.splice ( i, 1, { type: 'negation' } );

    }

  }

  return tokens;

};

/* MAIN */

const tokenize = ( expression: string ): Token[] => {

  return normalize ( parse ( expression, Grammar, {} ) );

};

/* EXPORT */

export default tokenize;
