
/* CONTEXT */

type Context = Record<string, unknown>;

/* NODES */

type NodeRoot = { type: 'root', children: [Node] };
type NodeGroup = { type: 'group', children: [Node] };
type NodeIdentifier = { type: 'identifier', value: string };
type NodeOperator = { type: 'operator', value: string };

type NodePrimitiveTrue = { type: 'true' };
type NodePrimitiveFalse = { type: 'false' };
type NodePrimitiveNull = { type: 'null' };
type NodePrimitiveUndefined = { type: 'undefined' };
type NodePrimitiveBigInt = { type: 'bigint', value: bigint };
type NodePrimitiveNumber = { type: 'number', value: number };
type NodePrimitiveString = { type: 'string', value: string };

type NodeMemberCaller = { type: 'memberCaller', children: Node[] };
type NodeMemberCall = { type: 'memberCall', children: [Node, Node[]] };
type NodeMemberAccessor = { type: 'memberAccessor', value: string };
type NodeMemberAccess = { type: 'memberAccess', children: [Node, string] };
type NodeComputedMemberAccessor = { type: 'computedMemberAccessor', children: [Node] };
type NodeComputedMemberAccess = { type: 'computedMemberAccess', children: [Node, Node] };

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

type NodePrimitive = NodePrimitiveTrue | NodePrimitiveFalse | NodePrimitiveNull | NodePrimitiveUndefined | NodePrimitiveBigInt | NodePrimitiveNumber | NodePrimitiveString;
type NodeAccess = NodeMemberCaller | NodeMemberCall | NodeMemberAccessor | NodeMemberAccess | NodeComputedMemberAccess | NodeComputedMemberAccessor;
type NodeUnary = NodeUnaryLogicalNot | NodeUnaryBitwiseNot | NodeUnaryPlus | NodeUnaryNegation;
type NodeBinary = NodeBinaryExponentiation | NodeBinaryMultiplication | NodeBinaryDivision | NodeBinaryReminder | NodeBinaryAddition | NodeBinarySubtraction | NodeBinaryBitwiseLeftShift | NodeBinaryBitwiseRightShift | NodeBinaryBitwiseUnsignedRightShift | NodeBinaryLessThan | NodeBinaryLessThanOrEqual | NodeBinaryGreaterThan | NodeBinaryGreaterThanOrEqual | NodeBinaryEquality | NodeBinaryInequality | NodeBinaryStrictEquality | NodeBinaryStrictInequality | NodeBinaryBitwiseAnd | NodeBinaryBitwiseXor | NodeBinaryBitwiseOr | NodeBinaryLogicalAnd | NodeBinaryLogicalOr | NodeBinaryNullishCoalescing;

type NodeExternal = NodeRoot | NodeGroup | NodeIdentifier | NodePrimitive | NodeMemberCall |NodeMemberAccess | NodeComputedMemberAccess | NodeUnary | NodeBinary;
type NodeInterval = NodeOperator | NodeMemberCaller | NodeMemberAccessor | NodeComputedMemberAccessor;
type Node = NodeExternal | NodeInterval;

/* EXPORT */

export type {Context};

export type {NodeRoot, NodeGroup, NodeIdentifier, NodeOperator};
export type {NodePrimitiveTrue, NodePrimitiveFalse, NodePrimitiveNull, NodePrimitiveUndefined, NodePrimitiveBigInt, NodePrimitiveNumber, NodePrimitiveString};
export type {NodeMemberCaller, NodeMemberCall, NodeMemberAccessor, NodeMemberAccess, NodeComputedMemberAccessor, NodeComputedMemberAccess};
export type {NodeUnaryLogicalNot, NodeUnaryBitwiseNot, NodeUnaryPlus, NodeUnaryNegation};
export type {NodeBinaryExponentiation, NodeBinaryMultiplication, NodeBinaryDivision, NodeBinaryReminder, NodeBinaryAddition, NodeBinarySubtraction, NodeBinaryBitwiseLeftShift, NodeBinaryBitwiseRightShift, NodeBinaryBitwiseUnsignedRightShift, NodeBinaryLessThan, NodeBinaryLessThanOrEqual, NodeBinaryGreaterThan, NodeBinaryGreaterThanOrEqual, NodeBinaryEquality, NodeBinaryInequality, NodeBinaryStrictEquality, NodeBinaryStrictInequality, NodeBinaryBitwiseAnd, NodeBinaryBitwiseXor, NodeBinaryBitwiseOr, NodeBinaryLogicalAnd, NodeBinaryLogicalOr, NodeBinaryNullishCoalescing};
export type {NodePrimitive, NodeAccess, NodeUnary, NodeBinary};
export type {NodeExternal, NodeInterval, Node};
