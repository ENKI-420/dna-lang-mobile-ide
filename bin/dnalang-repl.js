#!/usr/bin/env node

/**
 * DNA Lang REPL
 * Interactive Read-Eval-Print Loop for DNA Lang
 * Part of DNA Lang Mobile IDE - Powered by Red Hat
 */

const readline = require('readline');
const vm = require('vm');

console.log('=== DNA Lang REPL ===');
console.log('Powered by Red Hat OpenShift Dev Spaces');
console.log('');
console.log('Type .help for more information');
console.log('Type .exit to quit');
console.log('');

// Create DNA Lang context with bio-computing functions
const context = {
  console,
  dna: {
    sequence: (pattern) => {
      console.log(`DNA Sequence: ${pattern}`);
      return pattern.split('').map(nucleotide => {
        const map = {
          'A': 'Adenine',
          'T': 'Thymine',
          'G': 'Guanine',
          'C': 'Cytosine'
        };
        return map[nucleotide] || 'Unknown';
      });
    },
    complement: (sequence) => {
      const complementMap = {
        'A': 'T',
        'T': 'A',
        'G': 'C',
        'C': 'G'
      };
      return sequence.split('').map(n => complementMap[n] || n).join('');
    },
    transcribe: (dnaSeq) => {
      return dnaSeq.replace(/T/g, 'U');
    },
    translate: (rnaSeq) => {
      const codons = rnaSeq.match(/.{1,3}/g) || [];
      return codons.map(codon => {
        const codonTable = {
          'AUG': 'Met',
          'UAA': 'Stop',
          'UAG': 'Stop',
          'UGA': 'Stop',
          'GCU': 'Ala',
          'GCC': 'Ala',
          'GCA': 'Ala',
          'GCG': 'Ala'
        };
        return codonTable[codon] || '???';
      });
    }
  },
  Math,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  JSON
};

vm.createContext(context);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'dna> '
});

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();

  // Handle special commands
  if (input === '.exit') {
    console.log('Goodbye!');
    process.exit(0);
  }

  if (input === '.help') {
    console.log('');
    console.log('DNA Lang REPL Commands:');
    console.log('  .exit          Exit the REPL');
    console.log('  .help          Show this help message');
    console.log('  .clear         Clear the context');
    console.log('');
    console.log('DNA Lang Functions:');
    console.log('  dna.sequence(pattern)      - Analyze DNA sequence');
    console.log('  dna.complement(sequence)   - Get complementary DNA strand');
    console.log('  dna.transcribe(dna)        - Transcribe DNA to RNA');
    console.log('  dna.translate(rna)         - Translate RNA to amino acids');
    console.log('');
    console.log('Example:');
    console.log('  dna.complement("ATCG")');
    console.log('');
    rl.prompt();
    return;
  }

  if (input === '.clear') {
    console.log('Context cleared');
    rl.prompt();
    return;
  }

  if (!input) {
    rl.prompt();
    return;
  }

  // Evaluate the input
  try {
    const result = vm.runInContext(input, context);
    if (result !== undefined) {
      console.log(result);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
