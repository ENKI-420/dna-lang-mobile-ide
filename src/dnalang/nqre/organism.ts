/**
 * NQRE Organism Runtime
 * Main runtime for DNA-Lang organisms
 */

import type { Organism, DNA, Gene, Workflow, EvolvePolicy, QuantumCircuit } from './types'
import { SenseEngine, CoherenceMonitor, DiagnosticEngine, Telemetry } from './sense'
import { ActEngine, QuantumExperiment, CircuitOptimizer, SimulatedQuantumBackend } from './act'
import { EvolveEngine, LLMProvider, MutationContext } from './evolve'

export class OrganismRuntime {
  private organism: Organism
  private senseEngine: SenseEngine
  private actEngine: ActEngine
  private evolveEngine: EvolveEngine
  private telemetry: Telemetry
  private coherenceMonitor: CoherenceMonitor
  private diagnosticEngine: DiagnosticEngine
  private circuitOptimizer: CircuitOptimizer
  private quantumBackend: SimulatedQuantumBackend
  private isRunning: boolean = false
  private loopInterval: number = 1000 // ms

  constructor(organism: Organism, llmProvider?: LLMProvider) {
    this.organism = organism
    this.senseEngine = new SenseEngine()
    this.actEngine = new ActEngine()
    this.evolveEngine = new EvolveEngine(llmProvider)
    this.telemetry = new Telemetry()
    this.coherenceMonitor = new CoherenceMonitor(this.senseEngine)
    this.diagnosticEngine = new DiagnosticEngine()
    this.circuitOptimizer = new CircuitOptimizer()
    this.quantumBackend = new SimulatedQuantumBackend()

    // Set organism in evolve engine
    this.evolveEngine.setOrganism(organism)

    // Initialize modules
    this.initializeModules()
  }

  /**
   * Initialize SENSE, ACT, and EVOLVE modules
   */
  private initializeModules(): void {
    // Register SENSE modules from organism
    for (const [id, senseModule] of this.organism.senseModules) {
      this.senseEngine.registerModule(senseModule)
    }

    // Register ACT modules from organism
    for (const [id, actModule] of this.organism.actModules) {
      this.actEngine.registerModule(actModule)
    }

    // Register EVOLVE policies from organism
    for (const [id, policy] of this.organism.policies) {
      this.evolveEngine.registerPolicy(policy)
    }
  }

  /**
   * Start the organism's main loop
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Organism is already running')
      return
    }

    this.isRunning = true

    this.telemetry.log('info', 'organism', 'Organism starting', {
      id: this.organism.id,
      domain: this.organism.domain,
      version: this.organism.version,
    })

    // Initialize quantum backend
    await this.quantumBackend.initialize({})

    // Start main loop
    this.mainLoop()
  }

  /**
   * Stop the organism
   */
  stop(): void {
    this.isRunning = false

    this.telemetry.log('info', 'organism', 'Organism stopped', {
      id: this.organism.id,
      generation: this.organism.state.generation,
      final_coherence: this.organism.state.coherence,
    })
  }

  /**
   * Main research loop
   * Implements the SENSE-ACT-EVOLVE cycle
   */
  private async mainLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.executeCycle()
      } catch (error) {
        this.telemetry.log('error', 'organism', 'Cycle error', { error })
      }

      // Wait before next cycle
      await this.sleep(this.loopInterval)
    }
  }

  /**
   * Execute one SENSE-ACT-EVOLVE cycle
   */
  async executeCycle(): Promise<void> {
    // ========================================
    // SENSE: Monitor and diagnose
    // ========================================
    const metrics = await this.sensePhase()

    // ========================================
    // ACT: Execute experiments
    // ========================================
    const actResult = await this.actPhase()

    // ========================================
    // EVOLVE: Self-improvement
    // ========================================
    await this.evolvePhase(metrics)

    // Update organism state
    this.updateState(metrics, actResult)
  }

  /**
   * SENSE phase
   */
  private async sensePhase(): Promise<any[]> {
    this.telemetry.log('debug', 'sense', 'Starting SENSE phase')

    const metrics = await this.senseEngine.executeAll()

    // Check if diagnosis needed
    const coherenceMetric = this.senseEngine.getLatestMetric('coherence')
    if (coherenceMetric && coherenceMetric.value < this.organism.dna.quantum.target_coherence * 0.9) {
      const diagnosis = await this.diagnosticEngine.diagnose(
        this.organism.state,
        this.organism.dna,
        this.senseEngine.getMetricsHistory(10)
      )

      this.telemetry.log('warn', 'diagnosis', 'Performance issue detected', {
        severity: diagnosis.severity,
        diagnosis: diagnosis.diagnosis,
      })

      if (diagnosis.severity === 'critical') {
        // Trigger evolution
        this.telemetry.event('critical_diagnosis', { diagnosis })
      }
    }

    return metrics
  }

  /**
   * ACT phase
   */
  private async actPhase(): Promise<any> {
    this.telemetry.log('debug', 'act', 'Starting ACT phase')

    // Get or create quantum circuit
    let circuit = this.organism.state.bestCircuit

    if (!circuit) {
      circuit = this.generateRandomCircuit()
    }

    // Optimize circuit
    const optimized = this.circuitOptimizer.optimize(circuit, 'wasserstein')

    // Run experiment
    const experiment = new QuantumExperiment(this.quantumBackend)
    const result = await experiment.run(optimized, this.organism.dna.quantum.shots)

    this.telemetry.metric('experiment_coherence', result.coherence)
    this.telemetry.metric('experiment_fidelity', result.fidelity)

    // Update best circuit if improved
    if (result.coherence > this.organism.state.coherence) {
      this.organism.state.bestCircuit = optimized
      this.organism.state.coherence = result.coherence
      this.organism.state.fidelity = result.fidelity

      this.telemetry.log('info', 'act', 'New best circuit found', {
        coherence: result.coherence,
        fidelity: result.fidelity,
        generation: this.organism.state.generation,
      })

      // Check if discovery-worthy
      if (result.coherence > this.organism.dna.quantum.target_coherence) {
        this.telemetry.event('discovery', {
          coherence: result.coherence,
          generation: this.organism.state.generation,
        })
      }
    }

    return result
  }

  /**
   * EVOLVE phase
   */
  private async evolvePhase(metrics: any[]): Promise<void> {
    this.telemetry.log('debug', 'evolve', 'Starting EVOLVE phase')

    // Periodic evolution check
    if (this.organism.state.generation % 10 === 0) {
      const mutations = await this.evolveEngine.evaluateAll()

      for (const mutation of mutations) {
        if (mutation.success) {
          this.telemetry.log('info', 'evolve', 'Evolution successful', {
            generation: this.organism.state.generation,
            improvement: mutation.fitnessImprovement,
            changes: mutation.changes.length,
          })
        }
      }
    }

    // Check if LLM-guided mutation needed
    if (
      this.organism.state.coherence < this.organism.dna.quantum.target_coherence * 0.8 ||
      this.organism.state.wasserstein_cost > this.organism.dna.evolution.mutation_threshold
    ) {
      // Request mutation proposal
      const context: MutationContext = {
        currentDNA: this.organism.dna,
        currentState: this.organism.state,
        history: this.organism.state.history.slice(-5),
        goal: 'maximize_coherence',
        constraints: {
          preserve_stability: true,
          max_change_rate: 0.2,
        },
      }

      try {
        const proposal = await this.evolveEngine.proposeMutation(context)

        // Validate and apply mutation
        if (proposal.confidence > 0.5) {
          const result = await this.evolveEngine.applyMutation(proposal)

          this.telemetry.log('info', 'evolve', 'LLM-guided mutation applied', {
            target: proposal.target,
            improvement: result.fitnessImprovement,
          })
        }
      } catch (error) {
        this.telemetry.log('warn', 'evolve', 'Mutation proposal failed', { error })
      }
    }
  }

  /**
   * Update organism state
   */
  private updateState(metrics: any[], actResult: any): void {
    this.organism.state.lastUpdate = new Date()

    // Update performance metrics
    if (actResult) {
      this.organism.state.performance.coherence = actResult.coherence || 0
      this.organism.state.performance.fidelity = actResult.fidelity || 0
      this.organism.state.performance.errorRate = actResult.errorRate || 0
    }

    // Compute negentropy
    this.organism.state.negentropy = this.computeNegentropy()

    // Add to history
    this.organism.state.history.push({
      timestamp: new Date(),
      name: 'cycle_complete',
      value: this.organism.state.coherence,
      unit: 'coherence',
      tags: {
        generation: this.organism.state.generation.toString(),
      },
      metadata: {
        fidelity: this.organism.state.fidelity,
        negentropy: this.organism.state.negentropy,
      },
    })

    // Maintain history limit
    if (this.organism.state.history.length > 1000) {
      this.organism.state.history = this.organism.state.history.slice(-1000)
    }

    this.organism.state.generation++
  }

  /**
   * Compute negentropy (informational order)
   */
  private computeNegentropy(): number {
    // Simplified negentropy computation
    // In production, use proper statistical mechanics
    const coherence = this.organism.state.coherence
    const fidelity = this.organism.state.fidelity

    return (coherence + fidelity) / 2
  }

  /**
   * Generate random quantum circuit
   */
  private generateRandomCircuit(): QuantumCircuit {
    const qubits = this.organism.dna.quantum.qubit_count

    return {
      id: `circuit_${Date.now()}`,
      name: 'Random Circuit',
      qubits,
      gates: [
        { type: 'H', qubits: [0], parameters: [] },
        { type: 'CNOT', qubits: [0, 1], parameters: [] },
      ],
      measurements: [
        { qubit: 0, classical: 0 },
        { qubit: 1, classical: 1 },
      ],
      parameters: [],
      depth: 2,
      metadata: {
        created: new Date(),
        lastModified: new Date(),
        author: 'NQRE',
        description: 'Randomly generated circuit',
        tags: ['random'],
      },
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get organism state
   */
  getState(): Organism {
    return this.organism
  }

  /**
   * Get telemetry
   */
  getTelemetry(): Telemetry {
    return this.telemetry
  }
}

/**
 * Create a new organism from DNA specification
 */
export function createOrganism(spec: OrganismSpec): Organism {
  const organism: Organism = {
    id: spec.id || `organism_${Date.now()}`,
    domain: spec.domain,
    version: spec.version || '1.0.0',
    state: {
      coherence: 0,
      fidelity: 0,
      negentropy: 0,
      generation: 0,
      bestCircuit: null,
      wasserstein_cost: Infinity,
      history: [],
      lastUpdate: new Date(),
      performance: {
        coherence: 0,
        fidelity: 0,
        negentropy: 0,
        successRate: 0,
        averageExecutionTime: 0,
        errorRate: 0,
        efficiency: 0,
      },
    },
    dna: spec.dna,
    genes: new Map(Object.entries(spec.genes || {})),
    workflows: new Map(Object.entries(spec.workflows || {})),
    policies: new Map(Object.entries(spec.policies || {})),
    senseModules: new Map(),
    actModules: new Map(),
    backupHistory: [],
  }

  return organism
}

export interface OrganismSpec {
  id?: string
  domain: string
  version?: string
  dna: DNA
  genes?: Record<string, Gene>
  workflows?: Record<string, Workflow>
  policies?: Record<string, EvolvePolicy>
}
