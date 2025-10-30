/**
 * DNA-Lang Lexer
 * Tokenizes DNA-Lang source code
 */

export enum TokenType {
  // Keywords
  ORGANISM = 'ORGANISM',
  GENE = 'GENE',
  DNA = 'DNA',
  STATE = 'STATE',
  PARAMS = 'PARAMS',
  WORKFLOW = 'WORKFLOW',
  POLICY = 'POLICY',
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  ROLLBACK = 'ROLLBACK',
  SENSE = 'SENSE',
  ACT = 'ACT',
  EVOLVE = 'EVOLVE',
  IF = 'IF',
  THEN = 'THEN',
  ELSE = 'ELSE',
  WHILE = 'WHILE',
  FOR = 'FOR',
  IN = 'IN',
  FUNCTION = 'FUNCTION',
  ASYNC = 'ASYNC',
  AWAIT = 'AWAIT',
  RETURN = 'RETURN',
  BREAK = 'BREAK',
  CONTINUE = 'CONTINUE',
  LET = 'LET',
  CONST = 'CONST',
  VAR = 'VAR',
  CIRCUIT = 'CIRCUIT',
  QUANTUM = 'QUANTUM',
  QUBIT = 'QUBIT',
  GATE = 'GATE',
  GATES = 'GATES',
  MEASURE = 'MEASURE',
  ENTANGLE = 'ENTANGLE',
  COHERENCE = 'COHERENCE',
  FIDELITY = 'FIDELITY',
  OPTIMIZE = 'OPTIMIZE',
  MUTATE = 'MUTATE',
  MODIFY = 'MODIFY',
  SELF = 'SELF',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  NULL = 'NULL',
  UNDEFINED = 'UNDEFINED',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
  FROM = 'FROM',
  CLASS = 'CLASS',
  EXTENDS = 'EXTENDS',
  IMPLEMENTS = 'IMPLEMENTS',
  INTERFACE = 'INTERFACE',
  NEW = 'NEW',
  THIS = 'THIS',
  SUPER = 'SUPER',
  TRY = 'TRY',
  CATCH = 'CATCH',
  FINALLY = 'FINALLY',
  THROW = 'THROW',
  SWITCH = 'SWITCH',
  CASE = 'CASE',
  DEFAULT = 'DEFAULT',
  MATCH = 'MATCH',
  WHEN = 'WHEN',
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  INPUTS = 'INPUTS',
  OUTPUTS = 'OUTPUTS',
  WASSERSTEIN = 'WASSERSTEIN',

  // Literals
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  QUBIT_LITERAL = 'QUBIT_LITERAL',

  // Operators
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  STAR = 'STAR',
  SLASH = 'SLASH',
  PERCENT = 'PERCENT',
  POWER = 'POWER',
  EQUAL = 'EQUAL',
  EQUAL_EQUAL = 'EQUAL_EQUAL',
  EQUAL_EQUAL_EQUAL = 'EQUAL_EQUAL_EQUAL',
  BANG = 'BANG',
  BANG_EQUAL = 'BANG_EQUAL',
  BANG_EQUAL_EQUAL = 'BANG_EQUAL_EQUAL',
  LESS = 'LESS',
  LESS_EQUAL = 'LESS_EQUAL',
  GREATER = 'GREATER',
  GREATER_EQUAL = 'GREATER_EQUAL',
  AMPERSAND_AMPERSAND = 'AMPERSAND_AMPERSAND',
  PIPE_PIPE = 'PIPE_PIPE',
  QUESTION_QUESTION = 'QUESTION_QUESTION',
  PLUS_EQUAL = 'PLUS_EQUAL',
  MINUS_EQUAL = 'MINUS_EQUAL',
  STAR_EQUAL = 'STAR_EQUAL',
  SLASH_EQUAL = 'SLASH_EQUAL',

  // Quantum operators
  TENSOR = 'TENSOR',           // ⊗
  DIRECT_SUM = 'DIRECT_SUM',   // ⊕
  DAGGER = 'DAGGER',           // †
  KET = 'KET',                 // |⟩
  BRA = 'BRA',                 // ⟨|
  INNER_PRODUCT = 'INNER_PRODUCT', // ⟨|⟩
  COMPOSE = 'COMPOSE',         // ∘
  HADAMARD_PRODUCT = 'HADAMARD_PRODUCT', // ⊙

  // Delimiters
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  COMMA = 'COMMA',
  DOT = 'DOT',
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  ARROW = 'ARROW',
  QUESTION = 'QUESTION',
  QUESTION_DOT = 'QUESTION_DOT',

  // Special
  NEWLINE = 'NEWLINE',
  EOF = 'EOF',
  COMMENT = 'COMMENT',
}

export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
  start: number
  end: number
}

const KEYWORDS: Record<string, TokenType> = {
  'ORGANISM': TokenType.ORGANISM,
  'GENE': TokenType.GENE,
  'DNA': TokenType.DNA,
  'STATE': TokenType.STATE,
  'PARAMS': TokenType.PARAMS,
  'WORKFLOW': TokenType.WORKFLOW,
  'POLICY': TokenType.POLICY,
  'TRIGGER': TokenType.TRIGGER,
  'ACTION': TokenType.ACTION,
  'ROLLBACK': TokenType.ROLLBACK,
  'SENSE': TokenType.SENSE,
  'ACT': TokenType.ACT,
  'EVOLVE': TokenType.EVOLVE,
  'IF': TokenType.IF,
  'THEN': TokenType.THEN,
  'ELSE': TokenType.ELSE,
  'WHILE': TokenType.WHILE,
  'FOR': TokenType.FOR,
  'IN': TokenType.IN,
  'FUNCTION': TokenType.FUNCTION,
  'ASYNC': TokenType.ASYNC,
  'AWAIT': TokenType.AWAIT,
  'RETURN': TokenType.RETURN,
  'BREAK': TokenType.BREAK,
  'CONTINUE': TokenType.CONTINUE,
  'LET': TokenType.LET,
  'CONST': TokenType.CONST,
  'VAR': TokenType.VAR,
  'CIRCUIT': TokenType.CIRCUIT,
  'QUANTUM': TokenType.QUANTUM,
  'QUBIT': TokenType.QUBIT,
  'GATE': TokenType.GATE,
  'GATES': TokenType.GATES,
  'MEASURE': TokenType.MEASURE,
  'ENTANGLE': TokenType.ENTANGLE,
  'COHERENCE': TokenType.COHERENCE,
  'FIDELITY': TokenType.FIDELITY,
  'OPTIMIZE': TokenType.OPTIMIZE,
  'MUTATE': TokenType.MUTATE,
  'MODIFY': TokenType.MODIFY,
  'SELF': TokenType.SELF,
  'TRUE': TokenType.TRUE,
  'FALSE': TokenType.FALSE,
  'NULL': TokenType.NULL,
  'UNDEFINED': TokenType.UNDEFINED,
  'IMPORT': TokenType.IMPORT,
  'EXPORT': TokenType.EXPORT,
  'FROM': TokenType.FROM,
  'CLASS': TokenType.CLASS,
  'EXTENDS': TokenType.EXTENDS,
  'IMPLEMENTS': TokenType.IMPLEMENTS,
  'INTERFACE': TokenType.INTERFACE,
  'NEW': TokenType.NEW,
  'THIS': TokenType.THIS,
  'SUPER': TokenType.SUPER,
  'TRY': TokenType.TRY,
  'CATCH': TokenType.CATCH,
  'FINALLY': TokenType.FINALLY,
  'THROW': TokenType.THROW,
  'SWITCH': TokenType.SWITCH,
  'CASE': TokenType.CASE,
  'DEFAULT': TokenType.DEFAULT,
  'MATCH': TokenType.MATCH,
  'WHEN': TokenType.WHEN,
  'AND': TokenType.AND,
  'OR': TokenType.OR,
  'NOT': TokenType.NOT,
  'INPUTS': TokenType.INPUTS,
  'OUTPUTS': TokenType.OUTPUTS,
  'WASSERSTEIN': TokenType.WASSERSTEIN,
}

export class Lexer {
  private source: string
  private tokens: Token[] = []
  private start: number = 0
  private current: number = 0
  private line: number = 1
  private column: number = 1

  constructor(source: string) {
    this.source = source
  }

  tokenize(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
      start: this.current,
      end: this.current,
    })

    return this.tokens
  }

  private scanToken(): void {
    const c = this.advance()

    switch (c) {
      // Single-character tokens
      case '(':
        this.addToken(TokenType.LEFT_PAREN)
        break
      case ')':
        this.addToken(TokenType.RIGHT_PAREN)
        break
      case '{':
        this.addToken(TokenType.LEFT_BRACE)
        break
      case '}':
        this.addToken(TokenType.RIGHT_BRACE)
        break
      case '[':
        this.addToken(TokenType.LEFT_BRACKET)
        break
      case ']':
        this.addToken(TokenType.RIGHT_BRACKET)
        break
      case ',':
        this.addToken(TokenType.COMMA)
        break
      case '.':
        this.addToken(TokenType.DOT)
        break
      case ':':
        this.addToken(TokenType.COLON)
        break
      case ';':
        this.addToken(TokenType.SEMICOLON)
        break
      case '%':
        this.addToken(TokenType.PERCENT)
        break

      // Operators with potential multi-character variants
      case '+':
        this.addToken(this.match('=') ? TokenType.PLUS_EQUAL : TokenType.PLUS)
        break
      case '-':
        this.addToken(this.match('=') ? TokenType.MINUS_EQUAL : TokenType.MINUS)
        break
      case '*':
        if (this.match('*')) {
          this.addToken(TokenType.POWER)
        } else if (this.match('=')) {
          this.addToken(TokenType.STAR_EQUAL)
        } else {
          this.addToken(TokenType.STAR)
        }
        break
      case '/':
        if (this.match('/')) {
          // Single-line comment
          this.lineComment()
        } else if (this.match('*')) {
          // Multi-line comment
          this.blockComment()
        } else if (this.match('=')) {
          this.addToken(TokenType.SLASH_EQUAL)
        } else {
          this.addToken(TokenType.SLASH)
        }
        break
      case '=':
        if (this.match('=')) {
          this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL_EQUAL : TokenType.EQUAL_EQUAL)
        } else {
          this.addToken(TokenType.EQUAL)
        }
        break
      case '!':
        if (this.match('=')) {
          this.addToken(this.match('=') ? TokenType.BANG_EQUAL_EQUAL : TokenType.BANG_EQUAL)
        } else {
          this.addToken(TokenType.BANG)
        }
        break
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AMPERSAND_AMPERSAND)
        }
        break
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.PIPE_PIPE)
        } else {
          // Could be qubit literal |ψ⟩
          this.qubitLiteral()
        }
        break
      case '?':
        if (this.match('?')) {
          this.addToken(TokenType.QUESTION_QUESTION)
        } else if (this.match('.')) {
          this.addToken(TokenType.QUESTION_DOT)
        } else {
          this.addToken(TokenType.QUESTION)
        }
        break

      // Quantum operators (Unicode)
      case '⊗':
        this.addToken(TokenType.TENSOR)
        break
      case '⊕':
        this.addToken(TokenType.DIRECT_SUM)
        break
      case '†':
        this.addToken(TokenType.DAGGER)
        break
      case '∘':
        this.addToken(TokenType.COMPOSE)
        break
      case '⊙':
        this.addToken(TokenType.HADAMARD_PRODUCT)
        break

      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break

      case '\n':
        this.line++
        this.column = 1
        break

      // String literals
      case '"':
      case "'":
        this.string(c)
        break

      case '`':
        this.templateString()
        break

      default:
        if (this.isDigit(c)) {
          this.number()
        } else if (this.isAlpha(c)) {
          this.identifier()
        } else {
          throw new Error(`Unexpected character '${c}' at line ${this.line}, column ${this.column}`)
        }
    }
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance()
    }

    const text = this.source.substring(this.start, this.current)
    const type = KEYWORDS[text] || TokenType.IDENTIFIER

    this.addToken(type)
  }

  private number(): void {
    while (this.isDigit(this.peek())) {
      this.advance()
    }

    // Look for decimal part
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance() // Consume '.'

      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }

    // Look for scientific notation
    if (this.peek() === 'e' || this.peek() === 'E') {
      this.advance()

      if (this.peek() === '+' || this.peek() === '-') {
        this.advance()
      }

      while (this.isDigit(this.peek())) {
        this.advance()
      }
    }

    this.addToken(TokenType.NUMBER)
  }

  private string(quote: string): void {
    while (this.peek() !== quote && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++
        this.column = 1
      }
      if (this.peek() === '\\') {
        this.advance() // Skip escape character
      }
      this.advance()
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated string at line ${this.line}`)
    }

    this.advance() // Closing quote

    this.addToken(TokenType.STRING)
  }

  private templateString(): void {
    while (this.peek() !== '`' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++
        this.column = 1
      }
      if (this.peek() === '\\') {
        this.advance()
      }
      this.advance()
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated template string at line ${this.line}`)
    }

    this.advance() // Closing backtick

    this.addToken(TokenType.STRING)
  }

  private qubitLiteral(): void {
    // |ψ⟩ or |0⟩ or |1⟩ etc.
    this.start = this.current - 1 // Include the |

    while (this.peek() !== '⟩' && !this.isAtEnd()) {
      this.advance()
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated qubit literal at line ${this.line}`)
    }

    this.advance() // Closing ⟩

    this.addToken(TokenType.QUBIT_LITERAL)
  }

  private lineComment(): void {
    while (this.peek() !== '\n' && !this.isAtEnd()) {
      this.advance()
    }
    // Don't add comment tokens to output
  }

  private blockComment(): void {
    while (!(this.peek() === '*' && this.peekNext() === '/') && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++
        this.column = 1
      }
      this.advance()
    }

    if (this.isAtEnd()) {
      throw new Error(`Unterminated block comment at line ${this.line}`)
    }

    // Consume */
    this.advance()
    this.advance()
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source.charAt(this.current) !== expected) return false

    this.current++
    this.column++
    return true
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0'
    return this.source.charAt(this.current)
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0'
    return this.source.charAt(this.current + 1)
  }

  private advance(): string {
    const char = this.source.charAt(this.current)
    this.current++
    this.column++
    return char
  }

  private addToken(type: TokenType): void {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push({
      type,
      value: text,
      line: this.line,
      column: this.column - text.length,
      start: this.start,
      end: this.current,
    })
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9'
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$'
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c)
  }
}
