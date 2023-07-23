
/* IMPORT */

import {EVALUATORS} from './compile';
import tokenize from './tokenize';
import type {NodeRoot, NodeVariableAccess, Node} from './types';
import type {Token} from './types';

/* HELPERS */

const ACCESSIBLE_TOKENS = new Set ([ 'identifier', 'group', 'access', 'true', 'false', 'bigint', 'number', 'string' ])
const BINARY_TOKENS = new Set ([ 'exponentiation', 'multiplication', 'division', 'reminder', 'addition', 'subtraction', 'bitwiseLeftShift', 'bitwiseRightShift', 'bitwiseUnsignedRightShift', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'equality', 'inequality', 'strictEquality', 'strictInequality', 'bitwiseAnd', 'bitwiseXor', 'bitwiseOr', 'logicalAnd', 'logicalOr', 'nullishCoalescing' ]);
const IDENTIFIER_FORBIDDEN = new Set ([ 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'eval', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'package', 'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield' ]);

const OPERATOR_PRECENDECE_GROUPS_UNARY = [
  new Set ([ 'logicalNot', 'bitwiseNot', 'plus', 'negation' ])
];

const OPERATOR_PRECENDECE_GROUPS_BINARY_RTL = [
  new Set ([ 'exponentiation' ])
];

const OPERATOR_PRECENDECE_GROUPS_BINARY_LTR = [
  // new Set ([ 'identifier', 'property', 'computedProperty' ]),
  // new Set ([ 'logicalNot', 'bitwiseNot', 'plus', 'negation' ]),
  // new Set ([ 'exponentiation' ]),
  new Set ([ 'multiplication', 'division', 'reminder' ]),
  new Set ([ 'addition', 'subtraction' ]),
  new Set ([ 'bitwiseLeftShift', 'bitwiseRightShift', 'bitwiseUnsignedRightShift' ]),
  new Set ([ 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual' ]),
  new Set ([ 'equality', 'inequality', 'strictEquality', 'strictInequality' ]),
  new Set ([ 'bitwiseAnd' ]),
  new Set ([ 'bitwiseXor' ]),
  new Set ([ 'bitwiseOr' ]),
  new Set ([ 'logicalAnd' ]),
  new Set ([ 'logicalOr', 'nullishCoalescing' ])
];

const OPERATOR_PRECEDENCE_FORBIDS = {
  'exponentiation': new Set ([ 'logicalNot', 'bitwiseNot', 'plus', 'negation' ]),
  'nullishCoalescing': new Set ([ 'logicalAnd', 'logicalOr' ])
};

/* HELPERS */

//TODO: Implement this way way better, once the new parser is written. Explore using the recursive algorithm MDN mentions, which seems way better for performance also

const collapseBlocks = ( targets: (Node | Token)[], openType: Token['type'], closeType: Token['type'], collapsedType: Node['type'] ): (Node | Token)[] | false => {

  for ( let i = 0; i < targets.length; i++ ) {

    const target = targets[i];

    if ( target.type === openType ) {

      let count = 1;

      for ( let j = i + 1; j < targets.length; j++ ) {

        const other = targets[j];

        if ( other.type === openType ) count++;

        if ( other.type === closeType ) count--;

        if ( !count ) {

          const children = targets.slice ( i + 1, j );
          const node = collapse ( children );

          if ( !node ) return false;

          targets.splice ( i, j - i + 1, { type: collapsedType, children: [node] } );

          break;

        }

      }

      if ( count ) return false;

    }

  }

  return targets;

};

const collapseGroups = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  return collapseBlocks ( targets, 'groupOpen', 'groupClose', 'group' );

};

const collapseAccesses = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  return collapseBlocks ( targets, 'accessOpen', 'accessClose', 'computedProperty' );

};

const collapseIdentifiers = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  for ( let i = 0; i < targets.length; i++ ) {

    const token = targets[i];
    const prev = targets[i - 1];

    if ( token.type === 'identifier' ) {

      if ( IDENTIFIER_FORBIDDEN.has ( token.value ) ) return false;

    } else if ( token.type === 'property' ) {

      if ( !prev || !ACCESSIBLE_TOKENS.has ( prev.type ) ) return false;

      const node: NodeVariableAccess = { type: 'access', children: [prev, token.value] };

      targets.splice ( i - 1, 2, node );

      i--;

    } else if ( token.type === 'computedProperty' ) {

      if ( !prev || !ACCESSIBLE_TOKENS.has ( prev.type ) ) return false;

      const node: NodeVariableAccess = { type: 'access', children: [prev, token.children[0]] };

      targets.splice ( i - 1, 2, node );

      i--;

    }

  }

  return targets;

};

const collapseUnary = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  for ( const group of OPERATOR_PRECENDECE_GROUPS_UNARY ) {

    for ( let i = targets.length - 1; i >= 0; i-- ) {

      const token = targets[i];
      const ntoken = targets[i + 1];

      if ( group.has ( token.type ) ) {

        if ( !ntoken || BINARY_TOKENS.has ( ntoken.type ) ) return false;

        const node = { type: token.type, children: [ntoken] };

        targets.splice ( i, 2, node );

      }

    }

  }

  return targets;

};

const collapseBinaryRTL = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  for ( const group of OPERATOR_PRECENDECE_GROUPS_BINARY_RTL ) {

    for ( let i = targets.length - 1; i >= 0; i-- ) {

      const token = targets[i];

      if ( !token ) continue;

      if ( group.has ( token.type ) ) {

        const prev = targets[i - 1];
        const next = targets[i + 1];

        if ( !prev || !next ) return false;
        if ( BINARY_TOKENS.has ( prev.type ) && !prev.children ) return false;
        if ( BINARY_TOKENS.has ( next.type ) && !next.children ) return false;

        const forbids = OPERATOR_PRECEDENCE_FORBIDS[token.type];

        if ( forbids?.has ( prev.type ) ) return false;

        const node = { ...token, children: [prev, next] }

        targets.splice ( i - 1, 3, node );

        i -= 1;

      }

    }

  }

  return targets;

};

const collapseBinaryLTR = ( targets: (Node | Token)[] ): (Node | Token)[] | false => {

  for ( const group of OPERATOR_PRECENDECE_GROUPS_BINARY_LTR ) {

    for ( let i = 0; i < targets.length; ) {

      const token = targets[i];

      if ( group.has ( token.type ) && BINARY_TOKENS.has ( token.type ) ) {

        const prev = targets[i - 1];
        const next = targets[i + 1];

        if ( !prev || !next ) return false;
        if ( BINARY_TOKENS.has ( prev.type ) && !prev.children ) return false;
        if ( BINARY_TOKENS.has ( next.type ) && !next.children ) return false;

        const forbids = OPERATOR_PRECEDENCE_FORBIDS[token.type];

        if ( forbids?.has ( prev.type ) ) return false;

        const node = { ...token, children: [prev, next] }

        targets.splice ( i - 1, 3, node );

      } else {

        i += 1;

      }

    }

  }

  return targets;

};

const collapse = ( targets: (Node | Token)[] ): Node | false => {

  if ( !collapseGroups ( targets ) ) return false;
  if ( !collapseAccesses ( targets ) ) return false;
  if ( !collapseIdentifiers ( targets ) ) return false;
  if ( !collapseUnary ( targets ) ) return false;
  if ( !collapseBinaryRTL ( targets ) ) return false;
  if ( !collapseBinaryLTR ( targets ) ) return false;

  if ( targets.length !== 1 ) return false;
  if ( !EVALUATORS[targets[0].type] ) return false;

  return targets[0];

};

/* MAIN */

const parse = ( expression: string ): NodeRoot => {

  const node = collapse ( tokenize ( expression ) );

  if ( node ) {

    return { type: 'root', children: [node] };

  } else {

    throw new Error ( `Invalid expression: "${expression}"` );

  }

};

/* EXPORT */

export default parse;
