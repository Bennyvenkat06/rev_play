import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { GitPullRequest, Check, X, ArrowRight, ArrowDown, ArrowUp, Zap } from 'lucide-react';

interface RecursionMazeProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface RecursionStep {
  depth: number;
  call: string;
  isBaseCase: boolean;
  returnValue: number | string;
  status: 'descending' | 'base' | 'unwinding';
}

interface RecursionLevel {
  id: number;
  title: string;
  functionCode: string;
  invocation: string;
  tree: RecursionStep[];
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const RECURSION_LEVELS: RecursionLevel[] = [
  {
    id: 1,
    title: 'Factorial Descent & Unwinding Trace',
    functionCode: `long factorial(int n) {
    if (n <= 1) return 1;       // Base case
    return n * factorial(n - 1); // Recursive step
}`,
    invocation: 'factorial(4)',
    tree: [
      { depth: 1, call: 'factorial(4) -> 4 * factorial(3)', isBaseCase: false, returnValue: 'waiting...', status: 'descending' },
      { depth: 2, call: 'factorial(3) -> 3 * factorial(2)', isBaseCase: false, returnValue: 'waiting...', status: 'descending' },
      { depth: 3, call: 'factorial(2) -> 2 * factorial(1)', isBaseCase: false, returnValue: 'waiting...', status: 'descending' },
      { depth: 4, call: 'factorial(1) -> hits base case!', isBaseCase: true, returnValue: '1', status: 'base' },
      { depth: 3, call: 'factorial(2) computes 2 * 1', isBaseCase: false, returnValue: '2', status: 'unwinding' },
      { depth: 2, call: 'factorial(3) computes 3 * 2', isBaseCase: false, returnValue: '6', status: 'unwinding' },
      { depth: 1, call: 'factorial(4) computes 4 * 6', isBaseCase: false, returnValue: '24', status: 'unwinding' },
    ],
    prompt: 'How many total stack activation frames were pushed onto the call stack simultaneously at peak descent before the base case returned?',
    options: ['4 stack frames', '3 stack frames', '1 stack frame', '24 stack frames'],
    correctIndex: 0,
    explanation: 'Peak stack depth occurred at factorial(1) when 4 frames: factorial(4), factorial(3), factorial(2), and factorial(1) all co-existed on the stack.'
  },
  {
    id: 2,
    title: 'Missing Base Case Trap',
    functionCode: `int countdown(int n) {
    printf("%d ", n);
    return countdown(n - 1); // Notice: NO base condition!
}`,
    invocation: 'countdown(5)',
    tree: [
      { depth: 1, call: 'countdown(5)', isBaseCase: false, returnValue: '?', status: 'descending' },
      { depth: 2, call: 'countdown(4)', isBaseCase: false, returnValue: '?', status: 'descending' },
      { depth: 3, call: 'countdown(3)... and so on infinitely', isBaseCase: false, returnValue: '?', status: 'descending' },
    ],
    prompt: 'What fatal runtime error occurs when executing `countdown(5)` without a base case?',
    options: [
      'Stack Overflow crash (Segmentation Fault)',
      'Returns 0 when n reaches 0',
      'The CPU automatically pauses the loop',
      'Compiles with an error before running'
    ],
    correctIndex: 0,
    explanation: 'Without a base condition, the function calls itself indefinitely, consuming call stack frames until memory is exhausted, triggering a fatal Stack Overflow crash.'
  }
];

export const RecursionMaze: React.FC<RecursionMazeProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u4-recursion-maze'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const lvl = RECURSION_LEVELS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === lvl.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 80);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Recursion Maze: ${lvl.title}`,
          studentAnswer: lvl.options[idx],
          correctAnswer: lvl.options[lvl.correctIndex],
          explanation: lvl.explanation,
          conceptRef: 'CS103ES Unit IV: Nature of recursion, base case requirement, call stack unwinding.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < RECURSION_LEVELS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      const finalScore = score;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const percentage = Math.round((finalScore / gameDef.maxScore) * 100);
      const stars: 1 | 2 | 3 = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

      onComplete({
        gameId: gameDef.id,
        unitId: gameDef.unitId,
        score: finalScore,
        maxScore: gameDef.maxScore,
        percentage,
        xpEarned: Math.round(gameDef.xpReward * (percentage / 100)),
        starsEarned: stars,
        timeSpentSeconds: timeSpent,
        completedAt: new Date().toISOString(),
        mistakes
      });
    }
  };

  return (
    <GameContainer
      game={gameDef}
      score={score}
      maxScore={gameDef.maxScore}
      onOpenNotes={onOpenNotes}
      onExit={onExit}
      onRestart={() => {
        setCurrentIdx(0);
        setSelectedOpt(null);
        setIsAnswered(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
            Recursion Chamber {currentIdx + 1} of {RECURSION_LEVELS.length}
          </span>
          <h2 className="text-lg font-bold text-white">{lvl.title}</h2>
        </div>

        {/* Visual Call Tree */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>C Recursive Definition</span>
              <span className="text-amber-400">{lvl.invocation}</span>
            </div>
            <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
              <code>{lvl.functionCode}</code>
            </pre>
          </div>

          <div className="md:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 max-h-72 overflow-y-auto">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Activation Trace Sequence</span>
            </div>
            {lvl.tree.map((step, sIdx) => (
              <div 
                key={sIdx}
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between gap-2 ${
                  step.isBaseCase 
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : step.status === 'unwinding'
                    ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                style={{ marginLeft: `${(step.depth - 1) * 8}px` }}
              >
                <div className="flex items-center gap-1.5">
                  {step.status === 'descending' && <ArrowDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  {step.status === 'base' && <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {step.status === 'unwinding' && <ArrowUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  <span>{step.call}</span>
                </div>
                <span className="text-[10px] text-slate-500">{step.returnValue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white">
            {lvl.prompt}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lvl.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === lvl.correctIndex) {
                  style = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold glow-neon';
                } else if (idx === selectedOpt) {
                  style = 'bg-rose-950/90 border-rose-500 text-rose-300';
                } else {
                  style = 'opacity-40 border-slate-800 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === lvl.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== lvl.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Recursion Rule:</strong> {lvl.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < RECURSION_LEVELS.length ? 'Next Chamber' : 'Complete Recursion Maze'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

