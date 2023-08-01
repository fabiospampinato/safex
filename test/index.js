
/* IMPORT */

import {describe} from 'fava';
import safex from '../dist/index.js';

/* MAIN */

describe ( 'Safex', () => {

  describe ( 'exec', it => {

    it ( 'supports booleans', t => {

      t.is ( safex.exec ( 'true' ), true );
      t.is ( safex.exec ( 'false' ), false );

    });

    it ( 'supports null', t => {

      t.is ( safex.exec ( 'null' ), null );

    });

    it ( 'supports undefined', t => {

      t.is ( safex.exec ( 'undefined' ), undefined );

    });

    it ( 'supports bigints', t => {

      t.is ( safex.exec ( '123n' ), 123n );
      t.is ( safex.exec ( '9007199254740991123n' ), 9007199254740991123n );

    });

    it ( 'supports numbers', t => {

      t.is ( safex.exec ( '123' ), 123 );
      t.is ( safex.exec ( '123.123' ), 123.123 );
      t.is ( safex.exec ( '123.' ), 123. );
      t.is ( safex.exec ( '.123' ), .123 );

      t.is ( safex.exec ( '123e10' ), 123e10 );
      t.is ( safex.exec ( '123.123e-10' ), 123.123e-10 );
      t.is ( safex.exec ( '123.E10' ), 123.E10 );
      t.is ( safex.exec ( '.123E-10' ), .123E-10 );

    });

    it ( 'supports strings', t => {

      t.is ( safex.exec ( '\'\'' ), '' );
      t.is ( safex.exec ( '\'\\\'\'' ), '\'' );
      t.is ( safex.exec ( '\'"foo"\\\\n`bar`\'' ), '"foo"\\n`bar`' );

      t.is ( safex.exec ( '""' ), '' );
      t.is ( safex.exec ( '"\\""' ), '"' );
      t.is ( safex.exec ( '"\'foo\'\\\\n`bar`"' ), '\'foo\'\\n`bar`' );

      t.is ( safex.exec ( '``' ), '' );
      t.is ( safex.exec ( '`\\``' ), '`' );
      t.is ( safex.exec ( '`\'foo\'\\\\n"bar"`' ), '\'foo\'\\n"bar"' );
      t.is ( safex.exec ( `\`
      \`` ), '\n      ' );

    });

    it ( 'supports variables', t => {

      t.is ( safex.exec ( 'foo' ), undefined );
      t.is ( safex.exec ( 'foo', { foo: 123 } ), 123 );
      t.is ( safex.exec ( 'Foo', { Foo: 123 } ), 123 );
      t.is ( safex.exec ( 'NaN', { NaN } ), NaN );
      t.is ( safex.exec ( 'truey', { truey: 123 } ), 123 );
      t.is ( safex.exec ( 'falsey', { falsey: 123 } ), 123 );
      t.is ( safex.exec ( 'nully', { nully: 123 } ), 123 );
      t.is ( safex.exec ( 'undefinedy', { undefinedy: 123 } ), 123 );
      t.is ( safex.exec ( 'Infinity', { Infinity } ), Infinity );
      t.is ( safex.exec ( '-Infinity', { Infinity } ), -Infinity );
      t.is ( safex.exec ( 'foo.bar.baz', { foo: { bar: { baz: 123 } } } ), 123 );

      t.is ( safex.exec ( 'foo[true]', { foo: { true: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[false]', { foo: { false: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[null]', { foo: { null: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[undefined]', { foo: { undefined: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[123n]', { foo: { 123: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[0]', { foo: { 0: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo["foo"]', { foo: { foo: 123 } } ), 123 );
      t.is ( safex.exec ( 'foo[( 1 + 2 )]', { foo: { 3: 123 } } ), 123 );

      t.is ( safex.exec ( '( foo || bar ).value', { foo: { value: 123 } } ), 123 );
      t.is ( safex.exec ( '( foo || bar ).value', { bar: { value: 123 } } ), 123 );

      t.is ( safex.exec ( 'toString' ), undefined );
      t.is ( safex.exec ( 'toString', {} ), undefined );

    });

    it ( 'supports unary operators', t => {

      t.is ( safex.exec ( '!true' ), !true );
      t.is ( safex.exec ( '!false' ), !false );

      t.is ( safex.exec ( '!!!!true' ), !!!!true );
      t.is ( safex.exec ( '!!!!false' ), !!!!false );

      t.is ( safex.exec ( '~2' ), ~2 );
      t.is ( safex.exec ( '~~2' ), ~~2 );
      t.is ( safex.exec ( '~~~2' ), ~~~2 );

      t.is ( safex.exec ( '+"1"' ), +"1" );
      t.is ( safex.exec ( '+1' ), +1 );

      t.is ( safex.exec ( '-"1"' ), -"1" );
      t.is ( safex.exec ( '-1' ), -1 );
      t.is ( safex.exec ( '-1n' ), -1n );

      t.is ( safex.exec ( '~!+-123' ), ~!+-123 );
      t.is ( safex.exec ( '-+!~123' ), -+!~123 );
      t.is ( safex.exec ( '-+!~123' ), -+!~123 );
      t.is ( safex.exec ( '-+-+123' ), -+-+123 );

      t.is ( safex.exec ( '1 + -+-+2' ), 1 + -+-+2 );
      t.is ( safex.exec ( '1 + + 1' ), 1 + + 1 );
      t.is ( safex.exec ( '1 + +1' ), 1 + +1 );
      t.is ( safex.exec ( '1 + + +1' ), 1 + + +1 );
      t.is ( safex.exec ( '1 + + + +1' ), 1 + + + +1 );
      t.is ( safex.exec ( '1 - - 1' ), 1 - - 1 );
      t.is ( safex.exec ( '1 - -1' ), 1 - -1 );
      t.is ( safex.exec ( '1 - - -1' ), 1 - - -1 );
      t.is ( safex.exec ( '1 - - - -1' ), 1 - - - -1 );

    });

    it ( 'supports binary operators', t => {

      t.is ( safex.exec ( '2 ** 3' ), 2 ** 3 );
      t.is ( safex.exec ( '2 ** 3 ** 2' ), 2 ** 3 ** 2 );
      t.is ( safex.exec ( '2 * 3' ), 2 * 3 );
      t.is ( safex.exec ( '2 * 3 * 10' ), 2 * 3 * 10 );
      t.is ( safex.exec ( '9 / 3' ), 9 / 3 );
      t.is ( safex.exec ( '9 % 4' ), 9 % 4 );
      t.is ( safex.exec ( '2 + 3' ), 2 + 3 );
      t.is ( safex.exec ( '2 - 3' ), 2 - 3 );
      t.is ( safex.exec ( '2 << 1' ), 2 << 1 );
      t.is ( safex.exec ( '2 >> 1' ), 2 >> 1 );
      t.is ( safex.exec ( '2 >>> 1' ), 2 >>> 1 );
      t.is ( safex.exec ( '0 < 1' ), 0 < 1 );
      t.is ( safex.exec ( '1 < 1' ), 1 < 1 );
      t.is ( safex.exec ( '0 <= 1' ), 0 <= 1 );
      t.is ( safex.exec ( '1 <= 1' ), 1 <= 1 );
      t.is ( safex.exec ( '2 <= 1' ), 2 <= 1 );
      t.is ( safex.exec ( '1 > 1' ), 1 > 1 );
      t.is ( safex.exec ( '2 > 1' ), 2 > 1 );
      t.is ( safex.exec ( '0 >= 1' ), 0 >= 1 );
      t.is ( safex.exec ( '1 >= 1' ), 1 >= 1 );
      t.is ( safex.exec ( '0 == 0' ), 0 == 0 );
      t.is ( safex.exec ( '0 == 1' ), 0 == 1 );
      t.is ( safex.exec ( '0 == "0"' ), 0 == "0" );
      t.is ( safex.exec ( '0 == "1"' ), 0 == "1" );
      t.is ( safex.exec ( '0 != 0' ), 0 != 0 );
      t.is ( safex.exec ( '0 != 1' ), 0 != 1 );
      t.is ( safex.exec ( '0 != "0"' ), 0 != "0" );
      t.is ( safex.exec ( '0 != "1"' ), 0 != "1" );
      t.is ( safex.exec ( '0 === 0' ), 0 === 0 );
      t.is ( safex.exec ( '0 === 1' ), 0 === 1 );
      t.is ( safex.exec ( '0 === "0"' ), 0 === "0" );
      t.is ( safex.exec ( '0 === "1"' ), 0 === "1" );
      t.is ( safex.exec ( '0 !== 0' ), 0 !== 0 );
      t.is ( safex.exec ( '0 !== 1' ), 0 !== 1 );
      t.is ( safex.exec ( '0 !== "0"' ), 0 !== "0" );
      t.is ( safex.exec ( '0 !== "1"' ), 0 !== "1" );
      t.is ( safex.exec ( '2 & 1' ), 2 & 1 );
      t.is ( safex.exec ( '3 & 1' ), 3 & 1 );
      t.is ( safex.exec ( '2 ^ 1' ), 2 ^ 1 );
      t.is ( safex.exec ( '3 ^ 1' ), 3 ^ 1 );
      t.is ( safex.exec ( '2 | 1' ), 2 | 1 );
      t.is ( safex.exec ( '3 | 1' ), 3 | 1 );
      t.is ( safex.exec ( '0 && 1' ), 0 && 1 );
      t.is ( safex.exec ( '1 && 2' ), 1 && 2 );
      t.is ( safex.exec ( '0 || 1' ), 0 || 1 );
      t.is ( safex.exec ( '1 || 2' ), 1 || 2 );
      t.is ( safex.exec ( '0 ?? 1' ), 0 ?? 1 );
      t.is ( safex.exec ( 'null ?? 1' ), null ?? 1 );
      t.is ( safex.exec ( 'undefined ?? 1' ), undefined ?? 1 );

    });

    it ( 'supports groups', t => {

      t.is ( safex.exec ( '( 1 )' ), ( 1 ) );
      t.is ( safex.exec ( '( 1 + 2 )' ), ( 1 + 2 ) );
      t.is ( safex.exec ( '1 + ( 1 + ( 1 + 1 ) ) + 1' ), 1 + ( 1 + ( 1 + 1 ) ) + 1 );
      t.is ( safex.exec ( '( 1 + 2 ) * 3' ), ( 1 + 2 ) * 3 );
      t.is ( safex.exec ( '( 1 + 2 ) ** 3' ), ( 1 + 2 ) ** 3 );
      t.is ( safex.exec ( '((( 1 )))' ), ((( 1 ))) );

    });

    it ( 'supports proper operator precedence', t => {

      t.is ( safex.exec ( '!1' ), !1 );
      t.is ( safex.exec ( '~1' ), ~1 );
      t.is ( safex.exec ( '+1' ), +1 );
      t.is ( safex.exec ( '-1' ), -1 );

      t.is ( safex.exec ( '2 ** 3 * 2' ), 2 ** 3 * 2 );
      t.is ( safex.exec ( '2 * 2 ** 3' ), 2 * 2 ** 3 );
      t.is ( safex.exec ( '3 * 30 / 5' ), 3 * 30 / 5 );
      t.is ( safex.exec ( '90 / 3 * 30' ), 90 / 3 * 30 );
      t.is ( safex.exec ( '90 / 3 % 3' ), 90 / 3 % 3 );
      t.is ( safex.exec ( '3 % 4 / 2' ), 3 % 4 / 2 );
      t.is ( safex.exec ( '3 % 2 + 1' ), 3 % 2 + 1 );
      t.is ( safex.exec ( '1 + 2 % 3' ), 1 + 2 % 3 );
      t.is ( safex.exec ( '3 % 2 - 1' ), 3 % 2 - 1 );
      t.is ( safex.exec ( '1 - 2 % 3' ), 1 - 2 % 3 );
      t.is ( safex.exec ( '2 - 1 << 1' ), 2 - 1 << 1 );
      t.is ( safex.exec ( '1 << 2 - 1' ), 1 << 2 - 1 );
      t.is ( safex.exec ( '2 << 1 >> 2' ), 2 << 1 >> 2 );
      t.is ( safex.exec ( '2 >> 1 << 2' ), 2 >> 1 << 2 );
      t.is ( safex.exec ( '2 >>> 2 < 2' ), 2 >>> 2 < 2 );
      t.is ( safex.exec ( '2 < 2 >>> 2' ), 2 < 2 >>> 2 );
      t.is ( safex.exec ( '2 < 0 <= 0' ), 2 < 0 <= 0 );
      t.is ( safex.exec ( '0 <= 0 < 2' ), 0 <= 0 < 2 );
      t.is ( safex.exec ( '2 > 0 <= 1' ), 2 > 0 <= 1 );
      t.is ( safex.exec ( '0 <= 1 > 2' ), 0 <= 1 > 2 );
      t.is ( safex.exec ( '2 > 0 >= 1' ), 2 > 0 >= 1 );
      t.is ( safex.exec ( '0 >= 1 > 2' ), 0 >= 1 > 2 );
      t.is ( safex.exec ( '0 >= 0 == true' ), 0 >= 0 == true );
      t.is ( safex.exec ( '0 == 0 != 2' ), 0 == 0 != 2 );
      t.is ( safex.exec ( '0 != 2 == 0' ), 0 != 2 == 0 );
      t.is ( safex.exec ( 'true === 0 != 2' ), true === 0 != 2 );
      t.is ( safex.exec ( '0 != 2 === true' ), 0 != 2 === true );
      t.is ( safex.exec ( 'true === 0 !== false' ), true === 0 !== false );
      t.is ( safex.exec ( 'false !== 0 === true' ), false !== 0 === true );
      t.is ( safex.exec ( 'false !== 0 & 3' ), false !== 0 & 3 );
      t.is ( safex.exec ( '15 & 7 ^ 3' ), 15 & 7 ^ 3 );
      t.is ( safex.exec ( '7 ^ 3 & 15' ), 7 ^ 3 & 15 );
      t.is ( safex.exec ( '1 | 7 ^ 3' ), 1 | 7 ^ 3 );
      t.is ( safex.exec ( '7 ^ 3 | 1' ), 7 ^ 3 | 1 );
      t.is ( safex.exec ( '3 | 1 && 3' ), 3 | 1 && 3 );
      t.is ( safex.exec ( '3 && 4 | 1' ), 3 && 4 | 1 );
      t.is ( safex.exec ( '1 && 0 || 2' ), 1 && 0 || 2 );
      t.is ( safex.exec ( '0 && 0 || 2' ), 0 && 0 || 2 );
      t.is ( safex.exec ( '( 0 || null ) ?? 2' ), ( 0 || null ) ?? 2 );
      t.is ( safex.exec ( '( 1 || null ) ?? 2' ), ( 1 || null ) ?? 2 );
      t.is ( safex.exec ( '( 0 && null ) ?? 2' ), ( 0 && null ) ?? 2 );
      t.is ( safex.exec ( '( 1 && null ) ?? 2' ), ( 1 && null ) ?? 2 );
      t.is ( safex.exec ( '2 ?? ( 0 || null )' ), 2 ?? ( 0 || null ) );
      t.is ( safex.exec ( '2 ?? ( 1 || null )' ), 2 ?? ( 1 || null ) );
      t.is ( safex.exec ( '2 ?? ( 0 && null )' ), 2 ?? ( 0 && null ) );
      t.is ( safex.exec ( '2 ?? ( 1 && null )' ), 2 ?? ( 1 && null ) );

      t.is ( safex.exec ( '( -1 ) ** 2' ), ( -1 ) ** 2 );
      t.is ( safex.exec ( '1 + 2 ** 3 * 4 / 5 >> 6' ), 1 + 2 ** 3 * 4 / 5 >> 6 );

    });

  });

  describe ( 'parse', it => {

    it ( 'supports booleans', t => {

      t.deepEqual ( safex.parse ( 'true' ), { type: 'root', children: [{ type: 'true' }] } );
      t.deepEqual ( safex.parse ( 'false' ), { type: 'root', children: [{ type: 'false' }] } );

    });

    it ( 'supports null', t => {

      t.deepEqual ( safex.parse ( 'null' ), { type: 'root', children: [{ type: 'null' }] } );

    });

    it ( 'supports undefined', t => {

      t.deepEqual ( safex.parse ( 'undefined' ), { type: 'root', children: [{ type: 'undefined' }] } );

    });

    it ( 'supports bigints', t => {

      t.deepEqual ( safex.parse ( '123n' ), { type: 'root', children: [{ type: 'bigint', value: 123n }] } );
      t.deepEqual ( safex.parse ( '9007199254740991123n' ), { type: 'root', children: [{ type: 'bigint', value: 9007199254740991123n }] } );

    });

    it ( 'supports numbers', t => {

      t.deepEqual ( safex.parse ( '123' ), { type: 'root', children: [{ type: 'number', value: 123 }] } );
      t.deepEqual ( safex.parse ( '123.123' ), { type: 'root', children: [{ type: 'number', value: 123.123 }] } );
      t.deepEqual ( safex.parse ( '123.' ), { type: 'root', children: [{ type: 'number', value: 123. }] } );
      t.deepEqual ( safex.parse ( '.123' ), { type: 'root', children: [{ type: 'number', value: .123 }] } );

      t.deepEqual ( safex.parse ( '123e10' ), { type: 'root', children: [{ type: 'number', value: 123e10 }] } );
      t.deepEqual ( safex.parse ( '123.123e-10' ), { type: 'root', children: [{ type: 'number', value: 123.123e-10 }] } );
      t.deepEqual ( safex.parse ( '123.E10' ), { type: 'root', children: [{ type: 'number', value: 123.E10 }] } );
      t.deepEqual ( safex.parse ( '.123E-10' ), { type: 'root', children: [{ type: 'number', value: .123E-10 }] } );

    });

    it ( 'supports strings', t => {

      t.deepEqual ( safex.parse ( '\'\'' ), { type: 'root', children: [{ type: 'string', value: '' }] } );
      t.deepEqual ( safex.parse ( '\'\\\'\'' ), { type: 'root', children: [{ type: 'string', value: '\'' }] } );
      t.deepEqual ( safex.parse ( '\'"foo"\\\\n`bar`\'' ), { type: 'root', children: [{ type: 'string', value: '"foo"\\n`bar`' }] } );

      t.deepEqual ( safex.parse ( '""' ), { type: 'root', children: [{ type: 'string', value: '' }] } );
      t.deepEqual ( safex.parse ( '"\\""' ), { type: 'root', children: [{ type: 'string', value: '"' }] } );
      t.deepEqual ( safex.parse ( '"\'foo\'\\\\n`bar`"' ), { type: 'root', children: [{ type: 'string', value: '\'foo\'\\n`bar`' }] } );

      t.deepEqual ( safex.parse ( '``' ), { type: 'root', children: [{ type: 'string', value: '' }] } );
      t.deepEqual ( safex.parse ( '`\\``' ), { type: 'root', children: [{ type: 'string', value: '`' }] } );
      t.deepEqual ( safex.parse ( '`\'foo\'\\\\n"bar"`' ), { type: 'root', children: [{ type: 'string', value: '\'foo\'\\n"bar"' }] } );

    });

    it ( 'supports variables', t => {

      t.deepEqual ( safex.parse ( 'foo' ), { type: 'root', children: [{ type: 'identifier', value: 'foo' }] } );
      t.deepEqual ( safex.parse ( 'Foo' ), { type: 'root', children: [{ type: 'identifier', value: 'Foo' }] } );

      t.deepEqual ( safex.parse ( 'foo.bar.baz' ), { type: 'root', children: [{ type: 'memberAccess', children: [{ type: 'memberAccess', children: [{ type: 'identifier', value: 'foo' }, 'bar'] }, 'baz'] }] } );

      t.deepEqual ( safex.parse ( 'foo[0]' ), { type: 'root', children: [{ type: 'computedMemberAccess', children: [{ type: 'identifier', value: 'foo' }, { type: 'number', value: 0 }] }] } );
      t.deepEqual ( safex.parse ( 'foo["foo"]' ), { type: 'root', children: [{ type: 'computedMemberAccess', children: [{ type: 'identifier', value: 'foo' }, { type: 'string', value: 'foo' }] }] } );
      t.deepEqual ( safex.parse ( 'foo[( 1 + 2 )]' ), { type: 'root', children: [{ type: 'computedMemberAccess', children: [{ type: 'identifier', value: 'foo' }, { type: 'group', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'number', value: 2 }] }] }] }] } );

      t.deepEqual ( safex.parse ( '( foo || bar ).value' ), { type: 'root', children: [{ type: 'memberAccess', children: [{ type: 'group', children: [{ type: 'logicalOr', children: [{ type: 'identifier', value: 'foo' }, { type: 'identifier', value: 'bar' }] }] }, 'value'] }] } );

    });

    it ( 'supports unary operators', t => {

      t.deepEqual ( safex.parse ( '!0' ), { type: 'root', children: [{ type: 'logicalNot', children: [{ type: 'number', value: 0 }] }] } );
      t.deepEqual ( safex.parse ( '~0' ), { type: 'root', children: [{ type: 'bitwiseNot', children: [{ type: 'number', value: 0 }] }] } );
      t.deepEqual ( safex.parse ( '+0' ), { type: 'root', children: [{ type: 'plus', children: [{ type: 'number', value: 0 }] }] } );
      t.deepEqual ( safex.parse ( '-0' ), { type: 'root', children: [{ type: 'negation', children: [{ type: 'number', value: 0 }] }] } );

    });

    it ( 'supports binary operators', t => {

      t.deepEqual ( safex.parse ( '0 ** 1' ), { type: 'root', children: [{ type: 'exponentiation', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 * 1' ), { type: 'root', children: [{ type: 'multiplication', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 / 1' ), { type: 'root', children: [{ type: 'division', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 % 1' ), { type: 'root', children: [{ type: 'reminder', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 + 1' ), { type: 'root', children: [{ type: 'addition', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 - 1' ), { type: 'root', children: [{ type: 'subtraction', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 << 1' ), { type: 'root', children: [{ type: 'bitwiseLeftShift', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 >> 1' ), { type: 'root', children: [{ type: 'bitwiseRightShift', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 >>> 1' ), { type: 'root', children: [{ type: 'bitwiseUnsignedRightShift', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 < 1' ), { type: 'root', children: [{ type: 'lessThan', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 <= 1' ), { type: 'root', children: [{ type: 'lessThanOrEqual', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 > 1' ), { type: 'root', children: [{ type: 'greaterThan', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 >= 1' ), { type: 'root', children: [{ type: 'greaterThanOrEqual', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 == 1' ), { type: 'root', children: [{ type: 'equality', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 != 1' ), { type: 'root', children: [{ type: 'inequality', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 === 1' ), { type: 'root', children: [{ type: 'strictEquality', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 !== 1' ), { type: 'root', children: [{ type: 'strictInequality', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 & 1' ), { type: 'root', children: [{ type: 'bitwiseAnd', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 ^ 1' ), { type: 'root', children: [{ type: 'bitwiseXor', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 | 1' ), { type: 'root', children: [{ type: 'bitwiseOr', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 && 1' ), { type: 'root', children: [{ type: 'logicalAnd', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 || 1' ), { type: 'root', children: [{ type: 'logicalOr', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );
      t.deepEqual ( safex.parse ( '0 ?? 1' ), { type: 'root', children: [{ type: 'nullishCoalescing', children: [{ type: 'number', value: 0 }, { type: 'number', value: 1 }] }] } );

    });

    it ( 'supports groups', t => {

      t.deepEqual ( safex.parse ( '( 1 )' ), { type: 'root', children: [{ type: 'group', children: [{ type: 'number', 'value': 1 }] }] } );
      t.deepEqual ( safex.parse ( '( 1 + 2 )' ), { type: 'root', children: [{ type: 'group', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'number', value: 2 }] }] }] } );
      t.deepEqual ( safex.parse ( '1 + ( 1 + ( 1 + 1 ) ) + 1' ), { type: 'root', children: [{ type: 'addition', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'group', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'group', children: [{ type: 'addition', children: [{ type: 'number', value: 1 }, { type: 'number', value: 1 }] }] }] }] }] }, { type: 'number', value: 1 }] }] } );

    });

  });

  describe ( 'validate', it => {

    it ( 'detects actually invalid expressions', t => {

      t.false ( safex.validate ( '' ) );
      t.false ( safex.validate ( '\n' ) );
      t.false ( safex.validate ( '\n123\n' ) );

      t.false ( safex.validate ( '.' ) );
      t.false ( safex.validate ( '0.0n' ) );
      t.false ( safex.validate ( '1e10n' ) );
      t.false ( safex.validate ( '0n 0n' ) );
      t.false ( safex.validate ( '0n0n' ) );

      t.false ( safex.validate ( '0 0' ) );
      t.false ( safex.validate ( '00' ) );

      t.false ( safex.validate ( '0 0n' ) );

      t.false ( safex.validate ( `'
      '` ) );

      t.false ( safex.validate ( `"
      "` ) );

      t.false ( safex.validate ( '\'' ) );
      t.false ( safex.validate ( '\'foo' ) );
      t.false ( safex.validate ( '\'foo\' \'foo\'' ) );

      t.false ( safex.validate ( '"' ) );
      t.false ( safex.validate ( '"foo' ) );
      t.false ( safex.validate ( '"foo" "foo"' ) );

      t.false ( safex.validate ( '`' ) );
      t.false ( safex.validate ( '`foo' ) );
      t.false ( safex.validate ( '`foo` `foo`' ) );

      t.false ( safex.validate ( '0 \'foo\'' ) );
      t.false ( safex.validate ( '0n \'foo\'' ) );
      t.false ( safex.validate ( '\'foo\' "foo"' ) );
      t.false ( safex.validate ( '\'foo\' `foo`' ) );
      t.false ( safex.validate ( '"foo" `foo`' ) );

      t.false ( safex.validate ( '!' ) );
      t.false ( safex.validate ( '~' ) );
      t.false ( safex.validate ( '+' ) );
      t.false ( safex.validate ( '-' ) );
      t.false ( safex.validate ( '++123' ) );
      t.false ( safex.validate ( '+[123]' ) );
      t.false ( safex.validate ( '+ ||' ) );

      t.false ( safex.validate ( '--123' ) );
      t.false ( safex.validate ( '++(123)' ) );
      t.false ( safex.validate ( '--(123)' ) );
      t.false ( safex.validate ( '++[123]' ) );
      t.false ( safex.validate ( '--[123]' ) );

      t.false ( safex.validate ( '123!' ) );
      t.false ( safex.validate ( '123~' ) );
      t.false ( safex.validate ( '123+' ) );
      t.false ( safex.validate ( '123-' ) );
      t.false ( safex.validate ( '123++' ) );
      t.false ( safex.validate ( '123--' ) );
      t.false ( safex.validate ( '(123)++' ) );
      t.false ( safex.validate ( '(123)--' ) );

      t.false ( safex.validate ( '**' ) );
      t.false ( safex.validate ( '*' ) );
      t.false ( safex.validate ( '/' ) );
      t.false ( safex.validate ( '%' ) );
      t.false ( safex.validate ( '+' ) );
      t.false ( safex.validate ( '-' ) );
      t.false ( safex.validate ( '<<' ) );
      t.false ( safex.validate ( '>>' ) );
      t.false ( safex.validate ( '>>>' ) );
      t.false ( safex.validate ( '<' ) );
      t.false ( safex.validate ( '<=' ) );
      t.false ( safex.validate ( '>' ) );
      t.false ( safex.validate ( '>=' ) );
      t.false ( safex.validate ( '==' ) );
      t.false ( safex.validate ( '!=' ) );
      t.false ( safex.validate ( '===' ) );
      t.false ( safex.validate ( '!==' ) );
      t.false ( safex.validate ( '&' ) );
      t.false ( safex.validate ( '^' ) );
      t.false ( safex.validate ( '|' ) );
      t.false ( safex.validate ( '&&' ) );
      t.false ( safex.validate ( '||' ) );
      t.false ( safex.validate ( '??' ) );

      t.false ( safex.validate ( '1 ** ** 1' ) );
      t.false ( safex.validate ( '1 * * 1' ) );
      t.false ( safex.validate ( '1 / / 1' ) );
      t.false ( safex.validate ( '1 % % 1' ) );
      t.false ( safex.validate ( '1 << << 1' ) );
      t.false ( safex.validate ( '1 >> >> 1' ) );
      t.false ( safex.validate ( '1 >>> >>> 1' ) );
      t.false ( safex.validate ( '1 < < 1' ) );
      t.false ( safex.validate ( '1 <= <= 1' ) );
      t.false ( safex.validate ( '1 > > 1' ) );
      t.false ( safex.validate ( '1 >= >= 1' ) );
      t.false ( safex.validate ( '1 == == 1' ) );
      t.false ( safex.validate ( '1 != != 1' ) );
      t.false ( safex.validate ( '1 === === 1' ) );
      t.false ( safex.validate ( '1 !== !== 1' ) );
      t.false ( safex.validate ( '1 & & 1' ) );
      t.false ( safex.validate ( '1 ^ ^ 1' ) );
      t.false ( safex.validate ( '1 | | 1' ) );
      t.false ( safex.validate ( '1 && && 1' ) );
      t.false ( safex.validate ( '1 || || 1' ) );
      t.false ( safex.validate ( '1 ?? ?? 1' ) );

      t.false ( safex.validate ( '1 || || || 1' ) );
      t.false ( safex.validate ( '1 || || ** 1' ) );

      t.false ( safex.validate ( '(' ) );
      t.false ( safex.validate ( ')' ) );
      t.false ( safex.validate ( '()()' ) );
      t.false ( safex.validate ( '(||)' ) );
      t.false ( safex.validate ( '([])' ) );

      ['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'eval', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'package', 'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'].forEach ( reserved => {
        t.false ( safex.validate ( reserved ) );
      });

      t.false ( safex.validate ( 'foo.' ) );
      t.false ( safex.validate ( '.foo' ) );
      t.false ( safex.validate ( 'foo.123' ) );

      t.false ( safex.validate ( '[' ) );
      t.false ( safex.validate ( ']' ) );
      t.false ( safex.validate ( '[][]' ) );
      t.false ( safex.validate ( '[||]' ) );
      t.false ( safex.validate ( '[()]' ) );
      t.false ( safex.validate ( '[123]' ) );

      t.false ( safex.validate ( 'foo[]' ) );
      t.false ( safex.validate ( 'foo[1 2]' ) );

      t.false ( safex.validate ( 'eval ( "alert(1)" )' ) );

      //TODO: Add checks for the following (very) edge cases:
      //TODO: ** doesn't want logicalNot/bitwiseNot/plus/negation to its left
      //TODO: ?? doesn't want logicalAnd/logicalOr to its left/right

      // t.false ( safex.validate ( '0 || null ?? 2' ) );
      // t.false ( safex.validate ( '1 || null ?? 2' ) );
      // t.false ( safex.validate ( '0 && null ?? 2' ) );
      // t.false ( safex.validate ( '1 && null ?? 2' ) );

      // t.false ( safex.validate ( '2 ?? 0 || null' ) );
      // t.false ( safex.validate ( '2 ?? 1 || null' ) );
      // t.false ( safex.validate ( '2 ?? 0 && null' ) );
      // t.false ( safex.validate ( '2 ?? 1 && null' ) );

      // t.false ( safex.validate ( '-1 ** 2' ) );

    });

  });

});
