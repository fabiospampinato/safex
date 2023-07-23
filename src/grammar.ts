
/* IMPORT */

import {match, or, star} from 'grammex';
import type {TokenPrimitiveTrue, TokenPrimitiveFalse, TokenPrimitiveNull, TokenPrimitiveUndefined, TokenPrimitiveBigInt, TokenPrimitiveNumber, TokenPrimitiveString} from './types';
import type {TokenVariableIdentifier, TokenVariableAccessOpen, TokenVariableAccessClose, TokenVariableProperty} from './types';
import type {TokenUnaryLogicalNot, TokenUnaryBitwiseNot, TokenUnaryPlus, TokenUnaryNegation, TokenUnaryDencrement, TokenUnaryIncrement} from './types';
import type {TokenBinaryExponentiation, TokenBinaryMultiplication, TokenBinaryDivision, TokenBinaryReminder, TokenBinaryAddition, TokenBinarySubtraction, TokenBinaryBitwiseLeftShift, TokenBinaryBitwiseRightShift, TokenBinaryBitwiseUnsignedRightShift, TokenBinaryLessThan, TokenBinaryLessThanOrEqual, TokenBinaryGreaterThan, TokenBinaryGreaterThanOrEqual, TokenBinaryEquality, TokenBinaryInequality, TokenBinaryStrictEquality, TokenBinaryStrictInequality, TokenBinaryBitwiseAnd, TokenBinaryBitwiseXor, TokenBinaryBitwiseOr, TokenBinaryLogicalAnd, TokenBinaryLogicalOr, TokenBinaryNullishCoalescing} from './types';
import type {TokenGroupOpen, TokenGroupClose} from './types';

/* EXTRAS */

const Whitespace = match ( /[ \t]+/ );

/* PRIMITIVES */

const PrimitiveTrue = match ( /true(?!\w)/, (): TokenPrimitiveTrue => ({ type: 'true' }) );
const PrimitiveFalse = match ( /false(?!\w)/, (): TokenPrimitiveFalse => ({ type: 'false' }) );

const PrimitiveNull = match ( /null(?!\w)/, (): TokenPrimitiveNull => ({ type: 'null' }) );
const PrimitiveUndefined = match ( /undefined(?!\w)/, (): TokenPrimitiveUndefined => ({ type: 'undefined' }) );

const PrimitiveBigInt = match ( /(0|[1-9]\d*)n/, ( _, value ): TokenPrimitiveBigInt => ({ type: 'bigint', value: BigInt ( value ) }) );
const PrimitiveNumber = match ( /(?:(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE]-?\d+)?|\.\d+(?:[eE]-?\d+)?)/, ( _ ): TokenPrimitiveNumber => ({ type: 'number', value: Number ( _ ) }) );

const PrimitiveStringSingle = match ( /'((?:[^'\\\r\n]|\\[^])*)'/, ( _, value ): TokenPrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );
const PrimitiveStringDouple = match ( /"((?:[^"\\\r\n]|\\[^])*)"/, ( _, value ): TokenPrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );
const PrimitiveStringBacktick = match ( /`((?:[^`\\]|\\[^])*)`/, ( _, value ): TokenPrimitiveString => ({ type: 'string', value: value.replace ( /\\([^])/g, '$1' ) }) );

/* VARIABLE */

const VariableIdentifier = match ( /[a-zA-Z$_][a-zA-Z0-9$_]*/, ( _ ): TokenVariableIdentifier => ({ type: 'identifier', value: _ }) );
const VariableAccessOpen = match ( '[', (): TokenVariableAccessOpen => ({ type: 'accessOpen' }) );
const VariableAccessClose = match ( ']', (): TokenVariableAccessClose => ({ type: 'accessClose' }) );
const VariableProperty = match ( /\.([a-zA-Z$_][a-zA-Z0-9$_]*)/, ( _, value ): TokenVariableProperty => ({ type: 'property', value }) );

/* UNARY */

const UnaryLogicalNot = match ( '!', (): TokenUnaryLogicalNot => ({ type: 'logicalNot' }) );
const UnaryBitwiseNot = match ( '~', (): TokenUnaryBitwiseNot => ({ type: 'bitwiseNot' }) );
const UnaryPlus = match ( '+', (): TokenUnaryPlus => ({ type: 'plus' }) );
const UnaryNegation = match ( '-', (): TokenUnaryNegation => ({ type: 'negation' }) );
const UnaryDecrement = match ( '++', (): TokenUnaryDencrement => ({ type: 'decrement' }) );
const UnaryIncrement = match ( '--', (): TokenUnaryIncrement => ({ type: 'increment' }) );

/* BINARY */

const BinaryExponentiation = match ( '**', (): TokenBinaryExponentiation => ({ type: 'exponentiation' }) );
const BinaryMultiplication = match ( '*', (): TokenBinaryMultiplication => ({ type: 'multiplication' }) );
const BinaryDivision = match ( '/', (): TokenBinaryDivision => ({ type: 'division' }) );
const BinaryReminder = match ( '%', (): TokenBinaryReminder => ({ type: 'reminder' }) );
const BinaryAddition = match ( '+', (): TokenBinaryAddition => ({ type: 'addition' }) );
const BinarySubtraction = match ( '-', (): TokenBinarySubtraction => ({ type: 'subtraction' }) );
const BinaryBitwiseLeftShift = match ( '<<', (): TokenBinaryBitwiseLeftShift => ({ type: 'bitwiseLeftShift' }) );
const BinaryBitwiseRightShift = match ( '>>', (): TokenBinaryBitwiseRightShift => ({ type: 'bitwiseRightShift' }) );
const BinaryBitwiseUnsignedRightShift = match ( '>>>', (): TokenBinaryBitwiseUnsignedRightShift => ({ type: 'bitwiseUnsignedRightShift' }) );
const BinaryLessThan = match ( '<', (): TokenBinaryLessThan => ({ type: 'lessThan' }) );
const BinaryLessThanOrEqual = match ( '<=', (): TokenBinaryLessThanOrEqual => ({ type: 'lessThanOrEqual' }) );
const BinaryGreaterThan = match ( '>', (): TokenBinaryGreaterThan => ({ type: 'greaterThan' }) );
const BinaryGreaterThanOrEqual = match ( '>=', (): TokenBinaryGreaterThanOrEqual => ({ type: 'greaterThanOrEqual' }) );
const BinaryEquality = match ( '==', (): TokenBinaryEquality => ({ type: 'equality' }) );
const BinaryInequality = match ( '!=', (): TokenBinaryInequality => ({ type: 'inequality' }) );
const BinaryStrictEquality = match ( '===', (): TokenBinaryStrictEquality => ({ type: 'strictEquality' }) );
const BinaryStrictInequality = match ( '!==', (): TokenBinaryStrictInequality => ({ type: 'strictInequality' }) );
const BinaryBitwiseAnd = match ( '&', (): TokenBinaryBitwiseAnd => ({ type: 'bitwiseAnd' }) );
const BinaryBitwiseXor = match ( '^', (): TokenBinaryBitwiseXor => ({ type: 'bitwiseXor' }) );
const BinaryBitwiseOr = match ( '|', (): TokenBinaryBitwiseOr => ({ type: 'bitwiseOr' }) );
const BinaryLogicalAnd = match ( '&&', (): TokenBinaryLogicalAnd => ({ type: 'logicalAnd' }) );
const BinaryLogicalOr = match ( '||', (): TokenBinaryLogicalOr => ({ type: 'logicalOr' }) );
const BinaryNullishCoalescing = match ( '??', (): TokenBinaryNullishCoalescing => ({ type: 'nullishCoalescing' }) );

/* GROUP */

const GroupOpen = match ( '(', (): TokenGroupOpen => ({ type: 'groupOpen' }) );
const GroupClose = match ( ')', (): TokenGroupClose => ({ type: 'groupClose' }) );

/* MAIN */

//FIXME: The type `or<any, unknown>` is wrong
//TODO: Implement this better, checking for validity properly, but we need proper backtracking in the parser for that
//TODO: Support optional chaining
//TODO: Support the comma operator
//TODO: Support the ternary operator

const Grammar = star ( or<any, unknown> ([ Whitespace, PrimitiveTrue, PrimitiveFalse, PrimitiveNull, PrimitiveUndefined, VariableIdentifier, PrimitiveBigInt, PrimitiveNumber, PrimitiveStringSingle, PrimitiveStringDouple, PrimitiveStringBacktick, VariableProperty, GroupOpen, GroupClose, VariableAccessOpen, VariableAccessClose, UnaryDecrement, UnaryIncrement, BinaryExponentiation, BinaryMultiplication, BinaryDivision, BinaryReminder, BinaryAddition, BinarySubtraction, BinaryBitwiseLeftShift, BinaryBitwiseUnsignedRightShift, BinaryBitwiseRightShift, BinaryLessThanOrEqual, BinaryLessThan, BinaryGreaterThanOrEqual, BinaryGreaterThan, BinaryStrictEquality, BinaryStrictInequality, BinaryEquality, BinaryInequality, BinaryLogicalAnd, BinaryLogicalOr, BinaryBitwiseAnd, BinaryBitwiseXor, BinaryBitwiseOr, BinaryNullishCoalescing, UnaryLogicalNot, UnaryBitwiseNot, UnaryPlus, UnaryNegation ]) );

/* EXPORT */

export default Grammar;
