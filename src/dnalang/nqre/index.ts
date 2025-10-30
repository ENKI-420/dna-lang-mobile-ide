/**
 * NQRE - Negentropic Quantum Research Engine
 * Main export file
 */

// Core types
export * from './types'

// SENSE module
export * from './sense'

// ACT module
export * from './act'

// EVOLVE module
export * from './evolve'

// Organism runtime
export * from './organism'

// Version
export const VERSION = '1.0.0'

// Banner
export function printBanner(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                                 ║
║   NQRE - Negentropic Quantum Research Engine                  ║
║   DNA-Lang Autonomous Quantum Computing Framework             ║
║                                                                 ║
║   Version: ${VERSION}                                          ║
║   Powered by: DNA-Lang + Red Hat OpenShift                    ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
  `)
}
