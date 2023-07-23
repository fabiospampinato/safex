
/* CONTEXT */

type Context = Record<string, unknown>;

/* NODES */

type NodeRoot = { type: 'root', children: [Node] };

type NodePrimitiveTrue = { type: 'true' };
type NodePrimitiveFalse = { type: 'false' };
type NodePrimitiveNull = { type: 'null' };
type NodePrimitiveUndefined = { type: 'undefined' };
type NodePrimitiveBigInt = { type: 'bigint', value: bigint };
type NodePrimitiveNumber = { type: 'number', value: number };
type NodePrimitiveString = { type: 'string', value: string };

type NodeVariableIdentifier = { type: 'identifier', value: string };
type NodeVariableAccess = { type: 'access', children: [Node, Node | string] };
type NodeVariableProperty = { type: 'property', value: string };
type NodeVariableComputedProperty = { type: 'computedProperty', children: [Node] };

type NodeUnaryLogicalNot = { type: 'logicalNot', children: [Node] };
type NodeUnaryBitwiseNot = { type: 'bitwiseNot', children: [Node] };
type NodeUnaryPlus = { type: 'plus', children: [Node] };
type NodeUnaryNegation = { type: 'negation', children: [Node] };
type NodeUnaryDecrement = { type: 'decrement', children: [Node] };
type NodeUnaryIncrement = { type: 'increment', children: [Node] };

type NodeBinaryExponentiation = { type: 'exponentiation', children: [Node, Node] };
type NodeBinaryMultiplication = { type: 'multiplication', children: [Node, Node] };
type NodeBinaryDivision = { type: 'division', children: [Node, Node] };
type NodeBinaryReminder = { type: 'reminder', children: [Node, Node] };
type NodeBinaryAddition = { type: 'addition', children: [Node, Node] };
type NodeBinarySubtraction = { type: 'subtraction', children: [Node, Node] };
type NodeBinaryBitwiseLeftShift = { type: 'bitwiseLeftShift', children: [Node, Node] };
type NodeBinaryBitwiseRightShift = { type: 'bitwiseRightShift', children: [Node, Node] };
type NodeBinaryBitwiseUnsignedRightShift = { type: 'bitwiseUnsignedRightShift', children: [Node, Node] };
type NodeBinaryLessThan = { type: 'lessThan', children: [Node, Node] };
type NodeBinaryLessThanOrEqual = { type: 'lessThanOrEqual', children: [Node, Node] };
type NodeBinaryGreaterThan = { type: 'greaterThan', children: [Node, Node] };
type NodeBinaryGreaterThanOrEqual = { type: 'greaterThanOrEqual', children: [Node, Node] };
type NodeBinaryEquality = { type: 'equality', children: [Node, Node] };
type NodeBinaryInequality = { type: 'inequality', children: [Node, Node] };
type NodeBinaryStrictEquality = { type: 'strictEquality', children: [Node, Node] };
type NodeBinaryStrictInequality = { type: 'strictInequality', children: [Node, Node] };
type NodeBinaryBitwiseAnd = { type: 'bitwiseAnd', children: [Node, Node] };
type NodeBinaryBitwiseXor = { type: 'bitwiseXor', children: [Node, Node] };
type NodeBinaryBitwiseOr = { type: 'bitwiseOr', children: [Node, Node] };
type NodeBinaryLogicalAnd = { type: 'logicalAnd', children: [Node, Node] };
type NodeBinaryLogicalOr = { type: 'logicalOr', children: [Node, Node] };
type NodeBinaryNullishCoalescing = { type: 'nullishCoalescing', children: [Node, Node] };

type NodeGroup = { type: 'group', children: [Node] };

type NodePrimitive = NodePrimitiveTrue | NodePrimitiveFalse | NodePrimitiveNull | NodePrimitiveUndefined | NodePrimitiveBigInt | NodePrimitiveNumber | NodePrimitiveString;
type NodeVariable = NodeVariableIdentifier | NodeVariableAccess | NodeVariableProperty | NodeVariableComputedProperty;
type NodeUnary = NodeUnaryLogicalNot | NodeUnaryBitwiseNot | NodeUnaryPlus | NodeUnaryNegation | NodeUnaryDecrement | NodeUnaryIncrement;
type NodeBinary = NodeBinaryExponentiation | NodeBinaryMultiplication | NodeBinaryDivision | NodeBinaryReminder | NodeBinaryAddition | NodeBinarySubtraction | NodeBinaryBitwiseLeftShift | NodeBinaryBitwiseRightShift | NodeBinaryBitwiseUnsignedRightShift | NodeBinaryLessThan | NodeBinaryLessThanOrEqual | NodeBinaryGreaterThan | NodeBinaryGreaterThanOrEqual | NodeBinaryEquality | NodeBinaryInequality | NodeBinaryStrictEquality | NodeBinaryStrictInequality | NodeBinaryBitwiseAnd | NodeBinaryBitwiseXor | NodeBinaryBitwiseOr | NodeBinaryLogicalAnd | NodeBinaryLogicalOr | NodeBinaryNullishCoalescing;
type Node = NodePrimitive | NodeVariable | NodeUnary | NodeBinary | NodeGroup;

/* TOKENS */

type TokenPrimitiveTrue = { type: 'true' };
type TokenPrimitiveFalse = { type: 'false' };
type TokenPrimitiveNull = { type: 'null' };
type TokenPrimitiveUndefined = { type: 'undefined' };
type TokenPrimitiveBigInt = { type: 'bigint', value: bigint };
type TokenPrimitiveNumber = { type: 'number', value: number };
type TokenPrimitiveString = { type: 'string', value: string };

type TokenVariableIdentifier = { type: 'identifier', value: string };
type TokenVariableAccessOpen = { type: 'accessOpen' };
type TokenVariableAccessClose = { type: 'accessClose' };
type TokenVariableProperty = { type: 'property', value: string };
type TokenVariableComputedProperty = { type: 'computedProperty', value: string };

type TokenUnaryLogicalNot = { type: 'logicalNot' };
type TokenUnaryBitwiseNot = { type: 'bitwiseNot' };
type TokenUnaryPlus = { type: 'plus' };
type TokenUnaryNegation = { type: 'negation' };
type TokenUnaryDencrement = { type: 'decrement' };
type TokenUnaryIncrement = { type: 'increment' };

type TokenBinaryExponentiation = { type: 'exponentiation' };
type TokenBinaryMultiplication = { type: 'multiplication' };
type TokenBinaryDivision = { type: 'division' };
type TokenBinaryReminder = { type: 'reminder' };
type TokenBinaryAddition = { type: 'addition' };
type TokenBinarySubtraction = { type: 'subtraction' };
type TokenBinaryBitwiseLeftShift = { type: 'bitwiseLeftShift' };
type TokenBinaryBitwiseRightShift = { type: 'bitwiseRightShift' };
type TokenBinaryBitwiseUnsignedRightShift = { type: 'bitwiseUnsignedRightShift' };
type TokenBinaryLessThan = { type: 'lessThan' };
type TokenBinaryLessThanOrEqual = { type: 'lessThanOrEqual' };
type TokenBinaryGreaterThan = { type: 'greaterThan' };
type TokenBinaryGreaterThanOrEqual = { type: 'greaterThanOrEqual' };
type TokenBinaryEquality = { type: 'equality' };
type TokenBinaryInequality = { type: 'inequality' };
type TokenBinaryStrictEquality = { type: 'strictEquality' };
type TokenBinaryStrictInequality = { type: 'strictInequality' };
type TokenBinaryBitwiseAnd = { type: 'bitwiseAnd' };
type TokenBinaryBitwiseXor = { type: 'bitwiseXor' };
type TokenBinaryBitwiseOr = { type: 'bitwiseOr' };
type TokenBinaryLogicalAnd = { type: 'logicalAnd' };
type TokenBinaryLogicalOr = { type: 'logicalOr' };
type TokenBinaryNullishCoalescing = { type: 'nullishCoalescing' };

type TokenGroupOpen = { type: 'groupOpen' };
type TokenGroupClose = { type: 'groupClose' };

type TokenPrimitive = TokenPrimitiveTrue | TokenPrimitiveFalse | TokenPrimitiveNull | TokenPrimitiveUndefined | TokenPrimitiveBigInt | TokenPrimitiveNumber | TokenPrimitiveString;
type TokenVariable = TokenVariableIdentifier | TokenVariableAccessOpen | TokenVariableAccessClose | TokenVariableProperty | TokenVariableComputedProperty;
type TokenUnary = TokenUnaryLogicalNot | TokenUnaryBitwiseNot | TokenUnaryPlus | TokenUnaryNegation | TokenUnaryDencrement | TokenUnaryIncrement;
type TokenBinary = TokenBinaryExponentiation | TokenBinaryMultiplication | TokenBinaryDivision | TokenBinaryReminder | TokenBinaryAddition | TokenBinarySubtraction | TokenBinaryBitwiseLeftShift | TokenBinaryBitwiseRightShift | TokenBinaryBitwiseUnsignedRightShift | TokenBinaryLessThan | TokenBinaryLessThanOrEqual | TokenBinaryGreaterThan | TokenBinaryGreaterThanOrEqual | TokenBinaryEquality | TokenBinaryInequality | TokenBinaryStrictEquality | TokenBinaryStrictInequality | TokenBinaryBitwiseAnd | TokenBinaryBitwiseXor | TokenBinaryBitwiseOr | TokenBinaryLogicalAnd | TokenBinaryLogicalOr | TokenBinaryNullishCoalescing;
type TokenGroup = TokenGroupOpen | TokenGroupClose;
type Token = TokenPrimitive | TokenVariable | TokenUnary | TokenBinary | TokenGroup;

/* EXPORT */

export type {Context};

export type {NodeRoot};
export type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString};
export type {NodeVariableIdentifier, NodeVariableAccess, NodeVariableProperty, NodeVariableComputedProperty};
export type {NodeUnaryLogicalNot, NodeUnaryBitwiseNot, NodeUnaryPlus, NodeUnaryNegation, NodeUnaryDecrement, NodeUnaryIncrement};
export type {NodeBinaryExponentiation, NodeBinaryMultiplication, NodeBinaryDivision, NodeBinaryReminder, NodeBinaryAddition, NodeBinarySubtraction, NodeBinaryBitwiseLeftShift, NodeBinaryBitwiseRightShift, NodeBinaryBitwiseUnsignedRightShift, NodeBinaryLessThan, NodeBinaryLessThanOrEqual, NodeBinaryGreaterThan, NodeBinaryGreaterThanOrEqual, NodeBinaryEquality, NodeBinaryInequality, NodeBinaryStrictEquality, NodeBinaryStrictInequality, NodeBinaryBitwiseAnd, NodeBinaryBitwiseXor, NodeBinaryBitwiseOr, NodeBinaryLogicalAnd, NodeBinaryLogicalOr, NodeBinaryNullishCoalescing};
export type {NodePrimitive, NodeVariable, NodeUnary, NodeBinary, NodeGroup, Node};

export type {TokenPrimitiveTrue, TokenPrimitiveFalse, TokenPrimitiveNull, TokenPrimitiveUndefined, TokenPrimitiveBigInt, TokenPrimitiveNumber, TokenPrimitiveString};
export type {TokenVariableIdentifier, TokenVariableAccessOpen, TokenVariableAccessClose, TokenVariableProperty};
export type {TokenUnaryLogicalNot, TokenUnaryBitwiseNot, TokenUnaryPlus, TokenUnaryNegation, TokenUnaryDencrement, TokenUnaryIncrement};
export type {TokenBinaryExponentiation, TokenBinaryMultiplication, TokenBinaryDivision, TokenBinaryReminder, TokenBinaryAddition, TokenBinarySubtraction, TokenBinaryBitwiseLeftShift, TokenBinaryBitwiseRightShift, TokenBinaryBitwiseUnsignedRightShift, TokenBinaryLessThan, TokenBinaryLessThanOrEqual, TokenBinaryGreaterThan, TokenBinaryGreaterThanOrEqual, TokenBinaryEquality, TokenBinaryInequality, TokenBinaryStrictEquality, TokenBinaryStrictInequality, TokenBinaryBitwiseAnd, TokenBinaryBitwiseXor, TokenBinaryBitwiseOr, TokenBinaryLogicalAnd, TokenBinaryLogicalOr, TokenBinaryNullishCoalescing};
export type {TokenGroupOpen, TokenGroupClose};
export type {TokenPrimitive, TokenVariable, TokenUnary, TokenBinary, TokenGroup, Token};
