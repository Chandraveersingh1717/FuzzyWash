import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import DefuzzificationPanel from '../components/DefuzzificationPanel';

export const Defuzzification: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Centroid Defuzzification Laboratory</h2>
          </div>
          <p className="text-xs text-slate-400">
            Center of Gravity integration converting continuous fuzzy distributions into exact discrete hardware commands
          </p>
        </div>
      </div>

      <DefuzzificationPanel />
    </motion.div>
  );
};

export default Defuzzification;
