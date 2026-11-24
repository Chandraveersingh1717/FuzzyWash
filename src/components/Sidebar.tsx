import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FlaskConical,
  Clock,
  Beaker,
  BookOpen,
  Calculator,
  GitCompare,
  Zap,
  GraduationCap,
  TestTube2,
  Waves,
} from 'lucide-react';
import { useFuzzyStore, PageId } from '../store/fuzzyStore';

interface NavItem {
  id: PageId;
  label: string;
  description: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview & live outputs',
    icon: LayoutDashboard,
  },
  {
    id: 'simulator',
    label: 'Interactive Simulator',
    description: 'Tune sensors in real time',
    icon: FlaskConical,
  },
  {
    id: 'timemachine',
    label: 'Algorithm Time Machine',
    description: 'Step through fuzzy logic',
    icon: Clock,
  },
  {
    id: 'laboratory',
    label: 'Membership Lab',
    description: 'Edit membership functions',
    icon: Beaker,
  },
  {
    id: 'rules',
    label: 'Rule Engine',
    description: 'Manage fuzzy rule base',
    icon: BookOpen,
  },
  {
    id: 'defuzzification',
    label: 'Defuzzification',
    description: 'Crisp output methods',
    icon: Calculator,
  },
  {
    id: 'comparison',
    label: 'What-If Comparison',
    description: 'Compare scenarios side-by-side',
    icon: GitCompare,
  },
  {
    id: 'fuzzyVsTraditional',
    label: 'Fuzzy vs Traditional',
    description: 'Benchmark against fixed logic',
    icon: Zap,
  },
  {
    id: 'learn',
    label: 'Learning Center',
    description: 'Theory & guided tutorials',
    icon: GraduationCap,
  },
  {
    id: 'validation',
    label: 'Validation Lab',
    description: 'Test & validate the engine',
    icon: TestTube2,
  },
];

const Sidebar: React.FC = () => {
  const activePage = useFuzzyStore((s) => s.activePage);
  const setActivePage = useFuzzyStore((s) => s.setActivePage);

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        width: 280,
        background: 'rgba(7, 15, 35, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 212, 255, 0.12)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cyan-900/30">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
            boxShadow: '0 0 18px rgba(0,212,255,0.4)',
          }}
        >
          <Waves size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-wide">
            FuzzyWash
          </h1>
          <p className="text-cyan-400/70 text-xs font-medium tracking-widest uppercase">
            Fuzzy Logic Engine
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-cyan-900/40">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors duration-200 group"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.06) 100%)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(0,212,255,0.3)'
                  : '1px solid transparent',
              }}
            >
              {/* Active left accent bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  width: 36,
                  height: 36,
                  background: isActive
                    ? 'rgba(0,212,255,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: isActive ? '0 0 12px rgba(0,212,255,0.3)' : 'none',
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? '#00d4ff' : '#64748b' }}
                  className="transition-colors duration-200 group-hover:text-cyan-400"
                />
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate transition-colors duration-200"
                  style={{ color: isActive ? '#e0f7ff' : '#94a3b8' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-xs truncate transition-colors duration-200"
                  style={{ color: isActive ? 'rgba(0,212,255,0.6)' : '#475569' }}
                >
                  {item.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t border-cyan-900/30"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <p className="text-xs text-slate-600 text-center">
          Mamdani Fuzzy System · v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
