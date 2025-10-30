/**
 * NQRE EVOLVE Module
 * Self-modification, mutation, and evolutionary optimization
 */

import type {
  Organism,
  EvolvePolicy,
  MutationResult,
  MutationChange,
  DNA,
  Gene,
  Backup,
  PolicyTrigger,
  TriggerCondition,
  MutationProposal,
  LLMRequest,
  LLMResponse,
} from './types'

export class EvolveEngine {
  private policies: Map<string, EvolvePolicy> = new Map()
  private organism: Organism | null = null
  private llmProvider: LLMProvider | null = null

  constructor(llmProvider?: LLMProvider) {
    this.llmProvider = llmProvider || null
  }

  /**
   * Set the organism to evolve
   */
  setOrganism(organism: Organism): void {
    this.organism = organism
  }

  /**
   * Register evolution policy
   */
  registerPolicy(policy: EvolvePolicy): void {
    this.policies.set(policy.id, policy)
  }

  /**
   * Unregister evolution policy
   */
  unregisterPolicy(id: string): boolean {
    return this.policies.delete(id)
  }

  /**
   * Evaluate all policies and trigger if conditions met
   */
  async evaluateAll(): Promise<MutationResult[]> {
    if (!this.organism) {
      throw new Error('No organism set for evolution')
    }

    const results: MutationResult[] = []

    for (const [id, policy] of this.policies) {
      if (policy.enabled) {
        const shouldTrigger = await this.evaluateTrigger(policy.trigger)

        if (shouldTrigger) {
          console.log(`Evolution policy triggered: ${id}`)

          const result = await this.executePolicy(policy)
          results.push(result)

          policy.executionCount++
          policy.lastExecution = new Date()

          if (result.success) {
            policy.successCount++
          }
        }
      }
    }

    return results
  }

  /**
   * Execute specific policy
   */
  async executePolicy(policy: EvolvePolicy): Promise<MutationResult> {
    if (!this.organism) {
      throw new Error('No organism set for evolution')
    }

    try {
      // Create backup before evolution
      const backup = this.createBackup('pre_evolution')
      this.organism.backupHistory.push(backup)

      // Execute policy action
      const result = await policy.action.executor(this.organism, policy.params)

      // Check if rollback needed
      if (policy.rollback.enabled && !result.success) {
        console.warn('Evolution failed, rolling back...')
        await this.rollback(backup.id)
      }

      return result
    } catch (error) {
      console.error('Evolution error:', error)
      return {
        success: false,
        changes: [],
        previousDNA: this.organism.dna,
        newDNA: this.organism.dna,
        fitnessImprovement: 0,
        rollbackId: '',
      }
    }
  }

  /**
   * Evaluate trigger conditions
   */
  private async evaluateTrigger(trigger: PolicyTrigger): Promise<boolean> {
    if (!this.organism) return false

    const conditionResults = await Promise.all(
      trigger.conditions.map(c => this.evaluateCondition(c))
    )

    if (trigger.mode === 'all') {
      return conditionResults.every(r => r)
    } else {
      return conditionResults.some(r => r)
    }
  }

  /**
   * Evaluate single trigger condition
   */
  private async evaluateCondition(condition: TriggerCondition): Promise<boolean> {
    if (!this.organism) return false

    const value = this.getMetricValue(condition.metric)

    switch (condition.type) {
      case 'threshold':
      case 'comparison':
        return this.compareValues(value, condition.operator, condition.value)

      case 'llm_insight':
        // Check if recent LLM insights match condition
        return this.checkLLMInsight(condition)

      case 'time_based':
        return this.checkTimeBased(condition)

      case 'event_based':
        return this.checkEventBased(condition)

      default:
        return false
    }
  }

  /**
   * Get metric value from organism state
   */
  private getMetricValue(metric: string): any {
    if (!this.organism) return null

    const parts = metric.split('.')
    let value: any = this.organism

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part]
      } else {
        return null
      }
    }

    return value
  }

  /**
   * Compare values using operator
   */
  private compareValues(left: any, operator: string, right: any): boolean {
    switch (operator) {
      case '<':
        return left < right
      case '>':
        return left > right
      case '<=':
        return left <= right
      case '>=':
        return left >= right
      case '==':
        return left == right
      case '!=':
        return left != right
      default:
        return false
    }
  }

  /**
   * Check LLM insight condition
   */
  private checkLLMInsight(condition: TriggerCondition): boolean {
    // In production, check recent LLM insights
    return false
  }

  /**
   * Check time-based condition
   */
  private checkTimeBased(condition: TriggerCondition): boolean {
    // Check if enough time has passed
    return true
  }

  /**
   * Check event-based condition
   */
  private checkEventBased(condition: TriggerCondition): boolean {
    // Check if specific event occurred
    return false
  }

  /**
   * Create backup
   */
  private createBackup(reason: string): Backup {
    if (!this.organism) {
      throw new Error('No organism to backup')
    }

    return {
      id: `backup_${Date.now()}`,
      timestamp: new Date(),
      organism: JSON.parse(JSON.stringify(this.organism)),
      metadata: {
        reason,
        triggeredBy: 'evolution_engine',
        generation: this.organism.state.generation,
        performance: this.organism.state.performance,
      },
    }
  }

  /**
   * Rollback to backup
   */
  async rollback(backupId: string): Promise<void> {
    if (!this.organism) {
      throw new Error('No organism to rollback')
    }

    const backup = this.organism.backupHistory.find(b => b.id === backupId)
    if (!backup) {
      throw new Error(`Backup not found: ${backupId}`)
    }

    // Restore organism state
    Object.assign(this.organism, backup.organism)

    console.log(`Rolled back to backup: ${backupId}`)
  }

  /**
   * Request LLM-guided mutation proposal
   */
  async proposeMutation(context: MutationContext): Promise<MutationProposal> {
    if (!this.llmProvider) {
      throw new Error('No LLM provider configured')
    }

    const request: LLMRequest = {
      model: 'gemini-pro',
      prompt: this.buildMutationPrompt(context),
      context: {
        current_dna: context.currentDNA,
        current_state: context.currentState,
        history: context.history,
        goal: context.goal,
      },
      temperature: 0.7,
      maxTokens: 2000,
      grounding: true,
      outputFormat: {
        target: 'string',
        changes: 'object',
        rationale: 'string',
        expectedImprovement: 'number',
        risks: 'array',
        confidence: 'number',
      },
    }

    const response = await this.llmProvider.generate(request)

    // Parse LLM response into mutation proposal
    return this.parseMutationProposal(response)
  }

  /**
   * Build mutation prompt for LLM
   */
  private buildMutationPrompt(context: MutationContext): string {
    return `
You are a quantum computing optimization expert. Analyze the current organism state and propose a mutation to improve performance.

Current State:
- Coherence: ${context.currentState.coherence}
- Fidelity: ${context.currentState.fidelity}
- Generation: ${context.currentState.generation}
- Wasserstein Cost: ${context.currentState.wasserstein_cost}

Current DNA Configuration:
${JSON.stringify(context.currentDNA, null, 2)}

Performance History (last 5 entries):
${JSON.stringify(context.history, null, 2)}

Goal: ${context.goal}

Constraints:
${JSON.stringify(context.constraints, null, 2)}

Based on this data, propose a mutation to improve ${context.goal}. Your proposal should include:
1. Target component to modify (DNA parameter, gene parameter, circuit structure)
2. Specific changes to make
3. Rationale for the changes
4. Expected improvement (0-1)
5. Potential risks
6. Confidence level (0-1)

Provide your response in JSON format matching the output schema.
    `.trim()
  }

  /**
   * Parse LLM response into mutation proposal
   */
  private parseMutationProposal(response: LLMResponse): MutationProposal {
    try {
      const parsed = JSON.parse(response.content)

      return {
        target: parsed.target || 'DNA.evolution.rate',
        changes: parsed.changes || {},
        rationale: parsed.rationale || 'No rationale provided',
        expectedImprovement: parsed.expectedImprovement || 0.1,
        risks: parsed.risks || [],
        confidence: parsed.confidence || 0.5,
      }
    } catch (error) {
      // Fallback if parsing fails
      return {
        target: 'DNA.evolution.rate',
        changes: { rate: 0.15 },
        rationale: 'Fallback mutation: increase evolution rate',
        expectedImprovement: 0.05,
        risks: ['Potential instability'],
        confidence: 0.3,
      }
    }
  }

  /**
   * Apply mutation to organism
   */
  async applyMutation(proposal: MutationProposal): Promise<MutationResult> {
    if (!this.organism) {
      throw new Error('No organism to mutate')
    }

    const previousDNA = JSON.parse(JSON.stringify(this.organism.dna))
    const changes: MutationChange[] = []

    try {
      // Apply changes based on target
      const targetParts = proposal.target.split('.')

      if (targetParts[0] === 'DNA') {
        // Mutate DNA
        this.applyDNAChanges(targetParts.slice(1), proposal.changes, changes)
      } else if (targetParts[0] === 'GENE') {
        // Mutate Gene
        const geneName = targetParts[1]
        this.applyGeneChanges(geneName, proposal.changes, changes)
      }

      // Compute fitness improvement
      const fitnessImprovement = await this.computeFitnessImprovement()

      return {
        success: true,
        changes,
        previousDNA,
        newDNA: this.organism.dna,
        fitnessImprovement,
        rollbackId: this.organism.backupHistory[this.organism.backupHistory.length - 1]?.id || '',
      }
    } catch (error) {
      // Restore previous DNA on error
      this.organism.dna = previousDNA

      return {
        success: false,
        changes,
        previousDNA,
        newDNA: previousDNA,
        fitnessImprovement: 0,
        rollbackId: '',
      }
    }
  }

  /**
   * Apply DNA changes
   */
  private applyDNAChanges(
    path: string[],
    changes: Record<string, any>,
    changeLog: MutationChange[]
  ): void {
    if (!this.organism) return

    let target: any = this.organism.dna

    // Navigate to target
    for (let i = 0; i < path.length - 1; i++) {
      target = target[path[i]]
    }

    const finalKey = path[path.length - 1]

    // Apply changes
    for (const [key, value] of Object.entries(changes)) {
      const oldValue = target[finalKey][key]

      changeLog.push({
        target: `DNA.${path.join('.')}.${key}`,
        type: 'parameter',
        oldValue,
        newValue: value,
        rationale: 'LLM-proposed mutation',
      })

      target[finalKey][key] = value
    }
  }

  /**
   * Apply gene changes
   */
  private applyGeneChanges(
    geneName: string,
    changes: Record<string, any>,
    changeLog: MutationChange[]
  ): void {
    if (!this.organism) return

    const gene = this.organism.genes.get(geneName)
    if (!gene) {
      throw new Error(`Gene not found: ${geneName}`)
    }

    for (const [key, value] of Object.entries(changes)) {
      const oldValue = (gene as any)[key]

      changeLog.push({
        target: `GENE.${geneName}.${key}`,
        type: 'parameter',
        oldValue,
        newValue: value,
        rationale: 'LLM-proposed mutation',
      })

      ;(gene as any)[key] = value
    }
  }

  /**
   * Compute fitness improvement
   */
  private async computeFitnessImprovement(): Promise<number> {
    // In production, run experiments to measure actual improvement
    // For now, return simulated improvement
    return Math.random() * 0.2 - 0.05 // -5% to +15%
  }
}

export interface MutationContext {
  currentDNA: DNA
  currentState: any
  history: any[]
  goal: string
  constraints: Record<string, any>
}

// ============================================================
// LLM Provider Interface
// ============================================================

export interface LLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>
}

// ============================================================
// Mutation Operators
// ============================================================

export class MutationOperators {
  /**
   * Gaussian mutation
   */
  static gaussianMutation(value: number, rate: number, bounds?: [number, number]): number {
    const noise = this.gaussian(0, rate)
    let mutated = value + noise

    if (bounds) {
      mutated = Math.max(bounds[0], Math.min(bounds[1], mutated))
    }

    return mutated
  }

  /**
   * Uniform mutation
   */
  static uniformMutation(value: number, range: number, bounds?: [number, number]): number {
    const noise = (Math.random() - 0.5) * range
    let mutated = value + noise

    if (bounds) {
      mutated = Math.max(bounds[0], Math.min(bounds[1], mutated))
    }

    return mutated
  }

  /**
   * Polynomial mutation
   */
  static polynomialMutation(
    value: number,
    rate: number,
    bounds: [number, number],
    eta: number = 20
  ): number {
    const [lower, upper] = bounds
    const delta1 = (value - lower) / (upper - lower)
    const delta2 = (upper - value) / (upper - lower)

    const rand = Math.random()
    let deltaq: number

    if (rand < 0.5) {
      const xy = 1 - delta1
      const val = 2 * rand + (1 - 2 * rand) * Math.pow(xy, eta + 1)
      deltaq = Math.pow(val, 1 / (eta + 1)) - 1
    } else {
      const xy = 1 - delta2
      const val = 2 * (1 - rand) + 2 * (rand - 0.5) * Math.pow(xy, eta + 1)
      deltaq = 1 - Math.pow(val, 1 / (eta + 1))
    }

    const mutated = value + deltaq * (upper - lower)

    return Math.max(lower, Math.min(upper, mutated))
  }

  /**
   * Generate Gaussian random number
   */
  private static gaussian(mean: number, stdDev: number): number {
    // Box-Muller transform
    const u1 = Math.random()
    const u2 = Math.random()

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

    return mean + z0 * stdDev
  }
}

// ============================================================
// Crossover Operators
// ============================================================

export class CrossoverOperators {
  /**
   * Single-point crossover
   */
  static singlePoint<T>(parent1: T[], parent2: T[]): [T[], T[]] {
    const point = Math.floor(Math.random() * Math.min(parent1.length, parent2.length))

    const offspring1 = [...parent1.slice(0, point), ...parent2.slice(point)]
    const offspring2 = [...parent2.slice(0, point), ...parent1.slice(point)]

    return [offspring1, offspring2]
  }

  /**
   * Two-point crossover
   */
  static twoPoint<T>(parent1: T[], parent2: T[]): [T[], T[]] {
    const len = Math.min(parent1.length, parent2.length)
    const point1 = Math.floor(Math.random() * len)
    const point2 = Math.floor(Math.random() * len)

    const [start, end] = point1 < point2 ? [point1, point2] : [point2, point1]

    const offspring1 = [
      ...parent1.slice(0, start),
      ...parent2.slice(start, end),
      ...parent1.slice(end),
    ]

    const offspring2 = [
      ...parent2.slice(0, start),
      ...parent1.slice(start, end),
      ...parent2.slice(end),
    ]

    return [offspring1, offspring2]
  }

  /**
   * Uniform crossover
   */
  static uniform<T>(parent1: T[], parent2: T[]): [T[], T[]] {
    const len = Math.min(parent1.length, parent2.length)
    const offspring1: T[] = []
    const offspring2: T[] = []

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        offspring1.push(parent1[i])
        offspring2.push(parent2[i])
      } else {
        offspring1.push(parent2[i])
        offspring2.push(parent1[i])
      }
    }

    return [offspring1, offspring2]
  }

  /**
   * Arithmetic crossover (for numeric arrays)
   */
  static arithmetic(parent1: number[], parent2: number[], alpha: number = 0.5): [number[], number[]] {
    const offspring1 = parent1.map((val, i) => alpha * val + (1 - alpha) * parent2[i])
    const offspring2 = parent2.map((val, i) => alpha * val + (1 - alpha) * parent1[i])

    return [offspring1, offspring2]
  }
}
