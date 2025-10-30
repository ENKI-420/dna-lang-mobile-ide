/**
 * NQRE Example: Quantum Swarm Organism
 * Demonstrates autonomous quantum computing research
 */

import { createOrganism, OrganismRuntime, printBanner } from '../src/dnalang/nqre'
import type { DNA, EvolvePolicy, Organism } from '../src/dnalang/nqre/types'

// Print banner
printBanner()

// Define DNA configuration
const quantumSwarmDNA: DNA = {
  evolution: {
    rate: 0.1,
    strategy: 'gradient_based',
    mutation_probability: 0.05,
    mutation_threshold: 0.05,
    crossover_probability: 0.8,
    max_generations: 1000,
  },
  quantum: {
    backend: 'simulator',
    target_coherence: 0.99,
    error_threshold: 0.01,
    qubit_count: 7,
    optimization_level: 3,
    shots: 1024,
  },
  learning: {
    llm_model: 'gemini-pro',
    insight_threshold: 'critical',
    documentation_mode: 'auto',
    grounding: true,
    temperature: 0.7,
    max_tokens: 2000,
  },
  targets: {
    max_execution_time: 3600,
    min_success_rate: 0.95,
    negentropy_goal: 0.99,
    min_coherence: 0.90,
  },
  monitoring: {
    log_level: 'info',
    telemetry_enabled: true,
    metrics_interval: 60,
    export_format: 'json',
  },
}

// Define evolution policies
const autoImprovePolicy: EvolvePolicy = {
  id: 'auto_improve',
  description: 'Automatic improvement through LLM-guided mutation',
  trigger: {
    conditions: [
      {
        type: 'threshold',
        metric: 'state.coherence',
        operator: '<',
        value: 0.89,
      },
      {
        type: 'threshold',
        metric: 'state.wasserstein_cost',
        operator: '>',
        value: 0.05,
      },
    ],
    mode: 'any',
  },
  action: {
    type: 'mutation',
    target: 'DNA',
    executor: async (organism: Organism, params: any) => {
      console.log('Evolution triggered: Applying LLM-guided mutation')

      // Simulated mutation result
      return {
        success: true,
        changes: [
          {
            target: 'DNA.evolution.rate',
            type: 'parameter',
            oldValue: 0.1,
            newValue: 0.15,
            rationale: 'Increase exploration rate to escape local optimum',
          },
        ],
        previousDNA: organism.dna,
        newDNA: {
          ...organism.dna,
          evolution: {
            ...organism.dna.evolution,
            rate: 0.15,
          },
        },
        fitnessImprovement: 0.05,
        rollbackId: 'backup_0',
      }
    },
    params: {},
    isAsync: true,
  },
  rollback: {
    enabled: true,
    condition: 'performance_degraded',
    action: async () => {
      console.log('Rollback triggered')
    },
  },
  params: {},
  enabled: true,
  executionCount: 0,
  successCount: 0,
  lastExecution: null,
}

// Create organism
const quantumSwarm = createOrganism({
  id: 'quantum_swarm_001',
  domain: 'quantum_computing',
  version: '1.0.0',
  dna: quantumSwarmDNA,
  policies: {
    auto_improve: autoImprovePolicy,
  },
})

// Create and start runtime
async function main() {
  console.log('Creating Quantum Swarm organism...')
  console.log('Domain:', quantumSwarm.domain)
  console.log('Version:', quantumSwarm.version)
  console.log('Target Coherence:', quantumSwarm.dna.quantum.target_coherence)
  console.log('')

  // Create runtime (without LLM provider for this example)
  const runtime = new OrganismRuntime(quantumSwarm)

  console.log('Starting autonomous research loop...')
  console.log('Press Ctrl+C to stop')
  console.log('')

  // Start the organism
  await runtime.start()

  // Let it run for 10 seconds, then stop
  setTimeout(() => {
    console.log('')
    console.log('Stopping organism...')
    runtime.stop()

    // Print final statistics
    const state = runtime.getState()
    console.log('')
    console.log('Final Statistics:')
    console.log('- Generation:', state.state.generation)
    console.log('- Coherence:', state.state.coherence.toFixed(4))
    console.log('- Fidelity:', state.state.fidelity.toFixed(4))
    console.log('- Negentropy:', state.state.negentropy.toFixed(4))
    console.log('- History length:', state.state.history.length)
    console.log('')

    // Print telemetry summary
    const telemetry = runtime.getTelemetry()
    const events = telemetry.getEvents()
    console.log('Telemetry Events:', events.length)

    const infoEvents = events.filter(e => e.level === 'info').length
    const warnEvents = events.filter(e => e.level === 'warn').length
    const errorEvents = events.filter(e => e.level === 'error').length

    console.log('- Info:', infoEvents)
    console.log('- Warnings:', warnEvents)
    console.log('- Errors:', errorEvents)
    console.log('')

    process.exit(0)
  }, 10000)
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error)
    process.exit(1)
  })
}

export { quantumSwarm, main }
