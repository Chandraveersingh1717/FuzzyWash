import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  summary: string;
  formula?: string;
  example: string;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Introduction to Fuzzy Logic',
    summary: 'Introduced by Lotfi Zadeh in 1965, fuzzy logic is a mathematical approach to modeling uncertainty, approximation, and partial truth, rather than rigid 0 or 1 binary logic.',
    example: 'In real life, laundry is rarely 100% filthy or 100% spotless. It is "somewhat greasy" or "moderately dirty".',
  },
  {
    id: 2,
    title: 'Crisp Values vs Fuzzy Values',
    summary: 'A crisp value is an exact real number (e.g. 35.4% dirtiness, 5.2 kg load). A fuzzy value is a degree of membership between 0 and 1 assigned to linguistic sets like "Medium Dirt".',
    formula: 'μ_A(x) ∈ [0, 1]',
    example: '35% dirtiness is crisp. Belonging 0.3 to "Small" and 0.7 to "Medium" is fuzzy.',
  },
  {
    id: 3,
    title: 'Why Fuzzy Logic is Useful',
    summary: 'Complex real-world processes have non-linear dynamics and noisy sensors. Fuzzy logic simplifies multi-variable engineering without requiring intractable differential equations.',
    example: 'Washing machines need to control water, heat, motor speed, and soap simultaneously based on 5 noisy sensors.',
  },
  {
    id: 4,
    title: 'Fuzzification',
    summary: 'Fuzzification is the first computational phase where crisp sensor telemetry is passed through membership functions to determine the degree of belonging to each fuzzy set.',
    formula: 'f: ℝ → [0, 1]^k',
    example: 'Taking 35% dirtiness and calculating μ_Small = 0.30, μ_Medium = 0.70, μ_Large = 0.00.',
  },
  {
    id: 5,
    title: 'Membership Functions (MFs)',
    summary: 'A graphical curve that defines how each point in the input space is mapped to a membership degree between 0 and 1.',
    example: 'Common shapes include triangular, trapezoidal, Gaussian, and bell-shaped curves.',
  },
  {
    id: 6,
    title: 'Triangular Membership Functions',
    summary: 'Specified by 3 parameters: left foot (a), peak center (b), and right foot (c). Peak has degree 1, feet have degree 0.',
    formula: 'μ(x) = max(0, min((x-a)/(b-a), (c-x)/(c-b)))',
    example: 'Medium dirt: a=25, b=50, c=75. At x=50, membership is exactly 1.0.',
  },
  {
    id: 7,
    title: 'Trapezoidal Membership Functions',
    summary: 'Specified by 4 parameters: left foot (a), left shoulder (b), right shoulder (c), and right foot (d). Plateaus at 1 between b and c.',
    formula: 'μ(x) = max(0, min((x-a)/(b-a), 1, (d-x)/(d-c)))',
    example: 'Small dirt: a=0, b=0, c=25, d=50. Any dirt below 25% has full 1.0 membership.',
  },
  {
    id: 8,
    title: 'Fuzzy IF–THEN Rules',
    summary: 'Rules encapsulate human expert knowledge: "IF condition THEN consequence". Fuzzy operators handle combinations.',
    formula: 'AND = min(μ_A, μ_B),  OR = max(μ_A, μ_B)',
    example: 'IF Dirtiness is Large AND Greasiness is Greasy THEN WashTime = VeryLong.',
  },
  {
    id: 9,
    title: 'Mamdani Inference',
    summary: 'Proposed by Ebrahim Mamdani in 1975 to control a steam engine. Uses MIN for fuzzy implication and MAX for fuzzy aggregation.',
    example: 'Standard inference architecture used in smart household consumer appliances worldwide.',
  },
  {
    id: 10,
    title: 'Rule Implication (Clipping)',
    summary: 'Once the rule firing strength α is computed, the consequent membership function is clipped at height α.',
    formula: 'μ_clipped(z) = min(α, μ_consequent(z))',
    example: 'If firing strength is 0.6, the triangle for "Long Wash" is sliced off horizontally at height 0.6.',
  },
  {
    id: 11,
    title: 'Rule Aggregation',
    summary: 'The process of unifying all clipped consequent fuzzy sets from all activated rules into a single continuous fuzzy distribution using MAX.',
    formula: 'μ_agg(z) = max_i(μ_clipped_i(z))',
    example: 'Multiple rules might suggest "Short" and "Medium" wash times; aggregation merges both recommendations.',
  },
  {
    id: 12,
    title: 'Centroid Defuzzification',
    summary: 'Converts the aggregated fuzzy distribution into a single crisp numerical value by computing the Center of Gravity (geometric centroid).',
    formula: 'z* = ∫ z · μ(z) dz / ∫ μ(z) dz',
    example: 'Yields an exact cycle time of 37.8 minutes for the micro-controller timer.',
  },
  {
    id: 13,
    title: 'Real-World Industrial Applications',
    summary: 'Fuzzy controllers are ubiquitous: Tokyo subway automatic train operation, automobile anti-lock braking systems (ABS), camera autofocus, air conditioners, and washing machines.',
    example: 'Hitachi, Panasonic, and Whirlpool machines use fuzzy logic to reduce water consumption by up to 30%.',
  },
];

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'If dirtiness is 35%, and the Small and Medium fuzzy sets overlap, what happens?',
    options: [
      'Only the Small fuzzy set activates',
      'Only the Medium fuzzy set activates',
      'Both sets can activate simultaneously with distinct membership degrees',
      'Neither activates until a crisp threshold is crossed',
    ],
    answer: 2,
    explanation: 'In fuzzy logic, an input can have partial simultaneous membership across multiple overlapping sets (e.g. 0.3 Small and 0.7 Medium).',
  },
  {
    question: 'In standard Mamdani inference, which mathematical operator is used for the logical AND connector?',
    options: ['Average (mean)', 'Minimum (min)', 'Maximum (max)', 'Multiplication only'],
    answer: 1,
    explanation: 'Zadeh / Mamdani standard fuzzy intersection (AND) is evaluated using the minimum operator: min(μ_A, μ_B).',
  },
  {
    question: 'What is the purpose of Centroid Defuzzification?',
    options: [
      'To convert crisp sensor numbers into fuzzy linguistic tags',
      'To calculate the geometric center of gravity and produce a single crisp hardware actuation command',
      'To filter out noise from the optical sensor',
      'To clip the antecedent membership functions',
    ],
    answer: 1,
    explanation: 'Centroid defuzzification integrates the aggregated fuzzy area to find the balance point z*, providing the exact number needed by physical actuators.',
  },
];

export const Learn: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const activeLesson = LESSONS.find((l) => l.id === selectedLesson) || LESSONS[0];

  const toggleLessonComplete = (id: number) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((i) => i !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
  };

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
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-100">Interactive Fuzzy Logic Learning Academy</h2>
          </div>
          <p className="text-xs text-slate-400">
            Comprehensive curriculum covering theory, mathematical formulations, Mamdani pipeline, and industrial engineering
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">
            Progress: {completedLessons.length} / {LESSONS.length} Completed
          </span>
        </div>
      </div>

      {/* Main 2-Col Layout: Lesson Navigation on Left, Content & Quiz on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic List */}
        <div className="lg:col-span-4 glass p-4 rounded-2xl border border-slate-800 space-y-2 max-h-[640px] overflow-y-auto">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2 px-1">
            Course Modules
          </span>
          {LESSONS.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isSelected = selectedLesson === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-slate-100 font-bold'
                    : 'hover:bg-slate-900/60 text-slate-400 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLessonComplete(lesson.id);
                    }}
                    className={`cursor-pointer ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="truncate max-w-[200px]">{lesson.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            );
          })}
        </div>

        {/* Right Active Lesson Detail & Quizzes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Lesson Card */}
          <div className="glass p-6 rounded-2xl border border-cyan-500/30 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Module {activeLesson.id}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{activeLesson.title}</h3>
              </div>
              <button
                onClick={() => toggleLessonComplete(activeLesson.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition ${
                  completedLessons.includes(activeLesson.id)
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {completedLessons.includes(activeLesson.id) ? 'Marked Done' : 'Mark as Done'}
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>{activeLesson.summary}</p>

              {activeLesson.formula && (
                <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 text-center font-mono text-cyan-300 text-sm font-bold shadow-inner">
                  {activeLesson.formula}
                </div>
              )}

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold block">
                  Washing Machine Application:
                </span>
                <p className="text-slate-300 text-xs italic">{activeLesson.example}</p>
              </div>
            </div>
          </div>

          {/* Interactive Knowledge Quiz Section */}
          <div className="glass p-6 rounded-2xl border border-indigo-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Fuzzy Logic Mastery Quiz</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">3 Questions</span>
            </div>

            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-200">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrect = showResults && optIdx === q.answer;
                      const isWrong = showResults && isSelected && optIdx !== q.answer;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuiz(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                            isCorrect
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                              : isWrong
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : isSelected
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{opt}</span>
                          {showResults && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {showResults && isWrong && <XCircle className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-[11px] text-slate-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowResults(!showResults)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg hover:shadow-indigo-500/25 transition active:scale-95"
            >
              {showResults ? 'Hide Answers' : 'Check My Answers'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Learn;
