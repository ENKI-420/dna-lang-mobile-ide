#!/usr/bin/env ts-node

/**
 * Quantum DNA Evolution - Command Line Demo
 *
 * Run this to see quantum circuits evolving in the terminal!
 *
 * Usage: ts-node demo-quantum-evolution.ts
 */

import {
  QuantumDNAEngine,
  QuantumSimulator,
  QuantumOrganism,
  EvolutionMetrics,
} from './src/quantum/QuantumDNA';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
  console.log('\n' + '='.repeat(70));
  console.log(colorize('🧬 QUANTUM DNA EVOLUTION LAB', 'cyan'));
  console.log(colorize('   Quantum Circuits Evolving as Living Organisms', 'dim'));
  console.log('='.repeat(70) + '\n');
}

function printOrganism(org: QuantumOrganism, rank: number) {
  const fitnessColor = org.fitness > 0.7 ? 'green' : org.fitness > 0.5 ? 'yellow' : 'red';
  const coherenceColor = org.coherence > 0.7 ? 'green' : org.coherence > 0.5 ? 'yellow' : 'red';

  console.log(colorize(`Rank #${rank}:`, 'bright'));
  console.log(`  ID: ${colorize(org.id, 'cyan')}`);
  console.log(`  Fitness: ${colorize(org.fitness.toFixed(4), fitnessColor)}`);
  console.log(`  Coherence: ${colorize((org.coherence * 100).toFixed(1) + '%', coherenceColor)}`);
  console.log(`  Generation: ${org.generation} | Age: ${org.age} | Depth: ${org.depth}`);
  console.log(`  DNA: ${colorize(org.dna.substring(0, 50) + '...', 'blue')}`);
  console.log(`  Circuit: ${org.circuit.length} gates`);

  // Print circuit
  const circuitStr = org.circuit.slice(0, 10).map(gate => {
    let str = gate.type;
    if (gate.target !== undefined) {
      str += ` q${gate.qubit}→q${gate.target}`;
    } else {
      str += ` q${gate.qubit}`;
    }
    if (gate.parameter !== undefined) {
      str += `(${(gate.parameter / Math.PI).toFixed(2)}π)`;
    }
    return str;
  }).join(', ');

  console.log(`  Gates: ${colorize(circuitStr, 'magenta')}`);

  if (org.lineage.length > 0) {
    console.log(`  Parents: ${org.lineage.slice(0, 2).join(', ')}`);
  }

  console.log();
}

function printMetrics(metrics: EvolutionMetrics) {
  const diversityBar = '█'.repeat(Math.floor(metrics.diversity * 20));
  const convergenceBar = '█'.repeat(Math.floor(metrics.convergence * 20));

  console.log(colorize('📊 Evolution Metrics', 'bright'));
  console.log(`  Generation: ${colorize(metrics.generation.toString(), 'cyan')}`);
  console.log(`  Population: ${metrics.population_size}`);
  console.log(`  Max Fitness: ${colorize(metrics.max_fitness.toFixed(4), 'green')}`);
  console.log(`  Avg Fitness: ${colorize(metrics.avg_fitness.toFixed(4), 'yellow')}`);
  console.log(`  Diversity:   ${colorize(diversityBar, 'blue')} ${(metrics.diversity * 100).toFixed(1)}%`);
  console.log(`  Convergence: ${colorize(convergenceBar, 'magenta')} ${(metrics.convergence * 100).toFixed(1)}%`);
  console.log();
}

function printProgress(generation: number, maxGen: number) {
  const percent = (generation / maxGen) * 100;
  const barLength = 40;
  const filled = Math.floor((generation / maxGen) * barLength);
  const empty = barLength - filled;

  const bar = colorize('█'.repeat(filled), 'green') + colorize('░'.repeat(empty), 'dim');
  process.stdout.write(`\r  Progress: [${bar}] ${percent.toFixed(0)}% (Gen ${generation}/${maxGen})`);
}

async function runEvolution() {
  printHeader();

  // Configuration
  const QUBITS = 5;
  const POPULATION_SIZE = 50;
  const CIRCUIT_LENGTH = 10;
  const GENERATIONS = 100;
  const MUTATION_RATE = 0.1;
  const CROSSOVER_RATE = 0.7;

  console.log(colorize('⚙️  Configuration', 'bright'));
  console.log(`  Qubits: ${QUBITS}`);
  console.log(`  Population Size: ${POPULATION_SIZE}`);
  console.log(`  Circuit Length: ${CIRCUIT_LENGTH}`);
  console.log(`  Generations: ${GENERATIONS}`);
  console.log(`  Mutation Rate: ${MUTATION_RATE}`);
  console.log(`  Crossover Rate: ${CROSSOVER_RATE}`);
  console.log();

  // Initialize
  console.log(colorize('🧪 Initializing...', 'cyan'));
  const engine = new QuantumDNAEngine(QUBITS);
  const simulator = new QuantumSimulator(QUBITS);

  engine.setParameters(MUTATION_RATE, CROSSOVER_RATE);

  // Genesis
  console.log(colorize('🌱 Creating primordial population...', 'green'));
  const population = engine.genesis(POPULATION_SIZE, CIRCUIT_LENGTH);

  console.log(`✅ Created ${population.length} quantum organisms\n`);

  // Fitness function
  const fitnessFunction = (organism: QuantumOrganism): number => {
    const fidelity = simulator.simulate(organism.circuit);
    const entanglement = simulator.calculateEntanglement(organism.circuit);
    const depthPenalty = Math.exp(-0.01 * organism.depth);

    return (fidelity * 0.6) + (entanglement * 0.3) + (depthPenalty * 0.1);
  };

  // Initial population
  console.log(colorize('🔬 Initial Population Analysis', 'bright'));
  console.log('-'.repeat(70) + '\n');

  const initialBest = engine.getBestOrganism();
  if (initialBest) {
    printOrganism(initialBest, 1);
  }

  // Evolution loop
  console.log(colorize('🧬 Starting Evolution...', 'cyan'));
  console.log();

  const startTime = Date.now();
  let metrics: EvolutionMetrics | null = null;

  for (let gen = 0; gen < GENERATIONS; gen++) {
    metrics = engine.evolve(fitnessFunction);
    printProgress(gen + 1, GENERATIONS);

    // Print milestone details
    if ((gen + 1) % 25 === 0 || gen === GENERATIONS - 1) {
      console.log('\n');
      printMetrics(metrics);
    }
  }

  const endTime = Date.now();
  const elapsed = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(70));
  console.log(colorize('✅ EVOLUTION COMPLETE!', 'green'));
  console.log(`⏱️  Time: ${elapsed}s | Avg: ${(parseFloat(elapsed) / GENERATIONS * 1000).toFixed(1)}ms/gen`);
  console.log('='.repeat(70) + '\n');

  // Final results
  if (metrics) {
    printMetrics(metrics);
  }

  // Best organisms
  console.log(colorize('🏆 TOP 5 EVOLVED ORGANISMS', 'bright'));
  console.log('-'.repeat(70) + '\n');

  const finalPopulation = engine.getPopulation();
  for (let i = 0; i < Math.min(5, finalPopulation.length); i++) {
    printOrganism(finalPopulation[i], i + 1);
  }

  // Statistics
  console.log(colorize('📈 Evolution Statistics', 'bright'));
  const fitnesses = finalPopulation.map(o => o.fitness);
  const coherences = finalPopulation.map(o => o.coherence);

  const avgFitness = fitnesses.reduce((a, b) => a + b, 0) / fitnesses.length;
  const maxFitness = Math.max(...fitnesses);
  const minFitness = Math.min(...fitnesses);

  const avgCoherence = coherences.reduce((a, b) => a + b, 0) / coherences.length;

  console.log(`  Fitness Range: ${minFitness.toFixed(4)} → ${maxFitness.toFixed(4)}`);
  console.log(`  Fitness Improvement: ${colorize(`+${((maxFitness / (initialBest?.fitness || 0.1) - 1) * 100).toFixed(1)}%`, 'green')}`);
  console.log(`  Average Coherence: ${(avgCoherence * 100).toFixed(1)}%`);
  console.log(`  Unique Lineages: ${new Set(finalPopulation.map(o => o.lineage.join(','))).size}`);
  console.log();

  // DNA Analysis
  console.log(colorize('🧬 DNA Analysis (Best Organism)', 'bright'));
  const best = finalPopulation[0];
  const dna = best.dna;

  // Count nucleotides
  const nucleotideCounts: Record<string, number> = {
    A: (dna.match(/A/g) || []).length,
    T: (dna.match(/T/g) || []).length,
    G: (dna.match(/G/g) || []).length,
    C: (dna.match(/C/g) || []).length,
  };

  const total = dna.length;
  console.log(`  Length: ${total} nucleotides`);
  console.log(`  Composition:`);
  console.log(`    A (Adenine):  ${nucleotideCounts.A} (${(nucleotideCounts.A / total * 100).toFixed(1)}%)`);
  console.log(`    T (Thymine):  ${nucleotideCounts.T} (${(nucleotideCounts.T / total * 100).toFixed(1)}%)`);
  console.log(`    G (Guanine):  ${nucleotideCounts.G} (${(nucleotideCounts.G / total * 100).toFixed(1)}%)`);
  console.log(`    C (Cytosine): ${nucleotideCounts.C} (${(nucleotideCounts.C / total * 100).toFixed(1)}%)`);
  console.log();

  // Gate distribution
  console.log(colorize('⚛️  Gate Distribution (Best Circuit)', 'bright'));
  const gateCounts: Record<string, number> = {};
  best.circuit.forEach(gate => {
    gateCounts[gate.type] = (gateCounts[gate.type] || 0) + 1;
  });

  Object.entries(gateCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([gate, count]) => {
      const bar = '█'.repeat(Math.floor(count / 2));
      console.log(`  ${gate.padEnd(6)} ${colorize(bar, 'cyan')} ${count}`);
    });
  console.log();

  // Final message
  console.log('='.repeat(70));
  console.log(colorize('🎉 Natural Selection Has Optimized Your Quantum Circuit!', 'green'));
  console.log(colorize('   Computation IS Natural. Evolution IS Computation.', 'dim'));
  console.log('='.repeat(70) + '\n');

  console.log(colorize('💡 Next Steps:', 'bright'));
  console.log('  1. Run the web UI: npm run dev');
  console.log('  2. Visit: http://localhost:3000/quantum-lab');
  console.log('  3. Watch evolution in real-time with stunning visuals!');
  console.log();
}

// Run the demo
runEvolution().catch(console.error);
