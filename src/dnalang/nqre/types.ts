/**
 * NQRE Core Types
 * Type definitions for the Negentropic Quantum Research Engine
 */

// ============================================================
// Core NQRE Types
// ============================================================

export interface Organism {
  id: string
  domain: string
  version: string
  state: OrganismState
  dna: DNA
  genes: Map<string, Gene>
  workflows: Map<string, Workflow>
  policies: Map<string, EvolvePolicy>
  senseModules: Map<string, SenseModule>
  actModules: Map<string, ActModule>
  backupHistory: Backup[]
}

export interface OrganismState {
  coherence: number
  fidelity: number
  negentropy: number
  generation: number
  bestCircuit: QuantumCircuit | null
  wasserstein_cost: number
  history: Metric[]
  lastUpdate: Date
  performance: PerformanceMetrics
}

export interface DNA {
  evolution: EvolutionConfig
  quantum: QuantumConfig
  learning: LearningConfig
  targets: TargetConfig
  monitoring: MonitoringConfig
}

export interface EvolutionConfig {
  rate: number
  strategy: 'gradient_based' | 'genetic' | 'hybrid'
  mutation_probability: number
  mutation_threshold: number
  crossover_probability: number
  max_generations: number
}

export interface QuantumConfig {
  backend: string
  target_coherence: number
  error_threshold: number
  qubit_count: number
  optimization_level: number
  shots: number
}

export interface LearningConfig {
  llm_model: string
  insight_threshold: 'low' | 'medium' | 'high' | 'critical'
  documentation_mode: 'manual' | 'auto' | 'hybrid'
  grounding: boolean
  temperature: number
  max_tokens: number
}

export interface TargetConfig {
  max_execution_time: number
  min_success_rate: number
  negentropy_goal: number
  min_coherence: number
}

export interface MonitoringConfig {
  log_level: 'debug' | 'info' | 'warn' | 'error'
  telemetry_enabled: boolean
  metrics_interval: number
  export_format: 'json' | 'csv' | 'parquet'
}

// ============================================================
// Gene Types
// ============================================================

export interface Gene {
  id: string
  name: string
  description: string
  version: string
  inputs: Record<string, any>
  outputs: Record<string, any>
  params: Record<string, any>
  functions: Map<string, GeneFunction>
  fitness: number
  metadata: GeneMetadata
}

export interface GeneFunction {
  name: string
  params: FunctionParam[]
  returnType: string
  body: string
  isAsync: boolean
}

export interface FunctionParam {
  name: string
  type: string
  defaultValue?: any
  required: boolean
}

export interface GeneMetadata {
  author: string
  created: Date
  lastModified: Date
  tags: string[]
  documentation: string
}

// ============================================================
// Workflow Types
// ============================================================

export interface Workflow {
  id: string
  description: string
  steps: WorkflowStep[]
  state: WorkflowState
  dependencies: string[]
}

export interface WorkflowStep {
  id: string
  type: 'sense' | 'act' | 'evolve' | 'function'
  target: string
  params: Record<string, any>
  condition?: string
  retry: RetryConfig
}

export interface WorkflowState {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed'
  currentStep: number
  startTime: Date | null
  endTime: Date | null
  error: Error | null
}

export interface RetryConfig {
  maxRetries: number
  backoff: 'linear' | 'exponential'
  initialDelay: number
}

// ============================================================
// SENSE Types
// ============================================================

export interface SenseModule {
  id: string
  type: 'monitor' | 'diagnose' | 'analyze'
  target: string
  interval: number
  enabled: boolean
  callback: SenseCallback
}

export type SenseCallback = () => Promise<Metric>

export interface Metric {
  timestamp: Date
  name: string
  value: number
  unit: string
  tags: Record<string, string>
  metadata: Record<string, any>
}

export interface DiagnosticResult {
  severity: 'low' | 'medium' | 'high' | 'critical'
  diagnosis: string
  recommendations: string[]
  affectedComponents: string[]
  estimatedImpact: number
  proposedActions: ProposedAction[]
}

export interface ProposedAction {
  type: 'parameter_adjustment' | 'circuit_modification' | 'gene_replacement' | 'policy_trigger'
  target: string
  changes: Record<string, any>
  priority: number
  estimatedBenefit: number
}

// ============================================================
// ACT Types
// ============================================================

export interface ActModule {
  id: string
  type: 'experiment' | 'optimization' | 'deployment' | 'publication'
  target: string
  enabled: boolean
  callback: ActCallback
}

export type ActCallback = (params: any) => Promise<ActResult>

export interface ActResult {
  success: boolean
  data: any
  metrics: Metric[]
  error: Error | null
  executionTime: number
}

export interface ExperimentResult {
  success: boolean
  circuit: QuantumCircuit
  measurements: Measurement[]
  fidelity: number
  coherence: number
  errorRate: number
  executionTime: number
  backend: string
  jobId: string
}

export interface Measurement {
  qubits: number[]
  results: MeasurementResult[]
  shots: number
  timestamp: Date
}

export interface MeasurementResult {
  bitstring: string
  count: number
  probability: number
}

// ============================================================
// EVOLVE Types
// ============================================================

export interface EvolvePolicy {
  id: string
  description: string
  trigger: PolicyTrigger
  action: PolicyAction
  rollback: PolicyRollback
  params: Record<string, any>
  enabled: boolean
  executionCount: number
  successCount: number
  lastExecution: Date | null
}

export interface PolicyTrigger {
  conditions: TriggerCondition[]
  mode: 'all' | 'any'
}

export interface TriggerCondition {
  type: 'threshold' | 'comparison' | 'llm_insight' | 'time_based' | 'event_based'
  metric: string
  operator: '<' | '>' | '<=' | '>=' | '==' | '!='
  value: any
  window?: number
}

export interface PolicyAction {
  type: 'mutation' | 'optimization' | 'replacement' | 'rollback'
  target: string
  executor: PolicyExecutor
  params: Record<string, any>
  isAsync: boolean
}

export type PolicyExecutor = (organism: Organism, params: any) => Promise<MutationResult>

export interface PolicyRollback {
  enabled: boolean
  condition: string
  action: () => Promise<void>
}

export interface MutationResult {
  success: boolean
  changes: MutationChange[]
  previousDNA: DNA
  newDNA: DNA
  fitnessImprovement: number
  rollbackId: string
}

export interface MutationChange {
  target: string
  type: 'parameter' | 'structure' | 'replacement'
  oldValue: any
  newValue: any
  rationale: string
}

// ============================================================
// Quantum Types
// ============================================================

export interface QuantumCircuit {
  id: string
  name: string
  qubits: number
  gates: QuantumGate[]
  measurements: QubitMeasurement[]
  parameters: CircuitParameter[]
  depth: number
  metadata: CircuitMetadata
}

export interface QuantumGate {
  type: string
  qubits: number[]
  parameters: number[]
  condition?: string
}

export interface QubitMeasurement {
  qubit: number
  classical: number
}

export interface CircuitParameter {
  name: string
  value: number
  bounds: [number, number]
  trainable: boolean
}

export interface CircuitMetadata {
  created: Date
  lastModified: Date
  author: string
  description: string
  tags: string[]
}

export interface QuantumState {
  dimension: number
  amplitudes: ComplexNumber[]
  basis: string
  normalized: boolean
}

export interface ComplexNumber {
  real: number
  imaginary: number
}

export interface DensityMatrix {
  dimension: number
  elements: ComplexNumber[][]
  trace: number
  purity: number
}

// ============================================================
// LLM Types
// ============================================================

export interface LLMRequest {
  model: string
  prompt: string
  context?: Record<string, any>
  temperature?: number
  maxTokens?: number
  grounding?: boolean
  outputFormat?: string | Record<string, any>
}

export interface LLMResponse {
  content: string
  model: string
  usage: TokenUsage
  finishReason: string
  metadata: Record<string, any>
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface LLMInsight {
  severity: 'low' | 'medium' | 'high' | 'critical'
  summary: string
  analysis: string
  recommendations: string[]
  confidence: number
  sources: string[]
}

export interface MutationProposal {
  target: string
  changes: Record<string, any>
  rationale: string
  expectedImprovement: number
  risks: string[]
  confidence: number
}

// ============================================================
// Backup Types
// ============================================================

export interface Backup {
  id: string
  timestamp: Date
  organism: Partial<Organism>
  metadata: BackupMetadata
}

export interface BackupMetadata {
  reason: string
  triggeredBy: string
  generation: number
  performance: PerformanceMetrics
}

// ============================================================
// Performance Types
// ============================================================

export interface PerformanceMetrics {
  coherence: number
  fidelity: number
  negentropy: number
  successRate: number
  averageExecutionTime: number
  errorRate: number
  efficiency: number
}

export interface WassersteinCost {
  value: number
  optimal: boolean
  gradient: number[]
  iterations: number
}

// ============================================================
// Telemetry Types
// ============================================================

export interface TelemetryEvent {
  timestamp: Date
  level: 'debug' | 'info' | 'warn' | 'error'
  category: string
  message: string
  data: Record<string, any>
  tags: string[]
}

export interface TraceSpan {
  id: string
  name: string
  startTime: Date
  endTime: Date | null
  duration: number | null
  attributes: Record<string, any>
  events: TelemetryEvent[]
}

// ============================================================
// Utility Types
// ============================================================

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E }

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

export interface Validator<T> {
  validate(value: unknown): value is T
  errors(): string[]
}

export interface Serializable {
  serialize(): string
  deserialize(data: string): this
}
