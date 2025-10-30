/**
 * DNA-Lang Parser
 * Recursive descent parser for DNA-Lang syntax
 */

import { Token, TokenType } from './lexer'
import * as AST from './ast'

export class Parser {
  private tokens: Token[]
  private current: number = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): AST.Program {
    const body: AST.Statement[] = []

    while (!this.isAtEnd()) {
      const stmt = this.declaration()
      if (stmt) {
        body.push(stmt)
      }
    }

    return {
      type: 'Program',
      body,
    }
  }

  // ============================================================
  // Declarations
  // ============================================================

  private declaration(): AST.Statement | null {
    try {
      if (this.match(TokenType.ORGANISM)) {
        return this.organismDeclaration() as any
      }
      if (this.match(TokenType.GENE)) {
        return this.geneDeclaration() as any
      }
      if (this.match(TokenType.WORKFLOW)) {
        return this.workflowDeclaration() as any
      }
      if (this.match(TokenType.EVOLVE)) {
        return this.evolvePolicyDeclaration() as any
      }
      if (this.match(TokenType.CIRCUIT)) {
        return this.circuitDeclaration() as any
      }
      if (this.match(TokenType.SENSE)) {
        return this.senseDeclaration() as any
      }
      if (this.match(TokenType.ACT)) {
        return this.actDeclaration() as any
      }

      return this.statement()
    } catch (error) {
      this.synchronize()
      throw error
    }
  }

  private organismDeclaration(): AST.OrganismDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected organism name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after organism name")

    const body = this.organismBody()

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after organism body")

    return {
      type: 'OrganismDeclaration',
      id: AST.createIdentifier(id.value),
      body,
    }
  }

  private organismBody(): AST.OrganismBody {
    const properties: AST.Property[] = []
    let state: AST.StateDeclaration | undefined
    let dna: AST.DNADeclaration | undefined
    const genes: AST.GeneDeclaration[] = []
    const workflows: AST.WorkflowDeclaration[] = []
    const policies: AST.EvolvePolicyDeclaration[] = []
    const functions: AST.FunctionDeclaration[] = []
    const sense: AST.SenseDeclaration[] = []
    const act: AST.ActDeclaration[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.STATE)) {
        state = this.stateDeclaration()
      } else if (this.match(TokenType.DNA)) {
        dna = this.dnaDeclaration()
      } else if (this.match(TokenType.GENE)) {
        genes.push(this.geneDeclaration())
      } else if (this.match(TokenType.WORKFLOW)) {
        workflows.push(this.workflowDeclaration())
      } else if (this.match(TokenType.EVOLVE)) {
        policies.push(this.evolvePolicyDeclaration())
      } else if (this.match(TokenType.SENSE)) {
        sense.push(this.senseDeclaration())
      } else if (this.match(TokenType.ACT)) {
        act.push(this.actDeclaration())
      } else if (this.check(TokenType.ASYNC) || this.check(TokenType.FUNCTION)) {
        functions.push(this.functionDeclaration())
      } else if (this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.COLON)) {
        properties.push(this.property())
      } else {
        this.advance()
      }
    }

    return {
      type: 'OrganismBody',
      properties,
      state,
      dna,
      genes,
      workflows,
      policies,
      functions,
      sense,
      act,
    }
  }

  private geneDeclaration(): AST.GeneDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected gene name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after gene name")

    const body = this.geneBody()

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after gene body")

    return {
      type: 'GeneDeclaration',
      id: AST.createIdentifier(id.value),
      body,
    }
  }

  private geneBody(): AST.GeneBody {
    const properties: AST.Property[] = []
    let params: AST.ParamsDeclaration | undefined
    let inputs: AST.InputsDeclaration | undefined
    let outputs: AST.OutputsDeclaration | undefined
    const functions: AST.FunctionDeclaration[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.PARAMS)) {
        params = this.paramsDeclaration()
      } else if (this.match(TokenType.INPUTS)) {
        inputs = this.inputsDeclaration()
      } else if (this.match(TokenType.OUTPUTS)) {
        outputs = this.outputsDeclaration()
      } else if (this.check(TokenType.ASYNC) || this.check(TokenType.FUNCTION)) {
        functions.push(this.functionDeclaration())
      } else if (this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.COLON)) {
        properties.push(this.property())
      } else {
        this.advance()
      }
    }

    return {
      type: 'GeneBody',
      properties,
      params,
      inputs,
      outputs,
      functions,
    }
  }

  private stateDeclaration(): AST.StateDeclaration {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after STATE")

    const properties: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after state properties")

    return {
      type: 'StateDeclaration',
      properties,
    }
  }

  private dnaDeclaration(): AST.DNADeclaration {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after DNA")

    const properties: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after DNA properties")

    return {
      type: 'DNADeclaration',
      properties,
    }
  }

  private paramsDeclaration(): AST.ParamsDeclaration {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after PARAMS")

    const properties: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after params")

    return {
      type: 'ParamsDeclaration',
      properties,
    }
  }

  private inputsDeclaration(): AST.InputsDeclaration {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after INPUTS")

    const properties: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after inputs")

    return {
      type: 'InputsDeclaration',
      properties,
    }
  }

  private outputsDeclaration(): AST.OutputsDeclaration {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after OUTPUTS")

    const properties: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      properties.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after outputs")

    return {
      type: 'OutputsDeclaration',
      properties,
    }
  }

  private workflowDeclaration(): AST.WorkflowDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected workflow name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after workflow name")

    const properties: AST.Property[] = []
    const functions: AST.FunctionDeclaration[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.ASYNC) || this.check(TokenType.FUNCTION)) {
        functions.push(this.functionDeclaration())
      } else if (this.check(TokenType.IDENTIFIER) && this.checkNext(TokenType.COLON)) {
        properties.push(this.property())
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after workflow body")

    return {
      type: 'WorkflowDeclaration',
      id: AST.createIdentifier(id.value),
      body: {
        type: 'WorkflowBody',
        properties,
        functions,
      },
    }
  }

  private evolvePolicyDeclaration(): AST.EvolvePolicyDeclaration {
    this.consume(TokenType.POLICY, "Expected POLICY after EVOLVE")
    const id = this.consume(TokenType.IDENTIFIER, "Expected policy name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after policy name")

    let trigger: AST.TriggerBlock | undefined
    let action: AST.ActionBlock | undefined
    let rollback: AST.RollbackBlock | undefined
    let params: AST.ParamsDeclaration | undefined

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.TRIGGER)) {
        trigger = this.triggerBlock()
      } else if (this.match(TokenType.ACTION)) {
        action = this.actionBlock()
      } else if (this.match(TokenType.ROLLBACK)) {
        rollback = this.rollbackBlock()
      } else if (this.match(TokenType.PARAMS)) {
        params = this.paramsDeclaration()
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after policy body")

    return {
      type: 'EvolvePolicyDeclaration',
      id: AST.createIdentifier(id.value),
      body: {
        type: 'PolicyBody',
        trigger,
        action,
        rollback,
        params,
      },
    }
  }

  private triggerBlock(): AST.TriggerBlock {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after TRIGGER")

    const conditions: AST.Expression[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.WHEN)) {
        conditions.push(this.expression())
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after trigger conditions")

    return {
      type: 'TriggerBlock',
      conditions,
    }
  }

  private actionBlock(): AST.ActionBlock {
    const isAsync = this.match(TokenType.ASYNC)

    this.consume(TokenType.LEFT_BRACE, "Expected '{' after ACTION")

    const body: AST.Statement[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        body.push(stmt)
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after action body")

    return {
      type: 'ActionBlock',
      body,
      isAsync,
    }
  }

  private rollbackBlock(): AST.RollbackBlock {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after ROLLBACK")

    const body: AST.Statement[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        body.push(stmt)
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after rollback body")

    return {
      type: 'RollbackBlock',
      body,
    }
  }

  private circuitDeclaration(): AST.CircuitDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected circuit name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after circuit name")

    let qubits: number | AST.Identifier = 0
    let gates: AST.GatesBlock | undefined
    let measure: AST.MeasureBlock | undefined
    const functions: AST.FunctionDeclaration[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.IDENTIFIER)) {
        const prop = this.peek()
        if (prop.value === 'qubits') {
          this.advance()
          this.consume(TokenType.COLON, "Expected ':' after 'qubits'")
          const qubitValue = this.advance()
          if (qubitValue.type === TokenType.NUMBER) {
            qubits = parseInt(qubitValue.value)
          } else if (qubitValue.type === TokenType.IDENTIFIER) {
            qubits = AST.createIdentifier(qubitValue.value)
          }
        } else {
          this.advance()
        }
      } else if (this.match(TokenType.GATES)) {
        gates = this.gatesBlock()
      } else if (this.match(TokenType.MEASURE)) {
        measure = this.measureBlock()
      } else if (this.check(TokenType.ASYNC) || this.check(TokenType.FUNCTION)) {
        functions.push(this.functionDeclaration())
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after circuit body")

    return {
      type: 'CircuitDeclaration',
      id: AST.createIdentifier(id.value),
      qubits,
      gates,
      measure,
      functions,
    }
  }

  private gatesBlock(): AST.GatesBlock {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after GATES")

    const gates: AST.GateApplication[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      // Parse gate application like H(0) or CNOT(0, 1)
      if (this.check(TokenType.IDENTIFIER)) {
        const gateName = this.advance()
        this.consume(TokenType.LEFT_PAREN, "Expected '(' after gate name")

        const qubits: (number | AST.Identifier)[] = []

        do {
          if (this.check(TokenType.NUMBER)) {
            qubits.push(parseInt(this.advance().value))
          } else if (this.check(TokenType.IDENTIFIER)) {
            qubits.push(AST.createIdentifier(this.advance().value))
          }
        } while (this.match(TokenType.COMMA))

        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after gate qubits")

        gates.push({
          type: 'GateApplication',
          gate: AST.createIdentifier(gateName.value),
          qubits,
        })
      } else {
        this.advance()
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after gates")

    return {
      type: 'GatesBlock',
      gates,
    }
  }

  private measureBlock(): AST.MeasureBlock {
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after MEASURE")

    const measurements: AST.Property[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      measurements.push(this.property())
      this.match(TokenType.COMMA)
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after measurements")

    return {
      type: 'MeasureBlock',
      measurements,
    }
  }

  private senseDeclaration(): AST.SenseDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected sense name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after sense name")

    const body: AST.Statement[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        body.push(stmt)
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after sense body")

    return {
      type: 'SenseDeclaration',
      id: AST.createIdentifier(id.value),
      body,
    }
  }

  private actDeclaration(): AST.ActDeclaration {
    const id = this.consume(TokenType.IDENTIFIER, "Expected act name")
    this.consume(TokenType.LEFT_BRACE, "Expected '{' after act name")

    const body: AST.Statement[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        body.push(stmt)
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after act body")

    return {
      type: 'ActDeclaration',
      id: AST.createIdentifier(id.value),
      body,
    }
  }

  private functionDeclaration(): AST.FunctionDeclaration {
    const isAsync = this.match(TokenType.ASYNC)

    this.consume(TokenType.FUNCTION, "Expected FUNCTION")
    const id = this.consume(TokenType.IDENTIFIER, "Expected function name")

    this.consume(TokenType.LEFT_PAREN, "Expected '(' after function name")

    const params: AST.FunctionParameter[] = []

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        const paramId = this.consume(TokenType.IDENTIFIER, "Expected parameter name")
        let typeAnnotation: AST.TypeAnnotation | undefined
        let defaultValue: AST.Expression | undefined

        if (this.match(TokenType.COLON)) {
          typeAnnotation = this.typeAnnotation()
        }

        if (this.match(TokenType.EQUAL)) {
          defaultValue = this.expression()
        }

        params.push({
          type: 'FunctionParameter',
          id: AST.createIdentifier(paramId.value),
          typeAnnotation,
          defaultValue,
        })
      } while (this.match(TokenType.COMMA))
    }

    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters")

    let returnType: AST.TypeAnnotation | undefined
    if (this.match(TokenType.COLON)) {
      returnType = this.typeAnnotation()
    }

    const body = this.blockStatement()

    return {
      type: 'FunctionDeclaration',
      id: AST.createIdentifier(id.value),
      params,
      returnType,
      body,
      isAsync,
    }
  }

  // ============================================================
  // Statements
  // ============================================================

  private statement(): AST.Statement | null {
    if (this.match(TokenType.IF)) {
      return this.ifStatement()
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement()
    }
    if (this.match(TokenType.FOR)) {
      return this.forStatement()
    }
    if (this.match(TokenType.RETURN)) {
      return this.returnStatement()
    }
    if (this.match(TokenType.BREAK)) {
      return this.breakStatement()
    }
    if (this.match(TokenType.CONTINUE)) {
      return this.continueStatement()
    }
    if (this.match(TokenType.THROW)) {
      return this.throwStatement()
    }
    if (this.match(TokenType.TRY)) {
      return this.tryStatement()
    }
    if (this.match(TokenType.LET) || this.match(TokenType.CONST) || this.match(TokenType.VAR)) {
      return this.variableDeclaration()
    }
    if (this.check(TokenType.LEFT_BRACE)) {
      return this.blockStatement()
    }

    return this.expressionStatement()
  }

  private variableDeclaration(): AST.VariableDeclaration {
    const kind = this.previous().value.toLowerCase() as 'let' | 'const' | 'var'
    const id = this.consume(TokenType.IDENTIFIER, "Expected variable name")

    let typeAnnotation: AST.TypeAnnotation | undefined
    if (this.match(TokenType.COLON)) {
      typeAnnotation = this.typeAnnotation()
    }

    let init: AST.Expression | undefined
    if (this.match(TokenType.EQUAL)) {
      init = this.expression()
    }

    return {
      type: 'VariableDeclaration',
      kind,
      id: AST.createIdentifier(id.value),
      typeAnnotation,
      init,
    }
  }

  private ifStatement(): AST.IfStatement {
    const condition = this.expression()
    const consequent = this.blockStatement()

    let alternate: AST.IfStatement | AST.BlockStatement | undefined

    if (this.match(TokenType.ELSE)) {
      if (this.check(TokenType.IF)) {
        this.advance()
        alternate = this.ifStatement()
      } else {
        alternate = this.blockStatement()
      }
    }

    return {
      type: 'IfStatement',
      condition,
      consequent,
      alternate,
    }
  }

  private whileStatement(): AST.WhileStatement {
    const condition = this.expression()
    const body = this.blockStatement()

    return {
      type: 'WhileStatement',
      condition,
      body,
    }
  }

  private forStatement(): AST.ForStatement {
    const variable = this.consume(TokenType.IDENTIFIER, "Expected variable name")
    this.consume(TokenType.IN, "Expected 'IN' after variable")
    const iterable = this.expression()
    const body = this.blockStatement()

    return {
      type: 'ForStatement',
      variable: AST.createIdentifier(variable.value),
      iterable,
      body,
    }
  }

  private returnStatement(): AST.ReturnStatement {
    let argument: AST.Expression | undefined

    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE)) {
      argument = this.expression()
    }

    return {
      type: 'ReturnStatement',
      argument,
    }
  }

  private breakStatement(): AST.BreakStatement {
    return {
      type: 'BreakStatement',
    }
  }

  private continueStatement(): AST.ContinueStatement {
    return {
      type: 'ContinueStatement',
    }
  }

  private throwStatement(): AST.ThrowStatement {
    const argument = this.expression()

    return {
      type: 'ThrowStatement',
      argument,
    }
  }

  private tryStatement(): AST.TryStatement {
    const body = this.blockStatement()

    let handler: AST.CatchClause | undefined
    if (this.match(TokenType.CATCH)) {
      this.consume(TokenType.LEFT_PAREN, "Expected '(' after CATCH")
      const param = this.consume(TokenType.IDENTIFIER, "Expected catch parameter")
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after catch parameter")

      const catchBody = this.blockStatement()

      handler = {
        type: 'CatchClause',
        param: AST.createIdentifier(param.value),
        body: catchBody,
      }
    }

    let finalizer: AST.BlockStatement | undefined
    if (this.match(TokenType.FINALLY)) {
      finalizer = this.blockStatement()
    }

    return {
      type: 'TryStatement',
      body,
      handler,
      finalizer,
    }
  }

  private blockStatement(): AST.BlockStatement {
    this.consume(TokenType.LEFT_BRACE, "Expected '{'")

    const body: AST.Statement[] = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.statement()
      if (stmt) {
        body.push(stmt)
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expected '}'")

    return {
      type: 'BlockStatement',
      body,
    }
  }

  private expressionStatement(): AST.ExpressionStatement {
    const expression = this.expression()

    return {
      type: 'ExpressionStatement',
      expression,
    }
  }

  // ============================================================
  // Expressions
  // ============================================================

  private expression(): AST.Expression {
    return this.assignment()
  }

  private assignment(): AST.Expression {
    const expr = this.logicalOr()

    if (this.match(
      TokenType.EQUAL,
      TokenType.PLUS_EQUAL,
      TokenType.MINUS_EQUAL,
      TokenType.STAR_EQUAL,
      TokenType.SLASH_EQUAL
    )) {
      const operator = this.previous().value
      const right = this.assignment()

      return {
        type: 'AssignmentExpression',
        operator,
        left: expr,
        right,
      }
    }

    return expr
  }

  private logicalOr(): AST.Expression {
    let expr = this.logicalAnd()

    while (this.match(TokenType.PIPE_PIPE)) {
      const operator = this.previous().value
      const right = this.logicalAnd()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private logicalAnd(): AST.Expression {
    let expr = this.equality()

    while (this.match(TokenType.AMPERSAND_AMPERSAND)) {
      const operator = this.previous().value
      const right = this.equality()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private equality(): AST.Expression {
    let expr = this.comparison()

    while (this.match(
      TokenType.EQUAL_EQUAL,
      TokenType.BANG_EQUAL,
      TokenType.EQUAL_EQUAL_EQUAL,
      TokenType.BANG_EQUAL_EQUAL
    )) {
      const operator = this.previous().value
      const right = this.comparison()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private comparison(): AST.Expression {
    let expr = this.term()

    while (this.match(
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL
    )) {
      const operator = this.previous().value
      const right = this.term()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private term(): AST.Expression {
    let expr = this.factor()

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value
      const right = this.factor()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private factor(): AST.Expression {
    let expr = this.unary()

    while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const operator = this.previous().value
      const right = this.unary()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private unary(): AST.Expression {
    if (this.match(TokenType.BANG, TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous().value
      const argument = this.unary()
      return {
        type: 'UnaryExpression',
        operator,
        argument,
        prefix: true,
      }
    }

    if (this.match(TokenType.AWAIT)) {
      const argument = this.unary()
      return {
        type: 'AwaitExpression',
        argument,
      }
    }

    return this.power()
  }

  private power(): AST.Expression {
    let expr = this.quantum()

    if (this.match(TokenType.POWER)) {
      const operator = this.previous().value
      const right = this.power()
      expr = AST.createBinaryExpression(operator, expr, right)
    }

    return expr
  }

  private quantum(): AST.Expression {
    let expr = this.postfix()

    while (this.match(
      TokenType.TENSOR,
      TokenType.DIRECT_SUM,
      TokenType.DAGGER,
      TokenType.COMPOSE,
      TokenType.HADAMARD_PRODUCT
    )) {
      const operatorToken = this.previous()
      const operatorMap: Record<string, string> = {
        '⊗': 'tensor',
        '⊕': 'direct_sum',
        '†': 'dagger',
        '∘': 'compose',
        '⊙': 'hadamard',
      }

      const operator = operatorMap[operatorToken.value] || operatorToken.value

      if (operator === 'dagger') {
        return {
          type: 'QuantumExpression',
          operator: 'dagger' as any,
          argument: expr,
        }
      } else {
        const right = this.postfix()
        expr = {
          type: 'QuantumExpression',
          operator: operator as any,
          left: expr,
          right,
        }
      }
    }

    return expr
  }

  private postfix(): AST.Expression {
    let expr = this.primary()

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        const args: AST.Expression[] = []

        if (!this.check(TokenType.RIGHT_PAREN)) {
          do {
            args.push(this.expression())
          } while (this.match(TokenType.COMMA))
        }

        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments")

        expr = AST.createCallExpression(expr, args)
      } else if (this.match(TokenType.DOT) || this.match(TokenType.QUESTION_DOT)) {
        const optional = this.previous().type === TokenType.QUESTION_DOT
        const property = this.consume(TokenType.IDENTIFIER, "Expected property name")

        expr = {
          ...AST.createMemberExpression(expr, AST.createIdentifier(property.value), false),
          optional,
        }
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        const property = this.expression()
        this.consume(TokenType.RIGHT_BRACKET, "Expected ']'")

        expr = AST.createMemberExpression(expr, property, true)
      } else {
        break
      }
    }

    return expr
  }

  private primary(): AST.Expression {
    if (this.match(TokenType.TRUE)) {
      return AST.createLiteral(true, 'true')
    }

    if (this.match(TokenType.FALSE)) {
      return AST.createLiteral(false, 'false')
    }

    if (this.match(TokenType.NULL)) {
      return AST.createLiteral(null, 'null')
    }

    if (this.match(TokenType.UNDEFINED)) {
      return AST.createLiteral(null, 'undefined')
    }

    if (this.match(TokenType.NUMBER)) {
      return AST.createLiteral(parseFloat(this.previous().value), this.previous().value)
    }

    if (this.match(TokenType.STRING)) {
      const value = this.previous().value
      // Remove quotes
      const stringValue = value.substring(1, value.length - 1)
      return AST.createLiteral(stringValue, value)
    }

    if (this.match(TokenType.QUBIT_LITERAL)) {
      const value = this.previous().value
      // Extract state from |ψ⟩
      const state = value.substring(1, value.length - 1)
      return {
        type: 'QubitLiteral',
        state,
      }
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return AST.createIdentifier(this.previous().value)
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression")
      return expr
    }

    if (this.match(TokenType.LEFT_BRACKET)) {
      const elements: AST.Expression[] = []

      if (!this.check(TokenType.RIGHT_BRACKET)) {
        do {
          elements.push(this.expression())
        } while (this.match(TokenType.COMMA))
      }

      this.consume(TokenType.RIGHT_BRACKET, "Expected ']'")

      return {
        type: 'ArrayExpression',
        elements,
      }
    }

    if (this.match(TokenType.LEFT_BRACE)) {
      const properties: AST.Property[] = []

      if (!this.check(TokenType.RIGHT_BRACE)) {
        do {
          properties.push(this.property())
        } while (this.match(TokenType.COMMA))
      }

      this.consume(TokenType.RIGHT_BRACE, "Expected '}'")

      return {
        type: 'ObjectExpression',
        properties,
      }
    }

    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}`)
  }

  private property(): AST.Property {
    const key = this.check(TokenType.STRING)
      ? AST.createLiteral(this.advance().value, this.previous().value)
      : AST.createIdentifier(this.consume(TokenType.IDENTIFIER, "Expected property name").value)

    this.consume(TokenType.COLON, "Expected ':' after property name")

    const value = this.expression()

    return {
      type: 'Property',
      key,
      value,
    }
  }

  private typeAnnotation(): AST.TypeAnnotation {
    const typeExpr = this.typeExpression()

    return {
      type: 'TypeAnnotation',
      typeExpression: typeExpr,
    }
  }

  private typeExpression(): AST.TypeExpression {
    if (this.check(TokenType.IDENTIFIER)) {
      const typeName = this.advance().value

      // Check for primitive types
      if (['Number', 'String', 'Boolean', 'Void', 'Null', 'Undefined', 'Any'].includes(typeName)) {
        return {
          type: 'PrimitiveType',
          name: typeName as any,
        }
      }

      // Check for quantum types
      if (['Qubit', 'QubitRegister', 'QuantumState', 'QuantumCircuit', 'QuantumGate'].includes(typeName)) {
        return {
          type: 'QuantumType',
          name: typeName as any,
        }
      }

      // Generic type
      if (this.match(TokenType.LESS)) {
        const typeArguments: AST.TypeExpression[] = []

        do {
          typeArguments.push(this.typeExpression())
        } while (this.match(TokenType.COMMA))

        this.consume(TokenType.GREATER, "Expected '>' after type arguments")

        return {
          type: 'GenericType',
          name: typeName,
          typeArguments,
        }
      }

      // Generic or custom type
      return {
        type: 'GenericType',
        name: typeName,
        typeArguments: [],
      }
    }

    throw new Error(`Expected type expression at line ${this.peek().line}`)
  }

  // ============================================================
  // Utility Methods
  // ============================================================

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private checkNext(type: TokenType): boolean {
    if (this.current + 1 >= this.tokens.length) return false
    return this.tokens[this.current + 1].type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance()

    throw new Error(`${message} at line ${this.peek().line}, got '${this.peek().value}'`)
  }

  private synchronize(): void {
    this.advance()

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return

      switch (this.peek().type) {
        case TokenType.ORGANISM:
        case TokenType.GENE:
        case TokenType.WORKFLOW:
        case TokenType.FUNCTION:
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.RETURN:
          return
      }

      this.advance()
    }
  }
}
