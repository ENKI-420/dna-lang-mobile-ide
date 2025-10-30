/**
 * Quantum Evolution Lab
 *
 * Interactive visualization of quantum circuits evolving as DNA organisms
 * Demonstrates the natural philosophy of DNA-Lang: computation as natural selection
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  NumberInput,
  Toggle,
  ProgressBar,
  Tag,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  InlineNotification,
  Slider,
} from '@carbon/react';
import {
  Play,
  Pause,
  Renew,
  ChevronRight,
  Chemistry,
  Microscope,
  DataVis_1,
} from '@carbon/icons-react';

import {
  QuantumDNAEngine,
  QuantumSimulator,
  QuantumOrganism,
  EvolutionMetrics,
  QuantumGate,
} from '../../quantum/QuantumDNA';

const QuantumEvolutionLab: React.FC = () => {
  // Evolution engine
  const [engine] = useState(() => new QuantumDNAEngine(5));
  const [simulator] = useState(() => new QuantumSimulator(5));

  // Evolution state
  const [isEvolving, setIsEvolving] = useState(false);
  const [population, setPopulation] = useState<QuantumOrganism[]>([]);
  const [metrics, setMetrics] = useState<EvolutionMetrics | null>(null);
  const [bestOrganism, setBestOrganism] = useState<QuantumOrganism | null>(null);

  // Configuration
  const [populationSize, setPopulationSize] = useState(50);
  const [circuitLength, setCircuitLength] = useState(10);
  const [mutationRate, setMutationRate] = useState(0.1);
  const [crossoverRate, setCrossoverRate] = useState(0.7);
  const [evolutionSpeed, setEvolutionSpeed] = useState(500); // ms per generation
  const [autoEvolve, setAutoEvolve] = useState(false);

  // Visualization state
  const [selectedOrganism, setSelectedOrganism] = useState<QuantumOrganism | null>(null);
  const [showDNA, setShowDNA] = useState(true);
  const [showCircuit, setShowCircuit] = useState(true);
  const [showLineage, setShowLineage] = useState(false);

  // Canvas refs for visualization
  const dnaCanvasRef = useRef<HTMLCanvasElement>(null);
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineageCanvasRef = useRef<HTMLCanvasElement>(null);

  // History tracking
  const [evolutionHistory, setEvolutionHistory] = useState<EvolutionMetrics[]>([]);

  /**
   * Initialize population (genesis)
   */
  const handleGenesis = () => {
    const newPopulation = engine.genesis(populationSize, circuitLength);
    setPopulation(newPopulation);
    setBestOrganism(newPopulation[0]);
    setEvolutionHistory([]);
    setMetrics(null);
  };

  /**
   * Run single generation of evolution
   */
  const handleEvolve = () => {
    if (population.length === 0) {
      handleGenesis();
      return;
    }

    // Fitness function: maximize fidelity and minimize depth
    const fitnessFunction = (organism: QuantumOrganism): number => {
      const fidelity = simulator.simulate(organism.circuit);
      const entanglement = simulator.calculateEntanglement(organism.circuit);
      const depthPenalty = Math.exp(-0.01 * organism.depth);

      // Composite fitness: balance multiple objectives
      return (fidelity * 0.6) + (entanglement * 0.3) + (depthPenalty * 0.1);
    };

    // Evolve one generation
    const newMetrics = engine.evolve(fitnessFunction);
    const newPopulation = engine.getPopulation();
    const newBest = engine.getBestOrganism();

    setMetrics(newMetrics);
    setPopulation(newPopulation);
    setBestOrganism(newBest);
    setEvolutionHistory(prev => [...prev, newMetrics]);

    // Auto-select best organism
    if (newBest) {
      setSelectedOrganism(newBest);
    }
  };

  /**
   * Auto-evolution loop
   */
  useEffect(() => {
    if (!autoEvolve || !isEvolving) return;

    const interval = setInterval(() => {
      handleEvolve();
    }, evolutionSpeed);

    return () => clearInterval(interval);
  }, [autoEvolve, isEvolving, evolutionSpeed, population]);

  /**
   * Update engine parameters
   */
  useEffect(() => {
    engine.setParameters(mutationRate, crossoverRate);
  }, [mutationRate, crossoverRate]);

  /**
   * Draw DNA double helix visualization
   */
  useEffect(() => {
    if (!selectedOrganism || !showDNA || !dnaCanvasRef.current) return;

    const canvas = dnaCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dna = selectedOrganism.dna;
    const nucleotides = dna.split('');

    // Draw DNA double helix
    const centerY = canvas.height / 2;
    const amplitude = 40;
    const frequency = 0.05;
    const spacing = 8;

    // Color map for nucleotides
    const colors: Record<string, string> = {
      'A': '#0f62fe', // Blue
      'T': '#24a148', // Green
      'G': '#f1c21b', // Yellow
      'C': '#da1e28', // Red
    };

    // Draw helices
    for (let i = 0; i < nucleotides.length && i * spacing < canvas.width; i++) {
      const x = i * spacing;
      const y1 = centerY + amplitude * Math.sin(frequency * x);
      const y2 = centerY - amplitude * Math.sin(frequency * x);

      // Draw nucleotide pairs
      const nucleotide = nucleotides[i];
      const complement = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' }[nucleotide] || 'A';

      // Strand 1
      ctx.fillStyle = colors[nucleotide] || '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y1, 4, 0, Math.PI * 2);
      ctx.fill();

      // Strand 2
      ctx.fillStyle = colors[complement] || '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Base pair connection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.stroke();

      // Backbone
      if (i > 0) {
        const prevX = (i - 1) * spacing;
        const prevY1 = centerY + amplitude * Math.sin(frequency * prevX);
        const prevY2 = centerY - amplitude * Math.sin(frequency * prevX);

        ctx.strokeStyle = 'rgba(15, 98, 254, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY1);
        ctx.lineTo(x, y1);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(36, 161, 72, 0.5)';
        ctx.beginPath();
        ctx.moveTo(prevX, prevY2);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }

      // Label nucleotide
      if (i % 5 === 0) {
        ctx.fillStyle = '#f4f4f4';
        ctx.font = '10px IBM Plex Mono';
        ctx.fillText(nucleotide, x - 3, y1 + 15);
      }
    }

    // Draw title
    ctx.fillStyle = '#f4f4f4';
    ctx.font = '14px IBM Plex Sans';
    ctx.fillText(`DNA Sequence (${dna.length} nucleotides)`, 10, 20);

  }, [selectedOrganism, showDNA]);

  /**
   * Draw quantum circuit visualization
   */
  useEffect(() => {
    if (!selectedOrganism || !showCircuit || !circuitCanvasRef.current) return;

    const canvas = circuitCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const circuit = selectedOrganism.circuit;
    const qubits = 5;
    const qubitSpacing = 60;
    const gateSpacing = 80;
    const startX = 60;
    const startY = 40;

    // Draw qubit wires
    ctx.strokeStyle = '#8d8d8d';
    ctx.lineWidth = 1;
    for (let q = 0; q < qubits; q++) {
      const y = startY + q * qubitSpacing;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();

      // Qubit label
      ctx.fillStyle = '#f4f4f4';
      ctx.font = '12px IBM Plex Mono';
      ctx.fillText(`q${q}`, 20, y + 5);
    }

    // Draw gates
    const gateColors: Record<string, string> = {
      'H': '#0f62fe',
      'X': '#24a148',
      'Y': '#f1c21b',
      'Z': '#da1e28',
      'S': '#8a3ffc',
      'T': '#8a3ffc',
      'RX': '#fa4d56',
      'RY': '#fa4d56',
      'RZ': '#fa4d56',
      'CNOT': '#0f62fe',
      'CZ': '#24a148',
      'SWAP': '#f1c21b',
      'M': '#ee538b',
    };

    circuit.forEach((gate, idx) => {
      const x = startX + (idx % 10) * gateSpacing;
      const y = startY + gate.qubit * qubitSpacing;

      if (['CNOT', 'CZ', 'SWAP'].includes(gate.type) && gate.target !== undefined) {
        // Two-qubit gate
        const targetY = startY + gate.target * qubitSpacing;

        // Control line
        ctx.strokeStyle = gateColors[gate.type];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, targetY);
        ctx.stroke();

        // Control dot
        ctx.fillStyle = gateColors[gate.type];
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Target gate
        ctx.strokeStyle = gateColors[gate.type];
        ctx.fillStyle = '#262626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, targetY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Gate label
        ctx.fillStyle = '#f4f4f4';
        ctx.font = 'bold 10px IBM Plex Mono';
        ctx.textAlign = 'center';
        ctx.fillText(gate.type === 'CNOT' ? 'X' : gate.type[1], x, targetY + 4);

      } else {
        // Single-qubit gate
        ctx.fillStyle = gateColors[gate.type] || '#8d8d8d';
        ctx.strokeStyle = gateColors[gate.type] || '#8d8d8d';
        ctx.lineWidth = 2;

        if (gate.type === 'M') {
          // Measurement
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y + 5, 8, Math.PI, 0);
          ctx.stroke();
        } else {
          // Regular gate
          ctx.fillRect(x - 15, y - 15, 30, 30);

          // Gate label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px IBM Plex Mono';
          ctx.textAlign = 'center';
          ctx.fillText(gate.type, x, y + 5);

          // Parameter label
          if (gate.parameter !== undefined) {
            ctx.font = '8px IBM Plex Mono';
            ctx.fillText(`${(gate.parameter / Math.PI).toFixed(1)}π`, x, y + 25);
          }
        }
      }
    });

    // Draw title
    ctx.fillStyle = '#f4f4f4';
    ctx.font = '14px IBM Plex Sans';
    ctx.textAlign = 'left';
    ctx.fillText(`Quantum Circuit (${circuit.length} gates, depth ${selectedOrganism.depth})`, 10, 20);

  }, [selectedOrganism, showCircuit]);

  /**
   * Draw lineage tree
   */
  useEffect(() => {
    if (!showLineage || !lineageCanvasRef.current || population.length === 0) return;

    const canvas = lineageCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#262626';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Group organisms by generation
    const generations: Record<number, QuantumOrganism[]> = {};
    population.forEach(org => {
      if (!generations[org.generation]) {
        generations[org.generation] = [];
      }
      generations[org.generation].push(org);
    });

    const genNumbers = Object.keys(generations).map(Number).sort((a, b) => a - b);
    const genSpacing = Math.min(100, canvas.width / (genNumbers.length + 1));
    const startY = 50;

    // Draw generation nodes
    genNumbers.forEach((gen, idx) => {
      const x = 50 + idx * genSpacing;
      const orgs = generations[gen];
      const orgSpacing = Math.min(40, (canvas.height - 100) / orgs.length);

      orgs.forEach((org, orgIdx) => {
        const y = startY + orgIdx * orgSpacing;

        // Draw node
        const color = org === selectedOrganism ? '#0f62fe' :
                     org === bestOrganism ? '#24a148' : '#8d8d8d';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Fitness indicator (size)
        if (org.fitness > 0.7) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    });

    // Draw title
    ctx.fillStyle = '#f4f4f4';
    ctx.font = '14px IBM Plex Sans';
    ctx.fillText('Evolutionary Lineage', 10, 25);

  }, [population, selectedOrganism, bestOrganism, showLineage]);

  /**
   * Render gate list for selected organism
   */
  const renderGateList = (circuit: QuantumGate[]) => {
    return circuit.map((gate, idx) => {
      let gateStr = `${gate.type}`;
      if (gate.target !== undefined) {
        gateStr += ` q${gate.qubit}→q${gate.target}`;
      } else {
        gateStr += ` q${gate.qubit}`;
      }
      if (gate.parameter !== undefined) {
        gateStr += ` (${(gate.parameter / Math.PI).toFixed(2)}π)`;
      }
      return gateStr;
    }).join(', ');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#161616', minHeight: '100vh' }}>
      <Grid>
        {/* Header */}
        <Column lg={16}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Chemistry size={32} style={{ color: '#0f62fe' }} />
              Quantum DNA Evolution Lab
            </h2>
            <p style={{ color: '#c6c6c6', fontSize: '14px' }}>
              Watch quantum circuits evolve as living organisms through natural selection
            </p>
          </div>
        </Column>

        {/* Control Panel */}
        <Column lg={4}>
          <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
            <h4 style={{ color: '#f4f4f4', marginBottom: '16px', fontSize: '16px' }}>
              Evolution Controls
            </h4>

            <div style={{ marginBottom: '16px' }}>
              <Button
                kind="primary"
                renderIcon={isEvolving ? Pause : Play}
                onClick={() => {
                  if (population.length === 0) {
                    handleGenesis();
                  }
                  setIsEvolving(!isEvolving);
                  setAutoEvolve(!isEvolving);
                }}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                {isEvolving ? 'Pause Evolution' : 'Start Evolution'}
              </Button>

              <Button
                kind="secondary"
                renderIcon={ChevronRight}
                onClick={handleEvolve}
                disabled={isEvolving}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                Single Generation
              </Button>

              <Button
                kind="tertiary"
                renderIcon={Renew}
                onClick={handleGenesis}
                style={{ width: '100%' }}
              >
                New Genesis
              </Button>
            </div>

            <div style={{ borderTop: '1px solid #393939', paddingTop: '16px' }}>
              <NumberInput
                id="population-size"
                label="Population Size"
                value={populationSize}
                min={10}
                max={200}
                step={10}
                onChange={(e: any) => setPopulationSize(Number(e.target.value))}
                style={{ marginBottom: '16px' }}
                disabled={isEvolving}
              />

              <NumberInput
                id="circuit-length"
                label="Circuit Length"
                value={circuitLength}
                min={5}
                max={30}
                step={5}
                onChange={(e: any) => setCircuitLength(Number(e.target.value))}
                style={{ marginBottom: '16px' }}
                disabled={isEvolving}
              />

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#c6c6c6', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  Mutation Rate: {mutationRate.toFixed(2)}
                </label>
                <Slider
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={mutationRate}
                  onChange={({ value }) => setMutationRate(value)}
                  disabled={isEvolving}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#c6c6c6', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  Crossover Rate: {crossoverRate.toFixed(2)}
                </label>
                <Slider
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={crossoverRate}
                  onChange={({ value }) => setCrossoverRate(value)}
                  disabled={isEvolving}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#c6c6c6', fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                  Evolution Speed: {evolutionSpeed}ms
                </label>
                <Slider
                  min={100}
                  max={2000}
                  step={100}
                  value={evolutionSpeed}
                  onChange={({ value }) => setEvolutionSpeed(value)}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #393939', paddingTop: '16px' }}>
              <h5 style={{ color: '#f4f4f4', marginBottom: '12px', fontSize: '14px' }}>
                Visualization
              </h5>
              <Toggle
                id="show-dna"
                labelText="Show DNA Helix"
                toggled={showDNA}
                onToggle={setShowDNA}
                size="sm"
                style={{ marginBottom: '8px' }}
              />
              <Toggle
                id="show-circuit"
                labelText="Show Circuit"
                toggled={showCircuit}
                onToggle={setShowCircuit}
                size="sm"
                style={{ marginBottom: '8px' }}
              />
              <Toggle
                id="show-lineage"
                labelText="Show Lineage"
                toggled={showLineage}
                onToggle={setShowLineage}
                size="sm"
              />
            </div>
          </Tile>
        </Column>

        {/* Main Visualization */}
        <Column lg={12}>
          {/* Metrics Dashboard */}
          {metrics && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
              <Grid condensed>
                <Column sm={4} md={2} lg={4}>
                  <div>
                    <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                      Generation
                    </div>
                    <div style={{ color: '#f4f4f4', fontSize: '24px', fontWeight: 600 }}>
                      {metrics.generation}
                    </div>
                  </div>
                </Column>
                <Column sm={4} md={2} lg={4}>
                  <div>
                    <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                      Max Fitness
                    </div>
                    <div style={{ color: '#24a148', fontSize: '24px', fontWeight: 600 }}>
                      {metrics.max_fitness.toFixed(3)}
                    </div>
                  </div>
                </Column>
                <Column sm={4} md={2} lg={4}>
                  <div>
                    <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                      Avg Fitness
                    </div>
                    <div style={{ color: '#0f62fe', fontSize: '24px', fontWeight: 600 }}>
                      {metrics.avg_fitness.toFixed(3)}
                    </div>
                  </div>
                </Column>
                <Column sm={4} md={2} lg={4}>
                  <div>
                    <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                      Diversity
                    </div>
                    <div style={{ color: '#f1c21b', fontSize: '24px', fontWeight: 600 }}>
                      {(metrics.diversity * 100).toFixed(1)}%
                    </div>
                    <ProgressBar
                      value={metrics.diversity * 100}
                      max={100}
                      size="sm"
                      helperText=""
                    />
                  </div>
                </Column>
              </Grid>
            </Tile>
          )}

          {/* DNA Visualization */}
          {showDNA && selectedOrganism && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
              <canvas
                ref={dnaCanvasRef}
                width={800}
                height={200}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Tile>
          )}

          {/* Circuit Visualization */}
          {showCircuit && selectedOrganism && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
              <canvas
                ref={circuitCanvasRef}
                width={900}
                height={350}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Tile>
          )}

          {/* Lineage Visualization */}
          {showLineage && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
              <canvas
                ref={lineageCanvasRef}
                width={800}
                height={300}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Tile>
          )}

          {/* Selected Organism Details */}
          {selectedOrganism && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px', marginBottom: '16px' }}>
              <h4 style={{ color: '#f4f4f4', marginBottom: '16px', fontSize: '16px' }}>
                <Microscope size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Organism Details
              </h4>

              <Grid condensed>
                <Column lg={8}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#8d8d8d', fontSize: '12px' }}>ID: </span>
                    <code style={{ color: '#f4f4f4', fontSize: '12px', fontFamily: 'IBM Plex Mono' }}>
                      {selectedOrganism.id}
                    </code>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#8d8d8d', fontSize: '12px' }}>DNA Sequence: </span>
                    <div style={{
                      color: '#0f62fe',
                      fontSize: '12px',
                      fontFamily: 'IBM Plex Mono',
                      wordBreak: 'break-all',
                      marginTop: '4px',
                      padding: '8px',
                      backgroundColor: '#161616',
                      borderRadius: '4px'
                    }}>
                      {selectedOrganism.dna}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#8d8d8d', fontSize: '12px' }}>Circuit: </span>
                    <div style={{
                      color: '#c6c6c6',
                      fontSize: '11px',
                      fontFamily: 'IBM Plex Mono',
                      marginTop: '4px',
                      padding: '8px',
                      backgroundColor: '#161616',
                      borderRadius: '4px',
                      maxHeight: '100px',
                      overflowY: 'auto'
                    }}>
                      {renderGateList(selectedOrganism.circuit)}
                    </div>
                  </div>
                </Column>

                <Column lg={8}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Fitness
                      </div>
                      <Tag type="green" size="md">
                        {selectedOrganism.fitness.toFixed(4)}
                      </Tag>
                    </div>

                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Coherence
                      </div>
                      <Tag type={selectedOrganism.coherence > 0.7 ? 'green' : selectedOrganism.coherence > 0.5 ? 'yellow' : 'red'} size="md">
                        {(selectedOrganism.coherence * 100).toFixed(1)}%
                      </Tag>
                    </div>

                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Generation
                      </div>
                      <Tag type="blue" size="md">
                        Gen {selectedOrganism.generation}
                      </Tag>
                    </div>

                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Age
                      </div>
                      <Tag type="gray" size="md">
                        {selectedOrganism.age} gen
                      </Tag>
                    </div>

                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Circuit Depth
                      </div>
                      <Tag type="purple" size="md">
                        {selectedOrganism.depth}
                      </Tag>
                    </div>

                    <div>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Gates
                      </div>
                      <Tag type="cyan" size="md">
                        {selectedOrganism.circuit.length}
                      </Tag>
                    </div>
                  </div>

                  {selectedOrganism.lineage.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ color: '#8d8d8d', fontSize: '12px', marginBottom: '4px' }}>
                        Lineage
                      </div>
                      <div style={{
                        fontSize: '10px',
                        fontFamily: 'IBM Plex Mono',
                        color: '#c6c6c6',
                        padding: '8px',
                        backgroundColor: '#161616',
                        borderRadius: '4px'
                      }}>
                        Parents: {selectedOrganism.lineage.join(', ')}
                      </div>
                    </div>
                  )}
                </Column>
              </Grid>
            </Tile>
          )}

          {/* Population Table */}
          {population.length > 0 && (
            <Tile style={{ backgroundColor: '#262626', padding: '20px' }}>
              <h4 style={{ color: '#f4f4f4', marginBottom: '16px', fontSize: '16px' }}>
                <DataVis_1 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Population ({population.length} organisms)
              </h4>

              <DataTable
                rows={population.slice(0, 20).map((org, idx) => ({
                  id: org.id,
                  rank: idx + 1,
                  fitness: org.fitness.toFixed(4),
                  coherence: (org.coherence * 100).toFixed(1) + '%',
                  depth: org.depth,
                  gates: org.circuit.length,
                  generation: org.generation,
                  age: org.age,
                  org: org,
                }))}
                headers={[
                  { key: 'rank', header: 'Rank' },
                  { key: 'fitness', header: 'Fitness' },
                  { key: 'coherence', header: 'Coherence' },
                  { key: 'depth', header: 'Depth' },
                  { key: 'gates', header: 'Gates' },
                  { key: 'generation', header: 'Gen' },
                  { key: 'age', header: 'Age' },
                ]}
              >
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                  <TableContainer>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header: any) => (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => (
                          <TableRow
                            {...getRowProps({ row })}
                            onClick={() => setSelectedOrganism(row.cells.find((c: any) => c.info.header === 'rank').value.org || population[row.id])}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: selectedOrganism?.id === row.id ? '#393939' : undefined
                            }}
                          >
                            {row.cells.map((cell: any) => (
                              <TableCell key={cell.id}>
                                {cell.info.header === 'rank' && cell.value === 1 ? (
                                  <span style={{ color: '#24a148', fontWeight: 600 }}>
                                    👑 {cell.value}
                                  </span>
                                ) : (
                                  cell.value
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>

              {population.length > 20 && (
                <p style={{ color: '#8d8d8d', fontSize: '12px', marginTop: '12px' }}>
                  Showing top 20 organisms. Total population: {population.length}
                </p>
              )}
            </Tile>
          )}

          {/* Empty State */}
          {population.length === 0 && (
            <Tile style={{ backgroundColor: '#262626', padding: '60px 20px', textAlign: 'center' }}>
              <Chemistry size={48} style={{ color: '#8d8d8d', marginBottom: '16px' }} />
              <h4 style={{ color: '#f4f4f4', marginBottom: '8px', fontSize: '18px' }}>
                Ready to Begin Evolution
              </h4>
              <p style={{ color: '#8d8d8d', fontSize: '14px', marginBottom: '24px' }}>
                Click "Start Evolution" or "New Genesis" to create an initial population
              </p>
            </Tile>
          )}
        </Column>
      </Grid>
    </div>
  );
};

export default QuantumEvolutionLab;
