
/* IMPORT */

import {grammar} from 'grammex';
import type {ExplicitRule, CompoundHandler} from 'grammex';

import type {NodeRoot} from './types';
import type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString} from './types';
import type {NodeVariableIdentifier, NodeVariableAccess, NodeVariableProperty, NodeVariableComputedProperty} from './types';
import type {NodeUnaryLogicalNot, NodeUnaryBitwiseNot, NodeUnaryPlus, NodeUnaryNegation} from './types';
import type {NodeBinaryExponentiation, NodeBinaryMultiplication, NodeBinaryDivision, NodeBinaryReminder, NodeBinaryAddition, NodeBinarySubtraction, NodeBinaryBitwiseLeftShift, NodeBinaryBitwiseRightShift, NodeBinaryBitwiseUnsignedRightShift, NodeBinaryLessThan, NodeBinaryLessThanOrEqual, NodeBinaryGreaterThan, NodeBinaryGreaterThanOrEqual, NodeBinaryEquality, NodeBinaryInequality, NodeBinaryStrictEquality, NodeBinaryStrictInequality, NodeBinaryBitwiseAnd, NodeBinaryBitwiseXor, NodeBinaryBitwiseOr, NodeBinaryLogicalAnd, NodeBinaryLogicalOr, NodeBinaryNullishCoalescing} from './types';
import type {NodePrimitive, NodeVariable, NodeUnary, NodeBinary, NodeGroupOpen, NodeGroupClose, NodeGroup, Node} from './types';

// const IDENTIFIER_FORBIDDEN = new Set ([ 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'eval', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'package', 'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield' ]);

/* HELPERS */

const uni_operator2type = {
  '!': 'logicalNot',
  '~': 'bitwiseNot',
  '+': 'plus',
  '-': 'negation'
};

const bi_operator2type = {
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

const bi_rtl = {
  '**': true
};

const forbiddens_rtl = {
  '**': new Set ([ 'logicalNot', 'bitwiseNot', 'plus', 'negation' ])
};

const forbiddens_ltr = {
  '??': new Set ([ 'logicalAnd', 'logicalOr' ])
};

const identity = x => x;

/* MAIN */

//TODO: Support optional chaining
//TODO: Support the comma operator
//TODO: Support the ternary operator

const Grammar = grammar<Node, ExplicitRule<NodeRoot>> ( ({ match, optional, star, plus, and, or }) => {

  const op_unary = ( operator: RegExp, next: ExplicitRule<Node> ): ExplicitRule<Node> => {
      return or ([ plus ( and ([ _, plus ([ match ( operator, identity ), _ ]), next ]) ), next], nodes => {
      while ( nodes.length > 1 ) {
        const operand = nodes.pop ();
        const operator = nodes.pop ();
        const type = uni_operator2type[operator];
        const children = [operand];
        const node = { type, children };
        nodes.push ( node );
      }
      return nodes[0];
    });
  };

  const op_binary = ( operator: RegExp, next: ExplicitRule<Node> ): ExplicitRule<Node> => {
    return and ([ next, star ( and ([ _, match ( operator, identity ), _, next ]) ) ], nodes => {
      if ( nodes[1] in bi_rtl ) {
        while ( nodes.length > 1 ) {
          const second = nodes.pop ();
          const operator = nodes.pop ();
          const first = nodes.pop ();
          const type = bi_operator2type[operator];
          const children = [first, second];
          const node = { type, children };
          nodes.push ( node );
        }
      } else {
        while ( nodes.length > 1 ) {
          const first = nodes.shift ();
          const operator = nodes.shift ();
          const second = nodes.shift ();
          const type = bi_operator2type[operator];
          const children = [first, second];
          const node = { type, children };
          nodes.unshift ( node );
        }
      }
      return nodes[0];
    });
  };

  /* EXTRAS */

  const _ = match ( /[ \t]*/ );

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

  const Group = and ( ['(', () => Value, ')' ], ( nodes ): NodeGroup => ({ type: 'group', children: [nodes[0]] }) );

  /* VARIABLE */

  const VariableIdentifier = match ( /(?!(?:break|case|catch|class|const|continue|debugger|default|delete|do|eval|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)(?!\w))[a-zA-Z$_][a-zA-Z0-9$_]*/, ( _ ): NodeVariableIdentifier => ({ type: 'identifier', value: _ }) );

  /* PRIMARY */

  const Primary = or ([ Group, Primitive, VariableIdentifier ]);

  /* ACCESS */

  const VariableMemberAccess = match ( /\.([a-zA-Z$_][a-zA-Z0-9$_]*)/, ( _, value ) => ({ type: 'memberAccess', children: [value] }) );
  const VariableComputedMemberAccess = and ( ['[', _, () => Value, _, ']'], ( nodes ) => ({ type: 'computedMemberAccess', children: [nodes[0]] }) );

  const VariableAccess = and ( [Primary, star ( and ([ _, or ([ VariableMemberAccess, VariableComputedMemberAccess ]) ]) )], ( nodes ): NodeVariableAccess => {
    while ( nodes.length > 1 ) {
      const first = nodes.shift ();
      const second = nodes.shift ();
      const access: NodeVariableAccess = { type: 'access', children: [first, second.children[0]] }
      nodes.unshift ( access );
    }
    return nodes[0];
  });

  /* BINARY */

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table
  // Op18 grouping
  // Op17 member access, computed member access
  const Op14 = op_unary ( /!|~|\+(?!\+)|-(?!\-)/, VariableAccess );
  const Op13 = op_binary ( /\*\*/, Op14 );
  const Op12 = op_binary ( /\*|\/|%/, Op13 );
  const Op11 = op_binary ( /\+(?!\+)|-(?!\-)/, Op12 );
  const Op10 = op_binary ( /<<|>>>|>>/, Op11 );
  const Op9 = op_binary ( /<=|<|>=|>/, Op10 );
  const Op8 = op_binary ( /===|==|!==|!=/, Op9 );
  const Op7 = op_binary ( /&/, Op8 );
  const Op6 = op_binary ( /\^/, Op7 );
  const Op5 = op_binary ( /\|/, Op6 );
  const Op4 = op_binary ( /&&/, Op5 );
  const Op3 = op_binary ( /\|\||\?\?/, Op4 );

  /* MAIN */

  const Value = and ([ _, Op3, _ ]);
  const Root = and ( [Value], ( nodes ): NodeRoot => ({ type: 'root', children: [nodes[0]] }) );

  return Root;

});

/* EXPORT */

export default Grammar;
