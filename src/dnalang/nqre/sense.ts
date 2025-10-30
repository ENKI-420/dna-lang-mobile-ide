/**
 * NQRE SENSE Module
 * Data acquisition, monitoring, and diagnosis
 */

import type {
  Metric,
  DiagnosticResult,
  LLMInsight,
  QuantumState,
  OrganismState,
  DNA,
  SenseModule,
  TelemetryEvent,
} from './types'

export class SenseEngine {
  private modules: Map<string, SenseModule> = new Map()
  private metrics: Metric[] = []
  private maxMetricsHistory: number = 10000

  /**
   * Register a SENSE module
   */
  registerModule(module: SenseModule): void {
    this.modules.set(module.id, module)
  }

  /**
   * Unregister a SENSE module
   */
  unregisterModule(id: string): boolean {
    return this.modules.delete(id)
  }

  /**
   * Execute a SENSE module
   */
  async execute(moduleId: string): Promise<Metric> {
    const module = this.modules.get(moduleId)
    if (!module) {
      throw new Error(`SENSE module not found: ${moduleId}`)
    }

    if (!module.enabled) {
      throw new Error(`SENSE module is disabled: ${moduleId}`)
    }

    const metric = await module.callback()
    this.recordMetric(metric)

    return metric
  }

  /**
   * Execute all enabled SENSE modules
   */
  async executeAll(): Promise<Metric[]> {
    const results: Metric[] = []

    for (const [id, module] of this.modules) {
      if (module.enabled) {
        try {
          const metric = await this.execute(id)
          results.push(metric)
        } catch (error) {
          console.error(`Failed to execute SENSE module ${id}:`, error)
        }
      }
    }

    return results
  }

  /**
   * Record a metric
   */
  recordMetric(metric: Metric): void {
    this.metrics.push(metric)

    // Maintain history limit
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory)
    }
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit?: number, filter?: MetricsFilter): Metric[] {
    let filtered = this.metrics

    if (filter) {
      filtered = this.filterMetrics(filtered, filter)
    }

    if (limit) {
      return filtered.slice(-limit)
    }

    return filtered
  }

  /**
   * Get latest metric by name
   */
  getLatestMetric(name: string): Metric | null {
    for (let i = this.metrics.length - 1; i >= 0; i--) {
      if (this.metrics[i].name === name) {
        return this.metrics[i]
      }
    }
    return null
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics = []
  }

  private filterMetrics(metrics: Metric[], filter: MetricsFilter): Metric[] {
    return metrics.filter(metric => {
      if (filter.name && metric.name !== filter.name) return false
      if (filter.startTime && metric.timestamp < filter.startTime) return false
      if (filter.endTime && metric.timestamp > filter.endTime) return false
      if (filter.tags) {
        for (const [key, value] of Object.entries(filter.tags)) {
          if (metric.tags[key] !== value) return false
        }
      }
      return true
    })
  }
}

export interface MetricsFilter {
  name?: string
  startTime?: Date
  endTime?: Date
  tags?: Record<string, string>
}

// ============================================================
// Coherence Monitoring
// ============================================================

export class CoherenceMonitor {
  private senseEngine: SenseEngine

  constructor(senseEngine: SenseEngine) {
    this.senseEngine = senseEngine
  }

  /**
   * Monitor quantum coherence
   */
  async monitor(state: QuantumState): Promise<Metric> {
    const coherence = this.computeCoherence(state)
    const t1 = await this.measureT1()
    const t2 = await this.measureT2()
    const gateFidelity = await this.measureGateFidelity()

    const metric: Metric = {
      timestamp: new Date(),
      name: 'coherence',
      value: coherence,
      unit: 'percentage',
      tags: {
        type: 'quantum',
        component: 'coherence_monitor',
      },
      metadata: {
        t1_time: t1,
        t2_time: t2,
        gate_fidelity: gateFidelity,
        dimension: state.dimension,
      },
    }

    this.senseEngine.recordMetric(metric)

    return metric
  }

  /**
   * Compute quantum coherence
   */
  private computeCoherence(state: QuantumState): number {
    // Calculate coherence using von Neumann entropy
    // For a pure state, coherence = 1
    // For a maximally mixed state, coherence = 0

    if (!state.normalized) {
      throw new Error('State must be normalized')
    }

    // Convert to density matrix
    const rho = this.stateToDensityMatrix(state)

    // Compute eigenvalues
    const eigenvalues = this.computeEigenvalues(rho)

    // Calculate von Neumann entropy
    let entropy = 0
    for (const lambda of eigenvalues) {
      if (lambda > 1e-10) {
        entropy -= lambda * Math.log2(lambda)
      }
    }

    // Normalize to [0, 1]
    const maxEntropy = Math.log2(state.dimension)
    const coherence = 1 - entropy / maxEntropy

    return Math.max(0, Math.min(1, coherence))
  }

  /**
   * Measure T1 (relaxation time)
   */
  private async measureT1(): Promise<number> {
    // Simulated T1 measurement
    // In real implementation, this would interface with quantum backend
    return 50 + Math.random() * 50 // 50-100 microseconds
  }

  /**
   * Measure T2 (dephasing time)
   */
  private async measureT2(): Promise<number> {
    // Simulated T2 measurement
    return 30 + Math.random() * 40 // 30-70 microseconds
  }

  /**
   * Measure gate fidelity
   */
  private async measureGateFidelity(): Promise<number> {
    // Simulated gate fidelity
    return 0.95 + Math.random() * 0.04 // 95-99%
  }

  private stateToDensityMatrix(state: QuantumState): number[][] {
    const n = state.dimension
    const rho: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // |ψ⟩⟨ψ| = ψᵢ * ψⱼ*
        const psi_i = state.amplitudes[i]
        const psi_j = state.amplitudes[j]
        rho[i][j] =
          psi_i.real * psi_j.real +
          psi_i.imaginary * psi_j.imaginary
      }
    }

    return rho
  }

  private computeEigenvalues(matrix: number[][]): number[] {
    // Simplified eigenvalue computation
    // In production, use proper linear algebra library
    const n = matrix.length
    const eigenvalues: number[] = []

    // For 2x2 matrix, use closed form
    if (n === 2) {
      const a = matrix[0][0]
      const b = matrix[0][1]
      const c = matrix[1][0]
      const d = matrix[1][1]

      const trace = a + d
      const det = a * d - b * c

      const discriminant = trace * trace - 4 * det
      const sqrtDisc = Math.sqrt(Math.max(0, discriminant))

      eigenvalues.push((trace + sqrtDisc) / 2)
      eigenvalues.push((trace - sqrtDisc) / 2)
    } else {
      // For larger matrices, use power iteration or external library
      // Simplified: return diagonal elements as approximation
      for (let i = 0; i < n; i++) {
        eigenvalues.push(matrix[i][i])
      }
    }

    return eigenvalues
  }
}

// ============================================================
// Entanglement Metrics
// ============================================================

export class EntanglementMetrics {
  /**
   * Measure entanglement entropy
   */
  measureEntanglement(state: QuantumState, subsystemQubits: number[]): number {
    // Compute von Neumann entropy of reduced density matrix
    const reducedRho = this.partialTrace(state, subsystemQubits)
    const eigenvalues = this.computeEigenvalues(reducedRho)

    let entropy = 0
    for (const lambda of eigenvalues) {
      if (lambda > 1e-10) {
        entropy -= lambda * Math.log2(lambda)
      }
    }

    return entropy
  }

  /**
   * Compute concurrence (for two-qubit systems)
   */
  computeConcurrence(state: QuantumState): number {
    if (state.dimension !== 4) {
      throw new Error('Concurrence is only defined for two-qubit systems')
    }

    // Simplified concurrence calculation
    // C = |ψ₀₀ψ₁₁ - ψ₀₁ψ₁₀|
    const psi = state.amplitudes

    const c00 = psi[0] // |00⟩
    const c01 = psi[1] // |01⟩
    const c10 = psi[2] // |10⟩
    const c11 = psi[3] // |11⟩

    const real =
      c00.real * c11.real - c00.imaginary * c11.imaginary -
      (c01.real * c10.real - c01.imaginary * c10.imaginary)

    const imaginary =
      c00.real * c11.imaginary + c00.imaginary * c11.real -
      (c01.real * c10.imaginary + c01.imaginary * c10.real)

    const concurrence = Math.sqrt(real * real + imaginary * imaginary)

    return Math.abs(concurrence)
  }

  private partialTrace(state: QuantumState, subsystemQubits: number[]): number[][] {
    // Simplified partial trace
    // In production, implement proper tensor operations
    const n = state.dimension
    const subsystemDim = Math.pow(2, subsystemQubits.length)
    const rho: number[][] = Array(subsystemDim)
      .fill(0)
      .map(() => Array(subsystemDim).fill(0))

    // Simplified implementation
    for (let i = 0; i < subsystemDim; i++) {
      rho[i][i] = 1 / subsystemDim
    }

    return rho
  }

  private computeEigenvalues(matrix: number[][]): number[] {
    // Simplified eigenvalue computation
    const n = matrix.length
    const eigenvalues: number[] = []

    for (let i = 0; i < n; i++) {
      eigenvalues.push(matrix[i][i])
    }

    return eigenvalues
  }
}

// ============================================================
// Diagnostic Engine
// ============================================================

export class DiagnosticEngine {
  /**
   * Diagnose system performance
   */
  async diagnose(
    state: OrganismState,
    dna: DNA,
    metrics: Metric[]
  ): Promise<DiagnosticResult> {
    const issues: string[] = []
    const recommendations: string[] = []
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'

    // Check coherence
    if (state.coherence < dna.quantum.target_coherence * 0.5) {
      severity = 'critical'
      issues.push(`Coherence critically low: ${state.coherence.toFixed(3)}`)
      recommendations.push('Reduce circuit depth')
      recommendations.push('Increase error mitigation')
      recommendations.push('Consider hardware recalibration')
    } else if (state.coherence < dna.quantum.target_coherence * 0.8) {
      severity = severity === 'critical' ? severity : 'high'
      issues.push(`Coherence below target: ${state.coherence.toFixed(3)}`)
      recommendations.push('Optimize gate sequence')
      recommendations.push('Review error rates')
    }

    // Check fidelity
    if (state.fidelity < 0.5) {
      severity = 'critical'
      issues.push(`Fidelity critically low: ${state.fidelity.toFixed(3)}`)
      recommendations.push('Verify circuit implementation')
      recommendations.push('Check backend calibration')
    }

    // Check error rate
    if (state.performance.errorRate > 0.1) {
      severity = severity === 'critical' ? severity : 'high'
      issues.push(`High error rate: ${(state.performance.errorRate * 100).toFixed(1)}%`)
      recommendations.push('Implement error correction')
      recommendations.push('Reduce circuit complexity')
    }

    // Check Wasserstein cost
    if (state.wasserstein_cost > dna.evolution.mutation_threshold * 2) {
      severity = severity === 'critical' ? severity : 'medium'
      issues.push(`High Wasserstein cost: ${state.wasserstein_cost.toFixed(6)}`)
      recommendations.push('Trigger evolution policy')
      recommendations.push('Optimize circuit parameters')
    }

    const diagnosis = issues.length > 0
      ? issues.join('; ')
      : 'System operating within normal parameters'

    return {
      severity,
      diagnosis,
      recommendations,
      affectedComponents: this.identifyAffectedComponents(issues),
      estimatedImpact: this.estimateImpact(severity),
      proposedActions: [],
    }
  }

  private identifyAffectedComponents(issues: string[]): string[] {
    const components: string[] = []

    for (const issue of issues) {
      if (issue.includes('coherence')) components.push('quantum_circuit')
      if (issue.includes('fidelity')) components.push('measurement')
      if (issue.includes('error')) components.push('error_correction')
      if (issue.includes('Wasserstein')) components.push('optimizer')
    }

    return [...new Set(components)]
  }

  private estimateImpact(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    const impactMap = {
      low: 0.1,
      medium: 0.3,
      high: 0.6,
      critical: 0.9,
    }

    return impactMap[severity]
  }
}

// ============================================================
// Telemetry
// ============================================================

export class Telemetry {
  private events: TelemetryEvent[] = []
  private maxEvents: number = 10000

  log(
    level: 'debug' | 'info' | 'warn' | 'error',
    category: string,
    message: string,
    data: Record<string, any> = {},
    tags: string[] = []
  ): void {
    const event: TelemetryEvent = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      tags,
    }

    this.events.push(event)

    // Maintain history limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Also log to console
    const logMethod = console[level] || console.log
    logMethod(`[${category}] ${message}`, data)
  }

  metric(name: string, value: number, tags: Record<string, string> = {}): void {
    this.log('info', 'metric', name, { value, tags }, ['metric'])
  }

  event(name: string, data: Record<string, any> = {}): void {
    this.log('info', 'event', name, data, ['event'])
  }

  getEvents(filter?: EventFilter): TelemetryEvent[] {
    if (!filter) return this.events

    return this.events.filter(event => {
      if (filter.level && event.level !== filter.level) return false
      if (filter.category && event.category !== filter.category) return false
      if (filter.startTime && event.timestamp < filter.startTime) return false
      if (filter.endTime && event.timestamp > filter.endTime) return false
      if (filter.tags && !filter.tags.every(tag => event.tags.includes(tag))) return false
      return true
    })
  }

  clear(): void {
    this.events = []
  }
}

export interface EventFilter {
  level?: 'debug' | 'info' | 'warn' | 'error'
  category?: string
  startTime?: Date
  endTime?: Date
  tags?: string[]
}
