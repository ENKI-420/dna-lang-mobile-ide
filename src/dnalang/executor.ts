/**
 * DNA Lang Executor
 * A simple JavaScript-based interpreter for DNA Lang
 *
 * DNA Lang is designed for bio-inspired computing and genetic algorithms
 * This implementation provides basic execution capabilities
 */

export interface ExecutionResult {
  output: string[]
  errors: string[]
  executionTime: number
}

// Custom console for capturing output
class DNAConsole {
  private output: string[] = []

  log(...args: any[]) {
    this.output.push(args.map(arg => String(arg)).join(' '))
  }

  error(...args: any[]) {
    this.output.push('ERROR: ' + args.map(arg => String(arg)).join(' '))
  }

  warn(...args: any[]) {
    this.output.push('WARNING: ' + args.map(arg => String(arg)).join(' '))
  }

  info(...args: any[]) {
    this.output.push('INFO: ' + args.map(arg => String(arg)).join(' '))
  }

  getOutput(): string[] {
    return this.output
  }

  clear() {
    this.output = []
  }
}

/**
 * Execute DNA Lang code
 * Currently using JavaScript as the runtime, but can be extended to support
 * custom DNA Lang syntax and features
 */
export async function executeDNALang(code: string): Promise<ExecutionResult> {
  const startTime = performance.now()
  const dnaConsole = new DNAConsole()
  const errors: string[] = []

  try {
    // Create a sandboxed execution environment
    const sandboxGlobals = {
      console: dnaConsole,
      // DNA Lang specific functions
      dna: {
        sequence: (pattern: string) => {
          dnaConsole.log(`DNA Sequence: ${pattern}`)
          return pattern.split('').map(nucleotide => {
            const map: { [key: string]: string } = {
              'A': 'Adenine',
              'T': 'Thymine',
              'G': 'Guanine',
              'C': 'Cytosine'
            }
            return map[nucleotide] || 'Unknown'
          })
        },
        complement: (sequence: string) => {
          const complementMap: { [key: string]: string } = {
            'A': 'T',
            'T': 'A',
            'G': 'C',
            'C': 'G'
          }
          return sequence.split('').map(n => complementMap[n] || n).join('')
        },
        transcribe: (dnaSeq: string) => {
          // DNA to RNA transcription (T -> U)
          return dnaSeq.replace(/T/g, 'U')
        },
        translate: (rnaSeq: string) => {
          // Simple codon translation (simplified)
          const codons = rnaSeq.match(/.{1,3}/g) || []
          return codons.map(codon => {
            const codonTable: { [key: string]: string } = {
              'AUG': 'Met',
              'UAA': 'Stop',
              'UAG': 'Stop',
              'UGA': 'Stop',
              'GCU': 'Ala',
              'GCC': 'Ala',
              'GCA': 'Ala',
              'GCG': 'Ala'
              // ... more codons can be added
            }
            return codonTable[codon] || '???'
          })
        },
        evolve: (population: any[], generations: number, fitness: (individual: any) => number) => {
          dnaConsole.log(`Starting evolution for ${generations} generations...`)
          let currentPop = [...population]

          for (let gen = 0; gen < generations; gen++) {
            const scored = currentPop.map(ind => ({
              individual: ind,
              fitness: fitness(ind)
            }))
            scored.sort((a, b) => b.fitness - a.fitness)

            // Keep top 50%
            const survivors = scored.slice(0, Math.ceil(scored.length / 2))

            // Reproduce
            currentPop = survivors.map(s => s.individual)
            while (currentPop.length < population.length) {
              const parent = survivors[Math.floor(Math.random() * survivors.length)]
              currentPop.push({ ...parent.individual })
            }

            if (gen % 10 === 0) {
              dnaConsole.log(`Generation ${gen}: Best fitness = ${scored[0].fitness.toFixed(4)}`)
            }
          }

          dnaConsole.log('Evolution complete!')
          return currentPop
        }
      },
      // Math and other safe globals
      Math,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      JSON,
      setTimeout: undefined, // Disable async operations for safety
      setInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
    }

    // Wrap code in async function to allow await
    const wrappedCode = `
      (async function() {
        'use strict';
        ${code}
      })();
    `

    // Create function with sandbox
    const func = new Function(...Object.keys(sandboxGlobals), `return ${wrappedCode}`)

    // Execute with sandboxed globals
    await func(...Object.values(sandboxGlobals))

  } catch (error: any) {
    errors.push(error.toString())

    // Try to provide helpful error messages
    if (error instanceof SyntaxError) {
      errors.push('Syntax error in your DNA Lang code. Please check your syntax.')
    } else if (error instanceof ReferenceError) {
      errors.push('Reference error: You may be using an undefined variable or function.')
    } else if (error instanceof TypeError) {
      errors.push('Type error: Check that you\'re using the correct data types.')
    }
  }

  const endTime = performance.now()
  const executionTime = endTime - startTime

  return {
    output: dnaConsole.getOutput(),
    errors,
    executionTime,
  }
}

/**
 * Validate DNA Lang syntax
 */
export function validateDNALang(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    // Basic syntax validation using JavaScript parser
    new Function(code)
  } catch (error: any) {
    errors.push(error.toString())
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
