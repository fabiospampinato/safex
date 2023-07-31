
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

type NodeGroupOpen = { type: 'groupOpen' };
type NodeGroupClose = { type: 'groupClose' };
type NodeGroup = { type: 'group', children: [Node] };

type NodePrimitive = NodePrimitiveTrue | NodePrimitiveFalse | NodePrimitiveNull | NodePrimitiveUndefined | NodePrimitiveBigInt | NodePrimitiveNumber | NodePrimitiveString;
type NodeVariable = NodeVariableIdentifier | NodeVariableAccess | NodeVariableProperty | NodeVariableComputedProperty;
type NodeUnary = NodeUnaryLogicalNot | NodeUnaryBitwiseNot | NodeUnaryPlus | NodeUnaryNegation;
type NodeBinary = NodeBinaryExponentiation | NodeBinaryMultiplication | NodeBinaryDivision | NodeBinaryReminder | NodeBinaryAddition | NodeBinarySubtraction | NodeBinaryBitwiseLeftShift | NodeBinaryBitwiseRightShift | NodeBinaryBitwiseUnsignedRightShift | NodeBinaryLessThan | NodeBinaryLessThanOrEqual | NodeBinaryGreaterThan | NodeBinaryGreaterThanOrEqual | NodeBinaryEquality | NodeBinaryInequality | NodeBinaryStrictEquality | NodeBinaryStrictInequality | NodeBinaryBitwiseAnd | NodeBinaryBitwiseXor | NodeBinaryBitwiseOr | NodeBinaryLogicalAnd | NodeBinaryLogicalOr | NodeBinaryNullishCoalescing;
type Node = NodeRoot | NodePrimitive | NodeVariable | NodeUnary | NodeBinary | NodeGroupOpen | NodeGroupClose | NodeGroup;

/* EXPORT */

export type {Context};

export type {NodeRoot};
export type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString};
export type {NodeVariableIdentifier, NodeVariableAccess, NodeVariableProperty, NodeVariableComputedProperty};
export type {NodeUnaryLogicalNot, NodeUnaryBitwiseNot, NodeUnaryPlus, NodeUnaryNegation};
export type {NodeBinaryExponentiation, NodeBinaryMultiplication, NodeBinaryDivision, NodeBinaryReminder, NodeBinaryAddition, NodeBinarySubtraction, NodeBinaryBitwiseLeftShift, NodeBinaryBitwiseRightShift, NodeBinaryBitwiseUnsignedRightShift, NodeBinaryLessThan, NodeBinaryLessThanOrEqual, NodeBinaryGreaterThan, NodeBinaryGreaterThanOrEqual, NodeBinaryEquality, NodeBinaryInequality, NodeBinaryStrictEquality, NodeBinaryStrictInequality, NodeBinaryBitwiseAnd, NodeBinaryBitwiseXor, NodeBinaryBitwiseOr, NodeBinaryLogicalAnd, NodeBinaryLogicalOr, NodeBinaryNullishCoalescing};
export type {NodePrimitive, NodeVariable, NodeUnary, NodeBinary, NodeGroupOpen, NodeGroupClose, NodeGroup, Node};
