
/* IMPORT */

import {grammar} from 'grammex';
import type {ExplicitRule} from 'grammex';
import type {NodeRoot, NodeGroup, NodeIdentifier, NodeOperator} from './types';
import type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString} from './types';
import type {NodeMemberCaller, NodeMemberAccessor, NodeComputedMemberAccessor} from './types';
import type {NodeUnary, NodeBinary} from './types';
import type {Node} from './types';

/* MAIN */

//TODO: Support optional chaining
//TODO: Support the comma operator
//TODO: Support the ternary operator

const Grammar = grammar<Node, ExplicitRule<NodeRoot>> ( ({ match, optional, star, and, or }) => {

  /* CONSTANTS */

  const UNARY_OPERATOR_TO_TYPE: Record<string, NodeUnary['type']> = {
    '!': 'logicalNot',
    '~': 'bitwiseNot',
    '+': 'plus',
    '-': 'negation'
  };

  const BINARY_OPERATOR_TO_TYPE: Record<string, NodeBinary['type']> = {
    '**': 'exponentiation',
    '*': 'multiplication',
    '/': 'division',
    '%': 'reminder',
    '+': 'addition',
    '-': 'subtraction',
    '<<': 'bitwiseLeftShift',
    '>>': 'bitwiseRightShift',
    '>>>': 'bitwiseUnsignedRightShift',
    '<': 'lessThan',
    '<=': 'lessThanOrEqual',
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqual',
    '==': 'equality',
    '!=': 'inequality',
    '===': 'strictEquality',
    '!==': 'strictInequality',
    '&': 'bitwiseAnd',
    '^': 'bitwiseXor',
    '|': 'bitwiseOr',
    '&&': 'logicalAnd',
    '||': 'logicalOr',
    '??': 'nullishCoalescing'
  };

  const BINARY_OPERATOR_FORBIDDEN_OPERATORS_LEFT = {
    '**': new Set ([ 'logicalNot', 'bitwiseNot', 'plus', 'negation' ]),
  };

  const BINARY_OPERATOR_FORBIDDEN_OPERATORS_LEFT_RIGHT = {
    '??': new Set ([ 'logicalAnd', 'logicalOr' ]),
    '||': new Set ([ 'nullishCoalescing' ]),
    '&&': new Set ([ 'nullishCoalescing' ])
  };

  /* HELPERS */

  function collapse ( nodes: Node[], ltr: boolean, take: 1, handler: ( n0: Node, n1: Node ) => Node ): Node;
  function collapse ( nodes: Node[], ltr: boolean, take: 2, handler: ( n0: Node, n1: Node, n2: Node ) => Node ): Node;
  function collapse ( nodes: Node[], ltr: boolean, take: 1 | 2, handler: (( n0: Node, n1: Node ) => Node) | (( n0: Node, n1: Node, n2: Node ) => Node) ): Node {
    if ( nodes.length < 2 ) return nodes[0];
    if ( ltr ) {
      let current = nodes[0];
      for ( let i = 1, l = nodes.length; i < l; i += take ) {
        const one = nodes[i];
        const two = nodes[i + 1];
        current = handler ( current, one, two );
      }
      return current;
    } else {
      let current = nodes[nodes.length - 1];
      for ( let i = nodes.length - 2; i >= 0; i -= take ) {
        const one = nodes[i];
        const two = nodes[i - 1];
        current = handler ( current, one, two );
      }
      return current;
    }
  };

  const is = <T extends Node> ( node: Node | undefined, type: string ): node is T => {
    return ( node?.type === type );
  };

  const whitespaced = ( rule: ExplicitRule<Node> ): ExplicitRule<Node> => {
    return and ([ _, rule, _ ]);
  };

  const op = ( operator: RegExp ): ExplicitRule<Node> => {
    return whitespaced ( match ( operator, ( value ): NodeOperator => ({ type: 'operator', value }) ) );
  };

  const unary = ( operator: RegExp, next: ExplicitRule<Node> ): ExplicitRule<Node> => {
    return and ([ star ( op ( operator ) ), next], nodes => {
      return collapse ( nodes, false, 1, ( n0, n1 ) => {
        if ( !is<NodeOperator> ( n1, 'operator' ) ) throw new Error ( 'Failed to parse' );
        const type = UNARY_OPERATOR_TO_TYPE[n1.value];
        return { type, children: [n0] };
      });
    });
  };

  const binary = ( operator: RegExp, next: ExplicitRule<Node>, ltr: boolean = true ): ExplicitRule<Node> => {
    return and ([ next, star ( and ([ op ( operator ), next ]) ) ], nodes => {
      return collapse ( nodes, ltr, 2, ( n0, n1, n2 ) => {
        if ( !is<NodeOperator> ( n1, 'operator' ) ) throw new Error ( 'Failed to parse' );
        const type = BINARY_OPERATOR_TO_TYPE[n1.value];
        const forbiddenLeft = BINARY_OPERATOR_FORBIDDEN_OPERATORS_LEFT[n1.value];
        const forbiddenLeftRight = BINARY_OPERATOR_FORBIDDEN_OPERATORS_LEFT_RIGHT[n1.value];
        if ( forbiddenLeft?.has ( ltr ? n0.type : n2.type ) ) throw new Error ( 'Failed to parse' );
        if ( forbiddenLeftRight?.has ( n0.type ) || forbiddenLeftRight?.has ( n2.type ) ) throw new Error ( 'Failed to parse' );
        return { type, children: ltr ? [n0, n2] : [n2, n0] };
      });
    });
  };

  const access = ( next: ExplicitRule<Node> ): ExplicitRule<Node> => {
    return and ( [next, star ( and ([ _, or ([ MemberAccessor, ComputedMemberAccessor, MemberCall ]) ]) )], ( nodes ): Node => {
      return collapse ( nodes, true, 1, ( n0, n1 ) => {
        if ( is<NodeMemberAccessor> ( n1, 'memberAccessor' ) ) {
          return { type: 'memberAccess', children: [n0, n1.value] };
        } else if ( is<NodeComputedMemberAccessor> ( n1, 'computedMemberAccessor' ) ) {
          return { type: 'computedMemberAccess', children: [n0, n1.children[0]] };
        } else if ( is<NodeMemberCaller> ( n1, 'memberCaller' ) ) {
          return { type: 'memberCall', children: [n0, n1.children] };
        } else {
          throw new Error ( 'Failed to parse' );
        }
      });
    });
  };

  /* WHITESPACE */

  const _ = match ([ ' ', '\t' ]);

  /* IDENTIFIER */

  const Identifier = match ( /(?!(?:break|case|catch|class|const|continue|debugger|default|delete|do|eval|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)(?!\w))[a-zA-Z$_][a-zA-Z0-9$_]*/, ( _ ): NodeIdentifier => ({ type: 'identifier', value: _ }) );

  /* PRIMITIVES */

  const PrimitiveTrue = match ( /true(?!\w)/, (): NodePrimitiveTrue => ({ type: 'true' }) );
  const PrimitiveFalse = match ( /false(?!\w)/, (): NodePrimitiveFalse => ({ type: 'false' }) );

  const PrimitiveNull = match ( /null(?!\w)/, (): NodePrimitiveNull => ({ type: 'null' }) );
  const PrimitiveUndefined = match ( /undefined(?!\w)/, (): NodePrimitiveUndefined => ({ type: 'undefined' }) );

  const PrimitiveBigInt = match ( /(0|[1-9]\d*)n/, ( _, value ): NodePrimitiveBigInt => ({ type: 'bigint', value: BigInt ( value ) }) );
  const PrimitiveNumber = match ( /(?:(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE]-?\d+)?|\.\d+(?:[eE]-?\d+)?)/, ( _ ): NodePrimitiveNumber => ({ type: 'number', value: Number ( _ ) }) );

  const PrimitiveStringSingle = match ( /'((?:[^'\\\r\n]|\\[^])*)'/, ( _, value ): NodePrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );
  const PrimitiveStringDouple = match ( /"((?:[^"\\\r\n]|\\[^])*)"/, ( _, value ): NodePrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );
  const PrimitiveStringBacktick = match ( /`((?:[^`\\]|\\[^])*)`/, ( _, value ): NodePrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );

  const Primitive = or ([ PrimitiveTrue, PrimitiveFalse, PrimitiveNull, PrimitiveUndefined, PrimitiveBigInt, PrimitiveNumber, PrimitiveStringSingle, PrimitiveStringDouple, PrimitiveStringBacktick ]);

  /* GROUP */

  const Group = and ( ['(', () => Expression, ')' ], ( nodes ): NodeGroup => ({ type: 'group', children: [nodes[0]] }) );

  /* PRIMARY */

  const Primary = or ([ Group, Primitive, Identifier ]);

  /* ACCESS */

  const MemberCall = and ( ['(', _, optional ([ () => Expression, star ([ ',', () => Expression ]) ]), ')'], ( nodes ): NodeMemberCaller => ({ type: 'memberCaller', children: nodes }) );
  const MemberAccessor = match ( /\.([a-zA-Z$_][a-zA-Z0-9$_]*)/, ( _, value ): NodeMemberAccessor => ({ type: 'memberAccessor', value }) );
  const ComputedMemberAccessor = and ( ['[', () => Expression, ']'], ( nodes ): NodeComputedMemberAccessor => ({ type: 'computedMemberAccessor', children: [nodes[0]] }) );
  const Access = access ( Primary );

  /* OPERATORS */

  // Operator precedence: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table

  const Op14 = unary ( /!|~|\+(?!\+)|-(?!-)/, Access );
  const Op13 = binary ( /\*\*/, Op14, false );
  const Op12 = binary ( /\*|\/|%/, Op13 );
  const Op11 = binary ( /\+(?!\+)|-(?!-)/, Op12 );
  const Op10 = binary ( /<<|>>>|>>/, Op11 );
  const Op9 = binary ( /<=|<|>=|>/, Op10 );
  const Op8 = binary ( /===|==|!==|!=/, Op9 );
  const Op7 = binary ( /&/, Op8 );
  const Op6 = binary ( /\^/, Op7 );
  const Op5 = binary ( /\|/, Op6 );
  const Op4 = binary ( /&&/, Op5 );
  const Op3 = binary ( /\|\||\?\?/, Op4 );

  /* EXPRESSION */

  const Expression = whitespaced ( Op3 );

  /* ROOT */

  const Root = and ( [Expression], ( nodes ): NodeRoot => ({ type: 'root', children: [nodes[0]] }) );

  return Root;

});

/* EXPORT */

export default Grammar;
