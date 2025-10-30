# NQRE User Guide
## Negentropic Quantum Research Engine

**Version:** 1.0.0
**Last Updated:** 2025-10-30

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Architecture](#architecture)
5. [Writing DNA-Lang Programs](#writing-dna-lang-programs)
6. [API Reference](#api-reference)
7. [Examples](#examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 1. Introduction

The **Negentropic Quantum Research Engine (NQRE)** is an autonomous platform that leverages the DNA-Lang framework to accelerate scientific breakthroughs in quantum computing through self-evolution and autonomous experimentation.

### Key Features

- **Autonomous Research**: 24/7 operation without human intervention
- **Self-Evolution**: Systems that improve their own code
- **Quantum-Native**: First-class support for quantum circuits and operations
- **LLM-Integrated**: Uses AI for insight generation and optimization
- **Negentropic**: Maximizes informational order and quantum coherence

### What Makes NQRE Special?

1. **Autopoietic Systems**: Self-creating, self-maintaining organisms
2. **Three-Tiered Architecture**: SENSE, ACT, EVOLVE cycle
3. **Wasserstein Optimization**: Quantum-aware optimization using optimal transport theory
4. **Multi-Backend Support**: Works with IBM Quantum, simulators, and more

---

## 2. Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/dnalang/mobile-ide.git
cd dna-lang-mobile-ide

# Install dependencies
npm install

# Build the project
npm run build
```

### Quick Start

Create your first organism:

```typescript
import { createOrganism, OrganismRuntime } from './src/dnalang/nqre'

// Define DNA configuration
const dna = {
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
    qubit_count: 5,
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

// Create organism
const organism = createOrganism({
  domain: 'quantum_computing',
  dna,
})

// Start runtime
const runtime = new OrganismRuntime(organism)
await runtime.start()
```

---

## 3. Core Concepts

### Organisms

An **Organism** is the top-level construct in DNA-Lang. It represents a self-contained, autonomous system capable of:

- Sensing its environment
- Acting on that environment
- Evolving its own behavior

```dnalang
ORGANISM QuantumSwarm {
  domain: "quantum_computing"
  version: "1.0.0"

  STATE { /* ... */ }
  DNA { /* ... */ }
  GENE { /* ... */ }
  WORKFLOW { /* ... */ }
  EVOLVE POLICY { /* ... */ }
}
```

### DNA Configuration

DNA defines the behavioral configuration of an organism:

- **evolution**: How the organism evolves
- **quantum**: Quantum computing parameters
- **learning**: LLM integration settings
- **targets**: Performance goals
- **monitoring**: Logging and telemetry

### Genes

**Genes** are reusable functional components:

```dnalang
GENE QuantumOptimizer {
  name: "WGF Optimizer"
  version: "2.1.0"

  PARAMS {
    learning_rate: 0.01
  }

  FUNCTION optimize(circuit: QuantumCircuit): QuantumCircuit {
    // Optimization logic
  }
}
```

### Three-Tiered Architecture

#### SENSE: Data Acquisition

- Monitor quantum coherence
- Measure entanglement
- Diagnose performance issues
- Collect telemetry

```dnalang
SENSE CoherenceMonitor {
  ASYNC FUNCTION monitor(): Metric {
    LET state = AWAIT GET_QUANTUM_STATE()
    RETURN COMPUTE_COHERENCE(state)
  }
}
```

#### ACT: Execution

- Run quantum experiments
- Execute circuits on backends
- Deploy workflows
- Publish discoveries

```dnalang
ACT QuantumExperiment {
  ASYNC FUNCTION run(circuit: QuantumCircuit): Result {
    RETURN AWAIT BACKEND.EXECUTE(circuit)
  }
}
```

#### EVOLVE: Self-Modification

- Evaluate trigger conditions
- Request LLM-guided mutations
- Apply changes to DNA/Genes
- Rollback if needed

```dnalang
EVOLVE POLICY AutoImprove {
  TRIGGER {
    WHEN coherence < target * 0.9
  }

  ASYNC ACTION {
    LET mutation = AWAIT LLM.PROPOSE_MUTATION()
    SELF.MODIFY(mutation)
  }
}
```

---

## 4. Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NQRE Organism                            │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   SENSE     │  │     ACT     │  │   EVOLVE    │        │
│  │             │  │             │  │             │        │
│  │ • Monitor   │  │ • Execute   │  │ • Mutate    │        │
│  │ • Diagnose  │  │ • Optimize  │  │ • Optimize  │        │
│  │ • Analyze   │  │ • Deploy    │  │ • Rollback  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                 │
│                   ┌──────▼──────┐                          │
│                   │  Organism   │                          │
│                   │   Runtime   │                          │
│                   └──────┬──────┘                          │
│                          │                                 │
└──────────────────────────┼─────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐
     │ Quantum  │    │   LLM    │    │   Data   │
     │ Backend  │    │ Provider │    │  Store   │
     └──────────┘    └──────────┘    └──────────┘
```

### Component Interactions

1. **SENSE** → Monitors system and collects metrics
2. **ACT** → Executes experiments based on current state
3. **EVOLVE** → Analyzes performance and proposes improvements
4. **Runtime** → Orchestrates the SENSE-ACT-EVOLVE cycle

---

## 5. Writing DNA-Lang Programs

### Basic Syntax

#### Variables

```dnalang
LET x: Number = 42
CONST name: String = "QuantumSwarm"
VAR counter: Number = 0
```

#### Functions

```dnalang
FUNCTION add(a: Number, b: Number): Number {
  RETURN a + b
}

ASYNC FUNCTION fetchData(): String {
  LET result = AWAIT API.get("/data")
  RETURN result
}
```

#### Control Flow

```dnalang
IF condition {
  // code
} ELSE {
  // code
}

WHILE condition {
  // code
}

FOR item IN collection {
  // code
}
```

### Quantum Programming

#### Defining Circuits

```dnalang
CIRCUIT BellState {
  qubits: 2

  GATES {
    H(0)
    CNOT(0, 1)
  }

  MEASURE {
    q0: 0,
    q1: 1
  }
}
```

#### Quantum Operations

```dnalang
// Single-qubit gates
H(q0)              // Hadamard
X(q0)              // Pauli-X
Y(q0)              // Pauli-Y
Z(q0)              // Pauli-Z
RX(q0, π/4)        // Rotation-X

// Two-qubit gates
CNOT(q0, q1)       // Controlled-NOT
CZ(q0, q1)         // Controlled-Z
SWAP(q0, q1)       // SWAP

// Measurements
LET result = MEASURE(q0)
LET all_results = MEASURE_ALL(register)
```

#### Quantum State Operations

```dnalang
// State preparation
LET q0 = QUBIT(|0⟩)
LET qplus = QUBIT(|+⟩)

// State operations
LET fidelity = FIDELITY(state1, state2)
LET entropy = ENTANGLEMENT_ENTROPY(register, [0, 1])
LET coherence = COHERENCE(state)
```

### Evolution and Self-Modification

#### Defining Evolution Policies

```dnalang
EVOLVE POLICY AutoImprove {
  description: "LLM-guided automatic improvement"

  PARAMS {
    confidence_threshold: 0.5
  }

  TRIGGER {
    WHEN STATE.coherence < DNA.quantum.target_coherence * 0.9
    OR STATE.wasserstein_cost > DNA.evolution.mutation_threshold
  }

  ASYNC ACTION {
    // Get mutation proposal from LLM
    LET proposal = AWAIT LLM.PROPOSE_MUTATION({
      context: {
        current_dna: DNA,
        current_state: STATE,
        goal: "maximize_coherence"
      }
    })

    // Validate and apply
    IF proposal.confidence > PARAMS.confidence_threshold {
      LET backup = SELF.BACKUP()

      SELF.MODIFY({
        target: proposal.target,
        changes: proposal.changes
      })

      STATE.generation += 1
    }
  }

  ROLLBACK {
    IF PERFORMANCE_DEGRADED() {
      SELF.RESTORE_BACKUP()
    }
  }
}
```

#### Self-Modification API

```dnalang
// Modify DNA parameters
SELF.MODIFY({
  target: "DNA.evolution.rate",
  value: 0.15
})

// Modify Gene parameters
SELF.MODIFY({
  target: "GENE.Optimizer.PARAMS.learning_rate",
  value: 0.02
})

// Backup and restore
LET backup_id = SELF.BACKUP()
SELF.RESTORE(backup_id)
```

---

## 6. API Reference

### OrganismRuntime

```typescript
class OrganismRuntime {
  constructor(organism: Organism, llmProvider?: LLMProvider)

  async start(): Promise<void>
  stop(): void

  async executeCycle(): Promise<void>

  getState(): Organism
  getTelemetry(): Telemetry
}
```

### SenseEngine

```typescript
class SenseEngine {
  registerModule(module: SenseModule): void
  unregisterModule(id: string): boolean

  async execute(moduleId: string): Promise<Metric>
  async executeAll(): Promise<Metric[]>

  getMetricsHistory(limit?: number, filter?: MetricsFilter): Metric[]
  getLatestMetric(name: string): Metric | null
}
```

### ActEngine

```typescript
class ActEngine {
  registerModule(module: ActModule): void
  unregisterModule(id: string): boolean

  async execute(moduleId: string, params?: any): Promise<ActResult>

  getModulesByType(type: ActModule['type']): ActModule[]
}
```

### EvolveEngine

```typescript
class EvolveEngine {
  constructor(llmProvider?: LLMProvider)

  setOrganism(organism: Organism): void

  registerPolicy(policy: EvolvePolicy): void
  unregisterPolicy(id: string): boolean

  async evaluateAll(): Promise<MutationResult[]>
  async executePolicy(policy: EvolvePolicy): Promise<MutationResult>

  async proposeMutation(context: MutationContext): Promise<MutationProposal>
  async applyMutation(proposal: MutationProposal): Promise<MutationResult>
}
```

### QuantumExperiment

```typescript
class QuantumExperiment {
  constructor(backend: QuantumBackend)

  async run(circuit: QuantumCircuit, shots?: number): Promise<ExperimentResult>
}
```

### CircuitOptimizer

```typescript
class CircuitOptimizer {
  optimize(
    circuit: QuantumCircuit,
    method?: 'wasserstein' | 'genetic' | 'gradient'
  ): QuantumCircuit
}
```

---

## 7. Examples

### Example 1: Bell State Generation

```dnalang
ORGANISM BellStateGenerator {
  domain: "quantum_computing"

  CIRCUIT BellState {
    qubits: 2

    GATES {
      H(0)
      CNOT(0, 1)
    }
  }

  ASYNC FUNCTION main() {
    LET result = AWAIT BACKEND.EXECUTE(BellState, shots: 1000)
    console.log("Results:", result.counts)
  }
}
```

### Example 2: Quantum Fourier Transform

```dnalang
CIRCUIT QFT {
  qubits: n

  FUNCTION build(n: Number): QuantumCircuit {
    LET circuit = CREATE_CIRCUIT(qubits: n)

    FOR j IN 0..(n-1) {
      H(j)

      FOR k IN (j+1)..(n-1) {
        LET angle = π / (2 ** (k - j))
        CONTROLLED_PHASE(control: k, target: j, angle: angle)
      }
    }

    // Reverse qubit order
    FOR j IN 0..(n/2) {
      SWAP(j, n - j - 1)
    }

    RETURN circuit
  }
}
```

### Example 3: Variational Quantum Eigensolver (VQE)

```dnalang
GENE VQEOptimizer {
  name: "Variational Quantum Eigensolver"

  PARAMS {
    max_iterations: 100,
    tolerance: 1e-6
  }

  FUNCTION optimize(hamiltonian: Operator, ansatz: Circuit): Number {
    LET params = INITIALIZE_RANDOM(ansatz.parameter_count)

    FOR iteration IN 0..PARAMS.max_iterations {
      // Prepare state
      LET state = PREPARE_STATE(ansatz, params)

      // Compute expectation value
      LET energy = EXPECTATION_VALUE(hamiltonian, state)

      // Compute gradient
      LET gradient = PARAMETER_SHIFT_GRADIENT(hamiltonian, ansatz, params)

      // Update parameters
      params = params - 0.1 * gradient

      // Check convergence
      IF NORM(gradient) < PARAMS.tolerance {
        BREAK
      }
    }

    RETURN energy
  }
}
```

---

## 8. Best Practices

### Performance Optimization

1. **Use Wasserstein Optimization**: It's quantum-aware and more effective
2. **Batch Experiments**: Run multiple circuits in parallel when possible
3. **Monitor Coherence**: Track T1/T2 times and gate fidelities
4. **Limit Circuit Depth**: Deeper circuits have more errors

### Evolution Strategies

1. **Start Conservative**: Low mutation rates, high confidence thresholds
2. **Enable Rollback**: Always have backup before mutations
3. **Use LLM Grounding**: Connect LLM to research papers for better insights
4. **Monitor Fitness**: Track improvements over generations

### Quantum Circuit Design

1. **Minimize Gates**: Fewer gates = less error
2. **Use Native Gates**: Stick to backend-supported gates
3. **Optimize Layout**: Consider qubit connectivity
4. **Error Mitigation**: Implement error correction when needed

---

## 9. Troubleshooting

### Common Issues

#### Low Coherence

**Problem**: Coherence consistently below target

**Solutions**:
- Reduce circuit depth
- Use error mitigation techniques
- Check backend calibration
- Increase T1/T2 wait times

#### Evolution Not Triggering

**Problem**: EVOLVE policies never execute

**Solutions**:
- Check trigger conditions
- Verify policies are enabled
- Review metric values
- Lower confidence thresholds

#### High Wasserstein Cost

**Problem**: Wasserstein cost remains high

**Solutions**:
- Increase learning rate
- Use gradient-based optimization
- Check parameter bounds
- Verify target state is achievable

### Debugging

Enable debug logging:

```typescript
const dna = {
  monitoring: {
    log_level: 'debug',  // 'debug' | 'info' | 'warn' | 'error'
    telemetry_enabled: true,
  }
}
```

Access telemetry:

```typescript
const telemetry = runtime.getTelemetry()
const events = telemetry.getEvents()
console.log('Events:', events)
```

---

## Support

- **Documentation**: `/docs/DNALANG_SPECIFICATION.md`
- **Examples**: `/examples/`
- **Issues**: GitHub Issues
- **Community**: Discord Server

---

**Happy Quantum Computing!** 🚀🔬⚛️
