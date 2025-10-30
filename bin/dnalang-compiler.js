#!/usr/bin/env node

/**
 * DNA Lang Compiler
 * Command-line compiler for DNA Lang
 * Part of DNA Lang Mobile IDE - Powered by Red Hat
 */

const fs = require('fs');
const path = require('path');

console.log('=== DNA Lang Compiler ===');
console.log('Powered by Red Hat OpenShift Dev Spaces');
console.log('');

// Get file from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: dnalang-compiler <file.dna>');
  console.log('');
  console.log('Example:');
  console.log('  dnalang-compiler myprogram.dna');
  process.exit(1);
}

const inputFile = args[0];

// Check if file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Read the file
const code = fs.readFileSync(inputFile, 'utf8');

console.log(`Compiling: ${inputFile}`);
console.log('');

// Simple compilation (for now, just validates and transpiles to JavaScript)
try {
  // Validate syntax
  new Function(code);

  // Generate output file
  const outputFile = inputFile.replace(/\.dna$/, '.js');

  const compiledCode = `
/**
 * Compiled from DNA Lang
 * Source: ${inputFile}
 * Compiled: ${new Date().toISOString()}
 * DNA Lang Mobile IDE - Powered by Red Hat
 */

${code}
`;

  fs.writeFileSync(outputFile, compiledCode);

  console.log('✓ Compilation successful!');
  console.log(`✓ Output: ${outputFile}`);
  console.log('');
  console.log('Run with: node ' + outputFile);

} catch (error) {
  console.error('✗ Compilation failed!');
  console.error('');
  console.error('Error:', error.message);
  process.exit(1);
}
