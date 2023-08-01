
/* IMPORT */

import parse from './parse';
import {hasOwn, isFunction, isString} from './utils';
import type {Context} from './types';
import type {NodeRoot, NodeGroup, NodeIdentifier} from './types';
import type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString} from './types';
import type {NodeMemberCall, NodeMemberAccess, NodeComputedMemberAccess} from './types';
import type {NodeUnaryLogicalNot, NodeUnaryBitwiseNot, NodeUnaryPlus, NodeUnaryNegation} from './types';
import type {NodeBinaryExponentiation, NodeBinaryMultiplication, NodeBinaryDivision, NodeBinaryReminder, NodeBinaryAddition, NodeBinarySubtraction, NodeBinaryBitwiseLeftShift, NodeBinaryBitwiseRightShift, NodeBinaryBitwiseUnsignedRightShift, NodeBinaryLessThan, NodeBinaryLessThanOrEqual, NodeBinaryGreaterThan, NodeBinaryGreaterThanOrEqual, NodeBinaryEquality, NodeBinaryInequality, NodeBinaryStrictEquality, NodeBinaryStrictInequality, NodeBinaryBitwiseAnd, NodeBinaryBitwiseXor, NodeBinaryBitwiseOr, NodeBinaryLogicalAnd, NodeBinaryLogicalOr, NodeBinaryNullishCoalescing} from './types';
import type {Node} from './types';

/* CONSTANTS */

const EVALUATORS = {
  /* ROOT */
  root: ( node: NodeRoot, context: Context ) => evaluate ( node.children[0], context ),
  /* GROUP */
  group: ( node: NodeGroup, context: Context ) => evaluate ( node.children[0], context ),
  /* IDENTIFIER */
  identifier: ( node: NodeIdentifier, context: Context ) => hasOwn ( context, node.value ) ? context[node.value] : undefined,
  /* ACCESS */
  memberCall: ( node: NodeMemberCall, context: Context ) => checkCallable ( evaluate ( node.children[0], context ), context )( ...node.children[1].map ( child => evaluate ( child, context ) ) ),
  memberAccess: ( node: NodeMemberAccess, context: Context ) => evaluate ( node.children[0], context )[node.children[1]],
  computedMemberAccess: ( node: NodeComputedMemberAccess, context: Context ) => evaluate ( node.children[0], context )[evaluate ( node.children[1], context )],
  /* PRIMITIVES */
  true: ( node: NodePrimitiveTrue, context: Context ) => true,
  false: ( node: NodePrimitiveFalse, context: Context ) => false,
  null: ( node: NodePrimitiveNull, context: Context ) => null,
  undefined: ( node: NodePrimitiveUndefined, context: Context ) => undefined,
  bigint: ( node: NodePrimitiveBigInt, context: Context ) => node.value,
  number: ( node: NodePrimitiveNumber, context: Context ) => node.value,
  string: ( node: NodePrimitiveString, context: Context ) => node.value,
  /* UNARY */
  logicalNot: ( node: NodeUnaryLogicalNot, context: Context ) => !evaluate ( node.children[0], context ),
  bitwiseNot: ( node: NodeUnaryBitwiseNot, context: Context ) => ~evaluate ( node.children[0], context ),
  plus: ( node: NodeUnaryPlus, context: Context ) => +evaluate ( node.children[0], context ),
  negation: ( node: NodeUnaryNegation, context: Context ) => -evaluate ( node.children[0], context ),
  /* BINARY */
  exponentiation: ( node: NodeBinaryExponentiation, context: Context ) => evaluate ( node.children[0], context ) ** evaluate ( node.children[1], context ),
  multiplication: ( node: NodeBinaryMultiplication, context: Context ) => evaluate ( node.children[0], context ) * evaluate ( node.children[1], context ),
  division: ( node: NodeBinaryDivision, context: Context ) => evaluate ( node.children[0], context ) / evaluate ( node.children[1], context ),
  reminder: ( node: NodeBinaryReminder, context: Context ) => evaluate ( node.children[0], context ) % evaluate ( node.children[1], context ),
  addition: ( node: NodeBinaryAddition, context: Context ) => evaluate ( node.children[0], context ) + evaluate ( node.children[1], context ),
  subtraction: ( node: NodeBinarySubtraction, context: Context ) => evaluate ( node.children[0], context ) - evaluate ( node.children[1], context ),
  bitwiseLeftShift: ( node: NodeBinaryBitwiseLeftShift, context: Context ) => evaluate ( node.children[0], context ) << evaluate ( node.children[1], context ),
  bitwiseRightShift: ( node: NodeBinaryBitwiseRightShift, context: Context ) => evaluate ( node.children[0], context ) >> evaluate ( node.children[1], context ),
  bitwiseUnsignedRightShift: ( node: NodeBinaryBitwiseUnsignedRightShift, context: Context ) => evaluate ( node.children[0], context ) >>> evaluate ( node.children[1], context ),
  lessThan: ( node: NodeBinaryLessThan, context: Context ) => evaluate ( node.children[0], context ) < evaluate ( node.children[1], context ),
  lessThanOrEqual: ( node: NodeBinaryLessThanOrEqual, context: Context ) => evaluate ( node.children[0], context ) <= evaluate ( node.children[1], context ),
  greaterThan: ( node: NodeBinaryGreaterThan, context: Context ) => evaluate ( node.children[0], context ) > evaluate ( node.children[1], context ),
  greaterThanOrEqual: ( node: NodeBinaryGreaterThanOrEqual, context: Context ) => evaluate ( node.children[0], context ) >= evaluate ( node.children[1], context ),
  equality: ( node: NodeBinaryEquality, context: Context ) => evaluate ( node.children[0], context ) == evaluate ( node.children[1], context ),
  inequality: ( node: NodeBinaryInequality, context: Context ) => evaluate ( node.children[0], context ) != evaluate ( node.children[1], context ),
  strictEquality: ( node: NodeBinaryStrictEquality, context: Context ) => evaluate ( node.children[0], context ) === evaluate ( node.children[1], context ),
  strictInequality: ( node: NodeBinaryStrictInequality, context: Context ) => evaluate ( node.children[0], context ) !== evaluate ( node.children[1], context ),
  bitwiseAnd: ( node: NodeBinaryBitwiseAnd, context: Context ) => evaluate ( node.children[0], context ) & evaluate ( node.children[1], context ),
  bitwiseXor: ( node: NodeBinaryBitwiseXor, context: Context ) => evaluate ( node.children[0], context ) ^ evaluate ( node.children[1], context ),
  bitwiseOr: ( node: NodeBinaryBitwiseOr, context: Context ) => evaluate ( node.children[0], context ) | evaluate ( node.children[1], context ),
  logicalAnd: ( node: NodeBinaryLogicalAnd, context: Context ) => evaluate ( node.children[0], context ) && evaluate ( node.children[1], context ),
  logicalOr: ( node: NodeBinaryLogicalOr, context: Context ) => evaluate ( node.children[0], context ) || evaluate ( node.children[1], context ),
  nullishCoalescing: ( node: NodeBinaryNullishCoalescing, context: Context ) => evaluate ( node.children[0], context ) ?? evaluate ( node.children[1], context )
};

/* HELPERS */

const checkCallable = ( fn: unknown, context: Context ): Function => {

  if ( isFunction ( fn ) ) { //TODO: Maybe optimize this check, it's tricky/sketchy though if the object could be mutated

    for ( const key in context ) {

      if ( context[key] === fn ) return fn;

    }

  }

  throw new Error ( 'Forbidden function call' );

};

const evaluate = ( node: Node, context: Context ): any => {

  const evaluator = EVALUATORS[node.type];

  if ( evaluator ) {

    return evaluator ( node, context );

  } else {

    throw new Error ( `Invalid node type: "${node.type}"` );

  }

};

/* MAIN */

const compile = ( expression: Node | string ): (( context?: Context ) => unknown) => {

  const node = isString ( expression ) ? parse ( expression ).children[0] : expression;

  return ( context: Context = {} ): unknown => {

    return evaluate ( node, context );

  };

};

/* EXPORT */

export default compile;
