/**
 * DNA-Lang Abstract Syntax Tree (AST) Definitions
 */

// Base node interface
export interface ASTNode {
  type: string
  loc?: SourceLocation
}

export interface SourceLocation {
  start: Position
  end: Position
}

export interface Position {
  line: number
  column: number
  offset: number
}

// ============================================================
// Program and Top-Level Declarations
// ============================================================

export interface Program extends ASTNode {
  type: 'Program'
  body: Statement[]
}

export interface OrganismDeclaration extends ASTNode {
  type: 'OrganismDeclaration'
  id: Identifier
  body: OrganismBody
  metadata?: PropertyList
}

export interface OrganismBody extends ASTNode {
  type: 'OrganismBody'
  properties: Property[]
  state?: StateDeclaration
  dna?: DNADeclaration
  genes: GeneDeclaration[]
  workflows: WorkflowDeclaration[]
  policies: EvolvePolicyDeclaration[]
  functions: FunctionDeclaration[]
  sense: SenseDeclaration[]
  act: ActDeclaration[]
}

export interface GeneDeclaration extends ASTNode {
  type: 'GeneDeclaration'
  id: Identifier
  body: GeneBody
}

export interface GeneBody extends ASTNode {
  type: 'GeneBody'
  properties: Property[]
  params?: ParamsDeclaration
  inputs?: InputsDeclaration
  outputs?: OutputsDeclaration
  functions: FunctionDeclaration[]
}

export interface StateDeclaration extends ASTNode {
  type: 'StateDeclaration'
  properties: Property[]
}

export interface DNADeclaration extends ASTNode {
  type: 'DNADeclaration'
  properties: Property[]
}

export interface ParamsDeclaration extends ASTNode {
  type: 'ParamsDeclaration'
  properties: Property[]
}

export interface InputsDeclaration extends ASTNode {
  type: 'InputsDeclaration'
  properties: Property[]
}

export interface OutputsDeclaration extends ASTNode {
  type: 'OutputsDeclaration'
  properties: Property[]
}

export interface WorkflowDeclaration extends ASTNode {
  type: 'WorkflowDeclaration'
  id: Identifier
  body: WorkflowBody
}

export interface WorkflowBody extends ASTNode {
  type: 'WorkflowBody'
  properties: Property[]
  functions: FunctionDeclaration[]
}

export interface EvolvePolicyDeclaration extends ASTNode {
  type: 'EvolvePolicyDeclaration'
  id: Identifier
  body: PolicyBody
}

export interface PolicyBody extends ASTNode {
  type: 'PolicyBody'
  trigger?: TriggerBlock
  action?: ActionBlock
  rollback?: RollbackBlock
  params?: ParamsDeclaration
}

export interface TriggerBlock extends ASTNode {
  type: 'TriggerBlock'
  conditions: Expression[]
}

export interface ActionBlock extends ASTNode {
  type: 'ActionBlock'
  body: Statement[]
  isAsync?: boolean
}

export interface RollbackBlock extends ASTNode {
  type: 'RollbackBlock'
  body: Statement[]
}

export interface SenseDeclaration extends ASTNode {
  type: 'SenseDeclaration'
  id: Identifier
  body: Statement[]
}

export interface ActDeclaration extends ASTNode {
  type: 'ActDeclaration'
  id: Identifier
  body: Statement[]
}

// ============================================================
// Quantum Constructs
// ============================================================

export interface CircuitDeclaration extends ASTNode {
  type: 'CircuitDeclaration'
  id: Identifier
  qubits: number | Identifier
  gates?: GatesBlock
  measure?: MeasureBlock
  functions: FunctionDeclaration[]
}

export interface GatesBlock extends ASTNode {
  type: 'GatesBlock'
  gates: GateApplication[]
}

export interface MeasureBlock extends ASTNode {
  type: 'MeasureBlock'
  measurements: Property[]
}

export interface GateApplication extends ASTNode {
  type: 'GateApplication'
  gate: Identifier
  qubits: (number | Identifier)[]
  params?: Expression[]
}

export interface QubitLiteral extends ASTNode {
  type: 'QubitLiteral'
  state: string  // e.g., "0", "1", "+", "-", "ψ"
}

// ============================================================
// Statements
// ============================================================

export type Statement =
  | ExpressionStatement
  | VariableDeclaration
  | FunctionDeclaration
  | IfStatement
  | WhileStatement
  | ForStatement
  | ReturnStatement
  | BreakStatement
  | ContinueStatement
  | ThrowStatement
  | TryStatement
  | BlockStatement

export interface ExpressionStatement extends ASTNode {
  type: 'ExpressionStatement'
  expression: Expression
}

export interface VariableDeclaration extends ASTNode {
  type: 'VariableDeclaration'
  kind: 'let' | 'const' | 'var'
  id: Identifier
  typeAnnotation?: TypeAnnotation
  init?: Expression
}

export interface FunctionDeclaration extends ASTNode {
  type: 'FunctionDeclaration'
  id: Identifier
  params: FunctionParameter[]
  returnType?: TypeAnnotation
  body: BlockStatement
  isAsync?: boolean
}

export interface FunctionParameter extends ASTNode {
  type: 'FunctionParameter'
  id: Identifier
  typeAnnotation?: TypeAnnotation
  defaultValue?: Expression
}

export interface IfStatement extends ASTNode {
  type: 'IfStatement'
  condition: Expression
  consequent: BlockStatement
  alternate?: IfStatement | BlockStatement
}

export interface WhileStatement extends ASTNode {
  type: 'WhileStatement'
  condition: Expression
  body: BlockStatement
}

export interface ForStatement extends ASTNode {
  type: 'ForStatement'
  variable: Identifier
  iterable: Expression
  body: BlockStatement
}

export interface ReturnStatement extends ASTNode {
  type: 'ReturnStatement'
  argument?: Expression
}

export interface BreakStatement extends ASTNode {
  type: 'BreakStatement'
}

export interface ContinueStatement extends ASTNode {
  type: 'ContinueStatement'
}

export interface ThrowStatement extends ASTNode {
  type: 'ThrowStatement'
  argument: Expression
}

export interface TryStatement extends ASTNode {
  type: 'TryStatement'
  body: BlockStatement
  handler?: CatchClause
  finalizer?: BlockStatement
}

export interface CatchClause extends ASTNode {
  type: 'CatchClause'
  param: Identifier
  body: BlockStatement
}

export interface BlockStatement extends ASTNode {
  type: 'BlockStatement'
  body: Statement[]
}

// ============================================================
// Expressions
// ============================================================

export type Expression =
  | Identifier
  | Literal
  | BinaryExpression
  | UnaryExpression
  | AssignmentExpression
  | CallExpression
  | MemberExpression
  | ArrayExpression
  | ObjectExpression
  | AwaitExpression
  | QuantumExpression

export interface Identifier extends ASTNode {
  type: 'Identifier'
  name: string
}

export interface Literal extends ASTNode {
  type: 'Literal'
  value: string | number | boolean | null
  raw: string
}

export interface BinaryExpression extends ASTNode {
  type: 'BinaryExpression'
  operator: string
  left: Expression
  right: Expression
}

export interface UnaryExpression extends ASTNode {
  type: 'UnaryExpression'
  operator: string
  argument: Expression
  prefix: boolean
}

export interface AssignmentExpression extends ASTNode {
  type: 'AssignmentExpression'
  operator: string
  left: Expression
  right: Expression
}

export interface CallExpression extends ASTNode {
  type: 'CallExpression'
  callee: Expression
  arguments: Expression[]
}

export interface MemberExpression extends ASTNode {
  type: 'MemberExpression'
  object: Expression
  property: Expression
  computed: boolean  // true for a[b], false for a.b
  optional?: boolean // true for a?.b
}

export interface ArrayExpression extends ASTNode {
  type: 'ArrayExpression'
  elements: Expression[]
}

export interface ObjectExpression extends ASTNode {
  type: 'ObjectExpression'
  properties: Property[]
}

export interface Property extends ASTNode {
  type: 'Property'
  key: Identifier | Literal
  value: Expression
  shorthand?: boolean
}

export interface AwaitExpression extends ASTNode {
  type: 'AwaitExpression'
  argument: Expression
}

export interface QuantumExpression extends ASTNode {
  type: 'QuantumExpression'
  operator: 'tensor' | 'direct_sum' | 'dagger' | 'compose' | 'hadamard'
  left?: Expression
  right?: Expression
  argument?: Expression
}

// ============================================================
// Type System
// ============================================================

export interface TypeAnnotation extends ASTNode {
  type: 'TypeAnnotation'
  typeExpression: TypeExpression
}

export type TypeExpression =
  | PrimitiveType
  | GenericType
  | FunctionType
  | UnionType
  | QuantumType

export interface PrimitiveType extends ASTNode {
  type: 'PrimitiveType'
  name: 'Number' | 'String' | 'Boolean' | 'Void' | 'Null' | 'Undefined' | 'Any'
}

export interface GenericType extends ASTNode {
  type: 'GenericType'
  name: string
  typeArguments: TypeExpression[]
}

export interface FunctionType extends ASTNode {
  type: 'FunctionType'
  params: TypeExpression[]
  returnType: TypeExpression
}

export interface UnionType extends ASTNode {
  type: 'UnionType'
  types: TypeExpression[]
}

export interface QuantumType extends ASTNode {
  type: 'QuantumType'
  name: 'Qubit' | 'QubitRegister' | 'QuantumState' | 'QuantumCircuit' | 'QuantumGate'
}

// ============================================================
// Utility Types
// ============================================================

export type PropertyList = Property[]

// ============================================================
// AST Visitor Pattern
// ============================================================

export interface ASTVisitor<T = any> {
  visitProgram(node: Program): T
  visitOrganismDeclaration(node: OrganismDeclaration): T
  visitGeneDeclaration(node: GeneDeclaration): T
  visitWorkflowDeclaration(node: WorkflowDeclaration): T
  visitEvolvePolicyDeclaration(node: EvolvePolicyDeclaration): T
  visitFunctionDeclaration(node: FunctionDeclaration): T
  visitVariableDeclaration(node: VariableDeclaration): T
  visitIfStatement(node: IfStatement): T
  visitWhileStatement(node: WhileStatement): T
  visitForStatement(node: ForStatement): T
  visitReturnStatement(node: ReturnStatement): T
  visitBreakStatement(node: BreakStatement): T
  visitContinueStatement(node: ContinueStatement): T
  visitExpressionStatement(node: ExpressionStatement): T
  visitBlockStatement(node: BlockStatement): T
  visitBinaryExpression(node: BinaryExpression): T
  visitUnaryExpression(node: UnaryExpression): T
  visitAssignmentExpression(node: AssignmentExpression): T
  visitCallExpression(node: CallExpression): T
  visitMemberExpression(node: MemberExpression): T
  visitIdentifier(node: Identifier): T
  visitLiteral(node: Literal): T
  visitArrayExpression(node: ArrayExpression): T
  visitObjectExpression(node: ObjectExpression): T
  visitAwaitExpression(node: AwaitExpression): T
  visitQuantumExpression(node: QuantumExpression): T
  visitCircuitDeclaration(node: CircuitDeclaration): T
  visitQubitLiteral(node: QubitLiteral): T
}

// ============================================================
// AST Utilities
// ============================================================

export function createIdentifier(name: string): Identifier {
  return {
    type: 'Identifier',
    name,
  }
}

export function createLiteral(value: string | number | boolean | null, raw?: string): Literal {
  return {
    type: 'Literal',
    value,
    raw: raw ?? String(value),
  }
}

export function createBinaryExpression(
  operator: string,
  left: Expression,
  right: Expression
): BinaryExpression {
  return {
    type: 'BinaryExpression',
    operator,
    left,
    right,
  }
}

export function createCallExpression(
  callee: Expression,
  args: Expression[]
): CallExpression {
  return {
    type: 'CallExpression',
    callee,
    arguments: args,
  }
}

export function createMemberExpression(
  object: Expression,
  property: Expression,
  computed: boolean = false
): MemberExpression {
  return {
    type: 'MemberExpression',
    object,
    property,
    computed,
  }
}

export function createBlockStatement(body: Statement[]): BlockStatement {
  return {
    type: 'BlockStatement',
    body,
  }
}

export function createReturnStatement(argument?: Expression): ReturnStatement {
  return {
    type: 'ReturnStatement',
    argument,
  }
}
