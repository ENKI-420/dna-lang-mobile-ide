/**
 * QuantumDNA: Bio-Inspired Quantum Circuit Evolution
 *
 * Encodes quantum circuits as DNA sequences and uses genetic algorithms
 * to evolve optimal quantum programs through natural selection.
 *
 * Philosophy: Quantum circuits ARE genomic information that can evolve.
 */

export interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'CZ' | 'RX' | 'RY' | 'RZ' | 'SWAP' | 'T' | 'S' | 'M';
  qubit: number;
  target?: number; // For two-qubit gates
  parameter?: number; // For parametric gates (in radians)
  nucleotide: string; // DNA representation
}

export interface QuantumOrganism {
  id: string;
  dna: string; // DNA sequence encoding the circuit
  circuit: QuantumGate[];
  fitness: number;
  generation: number;
  lineage: string[]; // Parent IDs
  coherence: number;
  fidelity: number;
  depth: number;
  age: number;
}

export interface EvolutionMetrics {
  generation: number;
  population_size: number;
  avg_fitness: number;
  max_fitness: number;
  diversity: number;
  convergence: number;
}

/**
 * Genetic Code: Maps nucleotides to quantum gates
 * Like nature's codon table, but for quantum operations
 */
export const QUANTUM_GENETIC_CODE: Record<string, Partial<QuantumGate>> = {
  // Single-qubit gates (like amino acids)
  'AAA': { type: 'H', nucleotide: 'AAA' },
  'AAT': { type: 'X', nucleotide: 'AAT' },
  'AAG': { type: 'Y', nucleotide: 'AAG' },
  'AAC': { type: 'Z', nucleotide: 'AAC' },
  'ATA': { type: 'S', nucleotide: 'ATA' },
  'ATT': { type: 'T', nucleotide: 'ATT' },

  // Parametric gates (rotation gates)
  'AGA': { type: 'RX', nucleotide: 'AGA' },
  'AGT': { type: 'RY', nucleotide: 'AGT' },
  'AGG': { type: 'RZ', nucleotide: 'AGG' },

  // Two-qubit gates (like complex proteins)
  'TAA': { type: 'CNOT', nucleotide: 'TAA' },
  'TAT': { type: 'CZ', nucleotide: 'TAT' },
  'TAG': { type: 'SWAP', nucleotide: 'TAG' },

  // Measurement (like stop codons)
  'TGA': { type: 'M', nucleotide: 'TGA' },
};

/**
 * Reverse genetic code for encoding circuits as DNA
 */
export const GATE_TO_DNA: Record<string, string> = Object.fromEntries(
  Object.entries(QUANTUM_GENETIC_CODE).map(([codon, gate]) => [gate.type!, codon])
);

export class QuantumDNAEngine {
  private qubits: number;
  private population: QuantumOrganism[] = [];
  private generation: number = 0;
  private mutationRate: number = 0.1;
  private crossoverRate: number = 0.7;

  constructor(qubits: number = 5) {
    this.qubits = qubits;
  }

  /**
   * Encode a quantum circuit as a DNA sequence
   * Each gate becomes a codon (3 nucleotides)
   */
  encodeToDNA(circuit: QuantumGate[]): string {
    const dnaSequence: string[] = [];

    for (const gate of circuit) {
      const codon = GATE_TO_DNA[gate.type];
      if (codon) {
        dnaSequence.push(codon);

        // Encode qubit position (0-9 maps to nucleotides)
        dnaSequence.push(this.numberToNucleotide(gate.qubit));

        // Encode target qubit for two-qubit gates
        if (gate.target !== undefined) {
          dnaSequence.push(this.numberToNucleotide(gate.target));
        }

        // Encode parameter for parametric gates
        if (gate.parameter !== undefined) {
          const paramBits = Math.floor((gate.parameter / (2 * Math.PI)) * 15);
          dnaSequence.push(this.numberToNucleotide(paramBits));
        }
      }
    }

    return dnaSequence.join('');
  }

  /**
   * Decode DNA sequence into quantum circuit
   * Translates genetic information into quantum operations
   */
  decodeFromDNA(dna: string): QuantumGate[] {
    const circuit: QuantumGate[] = [];
    let i = 0;

    while (i < dna.length - 2) {
      const codon = dna.slice(i, i + 3);
      const gateTemplate = QUANTUM_GENETIC_CODE[codon];

      if (gateTemplate) {
        const gate: QuantumGate = {
          type: gateTemplate.type!,
          qubit: 0,
          nucleotide: codon
        };

        i += 3;

        // Decode qubit position
        if (i < dna.length) {
          gate.qubit = this.nucleotideToNumber(dna[i]) % this.qubits;
          i++;
        }

        // Decode target for two-qubit gates
        if (['CNOT', 'CZ', 'SWAP'].includes(gate.type) && i < dna.length) {
          gate.target = this.nucleotideToNumber(dna[i]) % this.qubits;
          // Ensure target != qubit
          if (gate.target === gate.qubit) {
            gate.target = (gate.qubit + 1) % this.qubits;
          }
          i++;
        }

        // Decode parameter for parametric gates
        if (['RX', 'RY', 'RZ'].includes(gate.type) && i < dna.length) {
          const paramBits = this.nucleotideToNumber(dna[i]);
          gate.parameter = (paramBits / 15) * 2 * Math.PI;
          i++;
        }

        circuit.push(gate);
      } else {
        i += 3; // Skip unknown codons
      }
    }

    return circuit;
  }

  /**
   * Create initial population through random DNA generation
   * Like primordial soup generating first life forms
   */
  genesis(populationSize: number, circuitLength: number = 10): QuantumOrganism[] {
    this.population = [];
    this.generation = 0;

    for (let i = 0; i < populationSize; i++) {
      const dna = this.randomDNA(circuitLength);
      const organism = this.createOrganism(dna, 0, []);
      this.population.push(organism);
    }

    return this.population;
  }

  /**
   * Single generation of evolution
   * Selection → Reproduction → Mutation
   */
  evolve(fitnessFunction: (organism: QuantumOrganism) => number): EvolutionMetrics {
    // Evaluate fitness for all organisms
    for (const organism of this.population) {
      organism.fitness = fitnessFunction(organism);
      organism.age++;
    }

    // Sort by fitness (survival of the fittest)
    this.population.sort((a, b) => b.fitness - a.fitness);

    // Calculate metrics
    const metrics: EvolutionMetrics = {
      generation: this.generation,
      population_size: this.population.length,
      avg_fitness: this.population.reduce((sum, o) => sum + o.fitness, 0) / this.population.length,
      max_fitness: this.population[0].fitness,
      diversity: this.calculateDiversity(),
      convergence: this.calculateConvergence()
    };

    // Selection: Keep top 30%
    const survivors = this.population.slice(0, Math.ceil(this.population.length * 0.3));

    // Reproduction: Generate offspring
    const offspring: QuantumOrganism[] = [];
    while (offspring.length < this.population.length - survivors.length) {
      // Select parents using tournament selection
      const parent1 = this.tournamentSelection(survivors);
      const parent2 = this.tournamentSelection(survivors);

      // Crossover
      let childDNA: string;
      if (Math.random() < this.crossoverRate) {
        childDNA = this.crossover(parent1.dna, parent2.dna);
      } else {
        childDNA = parent1.dna;
      }

      // Mutation
      childDNA = this.mutate(childDNA);

      // Create new organism
      const child = this.createOrganism(
        childDNA,
        this.generation + 1,
        [parent1.id, parent2.id]
      );
      offspring.push(child);
    }

    // New population
    this.population = [...survivors, ...offspring];
    this.generation++;

    return metrics;
  }

  /**
   * Genetic crossover (sexual reproduction)
   * Combines DNA from two parents
   */
  private crossover(dna1: string, dna2: string): string {
    const minLength = Math.min(dna1.length, dna2.length);
    const crossoverPoint = Math.floor(Math.random() * minLength);

    return dna1.slice(0, crossoverPoint) + dna2.slice(crossoverPoint);
  }

  /**
   * Genetic mutation
   * Random changes in DNA sequence (like cosmic rays or copying errors)
   */
  private mutate(dna: string): string {
    const nucleotides = ['A', 'T', 'G', 'C'];
    let mutated = dna.split('');

    for (let i = 0; i < mutated.length; i++) {
      if (Math.random() < this.mutationRate) {
        // Point mutation
        mutated[i] = nucleotides[Math.floor(Math.random() * 4)];
      }
    }

    // Insertion mutation (5% chance)
    if (Math.random() < 0.05) {
      const pos = Math.floor(Math.random() * mutated.length);
      const insertion = nucleotides[Math.floor(Math.random() * 4)];
      mutated.splice(pos, 0, insertion);
    }

    // Deletion mutation (5% chance)
    if (Math.random() < 0.05 && mutated.length > 10) {
      const pos = Math.floor(Math.random() * mutated.length);
      mutated.splice(pos, 1);
    }

    return mutated.join('');
  }

  /**
   * Tournament selection for parent selection
   * Simulates competition for mating rights
   */
  private tournamentSelection(population: QuantumOrganism[], tournamentSize: number = 3): QuantumOrganism {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const idx = Math.floor(Math.random() * population.length);
      tournament.push(population[idx]);
    }
    return tournament.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  /**
   * Calculate population diversity (genetic variation)
   */
  private calculateDiversity(): number {
    if (this.population.length < 2) return 0;

    let totalDistance = 0;
    let comparisons = 0;

    for (let i = 0; i < this.population.length - 1; i++) {
      for (let j = i + 1; j < Math.min(i + 10, this.population.length); j++) {
        totalDistance += this.hammingDistance(
          this.population[i].dna,
          this.population[j].dna
        );
        comparisons++;
      }
    }

    const avgDistance = totalDistance / comparisons;
    const maxDistance = Math.max(this.population[0].dna.length, 1);

    return avgDistance / maxDistance;
  }

  /**
   * Calculate convergence (how similar is the population)
   */
  private calculateConvergence(): number {
    return 1 - this.calculateDiversity();
  }

  /**
   * Hamming distance between two DNA sequences
   */
  private hammingDistance(dna1: string, dna2: string): number {
    const len = Math.max(dna1.length, dna2.length);
    let distance = Math.abs(dna1.length - dna2.length);

    for (let i = 0; i < Math.min(dna1.length, dna2.length); i++) {
      if (dna1[i] !== dna2[i]) distance++;
    }

    return distance;
  }

  /**
   * Create a quantum organism from DNA
   */
  private createOrganism(dna: string, generation: number, lineage: string[]): QuantumOrganism {
    const circuit = this.decodeFromDNA(dna);

    return {
      id: this.generateId(),
      dna,
      circuit,
      fitness: 0,
      generation,
      lineage,
      coherence: this.calculateCoherence(circuit),
      fidelity: 0,
      depth: this.calculateDepth(circuit),
      age: 0
    };
  }

  /**
   * Generate random DNA sequence
   */
  private randomDNA(length: number): string {
    const nucleotides = ['A', 'T', 'G', 'C'];
    const codons = Object.keys(QUANTUM_GENETIC_CODE);
    let dna = '';

    for (let i = 0; i < length; i++) {
      // Use valid codons 70% of the time
      if (Math.random() < 0.7) {
        dna += codons[Math.floor(Math.random() * codons.length)];
      } else {
        // Random nucleotides (junk DNA)
        for (let j = 0; j < 3; j++) {
          dna += nucleotides[Math.floor(Math.random() * 4)];
        }
      }

      // Add qubit specifier
      dna += nucleotides[Math.floor(Math.random() * 4)];
    }

    return dna;
  }

  /**
   * Helper: Number to nucleotide encoding
   */
  private numberToNucleotide(n: number): string {
    const nucleotides = ['A', 'T', 'G', 'C'];
    return nucleotides[n % 4];
  }

  /**
   * Helper: Nucleotide to number decoding
   */
  private nucleotideToNumber(n: string): number {
    const map: Record<string, number> = { 'A': 0, 'T': 1, 'G': 2, 'C': 3 };
    return map[n] || 0;
  }

  /**
   * Calculate circuit depth (like protein folding complexity)
   */
  private calculateDepth(circuit: QuantumGate[]): number {
    // Simplified: count sequential dependencies
    return circuit.length;
  }

  /**
   * Estimate coherence based on circuit structure
   */
  private calculateCoherence(circuit: QuantumGate[]): number {
    // Decoherence increases with depth and two-qubit gates
    const twoQubitGates = circuit.filter(g =>
      ['CNOT', 'CZ', 'SWAP'].includes(g.type)
    ).length;

    const coherence = Math.exp(-0.01 * circuit.length - 0.05 * twoQubitGates);
    return Math.max(0.1, Math.min(1.0, coherence));
  }

  /**
   * Generate unique ID (like genetic fingerprint)
   */
  private generateId(): string {
    return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current population
   */
  getPopulation(): QuantumOrganism[] {
    return this.population;
  }

  /**
   * Get best organism
   */
  getBestOrganism(): QuantumOrganism | null {
    return this.population.length > 0 ? this.population[0] : null;
  }

  /**
   * Set evolution parameters
   */
  setParameters(mutationRate?: number, crossoverRate?: number) {
    if (mutationRate !== undefined) this.mutationRate = mutationRate;
    if (crossoverRate !== undefined) this.crossoverRate = crossoverRate;
  }
}

/**
 * Quantum state simulator (simplified)
 * Simulates quantum state evolution for fitness evaluation
 */
export class QuantumSimulator {
  private qubits: number;

  constructor(qubits: number = 5) {
    this.qubits = qubits;
  }

  /**
   * Simulate circuit execution and return state fidelity
   */
  simulate(circuit: QuantumGate[], targetState?: number[]): number {
    // Simplified quantum simulation
    // In production, would use actual quantum simulation library

    let fidelity = 1.0;

    // Penalize for excessive depth
    fidelity *= Math.exp(-0.01 * circuit.length);

    // Reward for gate diversity
    const gateTypes = new Set(circuit.map(g => g.type));
    fidelity *= 0.5 + (gateTypes.size / 10);

    // Penalize for decoherence
    const twoQubitGates = circuit.filter(g =>
      ['CNOT', 'CZ', 'SWAP'].includes(g.type)
    ).length;
    fidelity *= Math.exp(-0.02 * twoQubitGates);

    // Add measurement bonus
    const hasMeasurement = circuit.some(g => g.type === 'M');
    if (hasMeasurement) fidelity *= 1.1;

    return Math.max(0, Math.min(1, fidelity));
  }

  /**
   * Calculate entanglement entropy (measure of quantum complexity)
   */
  calculateEntanglement(circuit: QuantumGate[]): number {
    const entanglingGates = circuit.filter(g =>
      ['CNOT', 'CZ', 'SWAP'].includes(g.type)
    ).length;

    return Math.min(1, entanglingGates / 10);
  }
}
