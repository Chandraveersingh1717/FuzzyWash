import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import { useFuzzyStore } from './store/fuzzyStore';

// --- Lazy page imports ---
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Simulator = React.lazy(() => import('./pages/Simulator'));
const TimeMachine = React.lazy(() => import('./pages/TimeMachine'));
const Laboratory = React.lazy(() => import('./pages/Laboratory'));
const Rules = React.lazy(() => import('./pages/Rules'));
const Defuzzification = React.lazy(() => import('./pages/Defuzzification'));
const Comparison = React.lazy(() => import('./pages/Comparison'));
const FuzzyVsTraditional = React.lazy(() => import('./pages/FuzzyVsTraditional'));
const Learn = React.lazy(() => import('./pages/Learn'));
const Validation = React.lazy(() => import('./pages/Validation'));

// --- Fallback spinner ---
const PageSpinner: React.FC = () => (
  <div className="flex flex-1 items-center justify-center h-full">
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-full border-4 border-cyan-900 border-t-cyan-400 animate-spin"
        style={{ width: 48, height: 48 }}
      />
      <p className="text-cyan-400/60 text-sm tracking-widest uppercase">Loading…</p>
    </div>
  </div>
);

// --- Page map ---
const PAGE_MAP: Record<string, React.ComponentType<any>> = {
  dashboard: Dashboard,
  simulator: Simulator,
  timemachine: TimeMachine,
  laboratory: Laboratory,
  rules: Rules,
  defuzzification: Defuzzification,
  comparison: Comparison,
  fuzzyVsTraditional: FuzzyVsTraditional,
  'fuzzy-vs-traditional': FuzzyVsTraditional,
  learn: Learn,
  validation: Validation,
};

const App: React.FC = () => {
  const activePage = useFuzzyStore((s) => s.activePage);

  const ActivePage = PAGE_MAP[activePage] ?? Dashboard;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#0B1020' }}
    >
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ marginLeft: 280 }}
      >
        <Suspense fallback={<PageSpinner />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="min-h-full"
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
