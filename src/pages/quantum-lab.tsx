/**
 * Quantum DNA Evolution Lab - Demo Page
 *
 * This page showcases the natural philosophy of DNA-Lang:
 * Quantum circuits as living organisms that evolve through natural selection
 */

import React from 'react';
import QuantumEvolutionLab from '../components/ibm/QuantumEvolutionLab';
import { Theme } from '@carbon/react';

const QuantumLabPage: React.FC = () => {
  return (
    <Theme theme="g100">
      <QuantumEvolutionLab />
    </Theme>
  );
};

export default QuantumLabPage;
