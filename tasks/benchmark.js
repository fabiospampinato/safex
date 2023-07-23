
/* IMPORT */

import benchmark from 'benchloop';
import safex from '../dist/index.js';

/* HELPERS */

const safeBasicExpression = safex.compile ( 'isFoo' );
const safeComplexExpression = safex.compile ( 'isFoo && ( isBar || isBaz < 3 )' );
const unsafeBasicExpression = new Function ( 'context', 'with ( context ) { return isFoo; }' );
const unsafeComplexExpression = new Function ( 'context', 'with ( context ) { return isFoo && ( isBar || isBaz < 3 ); }' );
const context = { isFoo: true, isBar: false, isBaz: 123 };

/* MAIN */

benchmark.config ({
  iterations: 10_000
});

benchmark.group ( 'safe', () => {

  benchmark ({
    name: 'parse.basic',
    fn: () => {
      safex.parse ( 'isFoo' );
    }
  });

  benchmark ({
    name: 'parse.complex',
    fn: () => {
      safex.parse ( 'isFoo && ( isBar || isBaz < 3 )' );
    }
  });

  benchmark ({
    name: 'exec.basic',
    fn: () => {
      safeBasicExpression ( context );
    }
  });

  benchmark ({
    name: 'exec.complex',
    fn: () => {
      safeComplexExpression ( context );
    }
  });

});

benchmark.group ( 'unsafe', () => {

  benchmark ({
    name: 'parse.basic',
    fn: () => {
      new Function ( 'context', 'with ( context ) { return isFoo; }' );
    }
  });

  benchmark ({
    name: 'parse.complex',
    fn: () => {
      new Function ( 'context', 'with ( context ) { return isFoo && ( isBar || isBaz < 3 ); }' );
    }
  });

  benchmark ({
    name: 'exec.basic',
    fn: () => {
      unsafeBasicExpression ( context );
    }
  });

  benchmark ({
    name: 'exec.complex',
    fn: () => {
      unsafeComplexExpression ( context );
    }
  });

});

benchmark.summary ();
