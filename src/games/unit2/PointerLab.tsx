import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Database, Check, X, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

interface PointerLabProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface MemoryCell {
  address: string;
  varName: string;
  type: string;
  value: number | string;
}

interface PointerQuestion {
  id: number;
  memory: MemoryCell[];
  questionPrompt: string;
  codeSnippet: string;
  targetAddress: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const POINTER_QUESTIONS: PointerQuestion[] = [
  {
    id: 1,
    memory: [
      { address: '0x1000', varName: 'alpha', type: 'int', value: 42 },
      { address: '0x1004', varName: 'beta', type: 'int', value: 99 },
      { address: '0x1008', varName: 'ptr', type: 'int*', value: '0x1000' },
    ],
    codeSnippet: `int alpha = 42;
int beta = 99;
int *ptr = &alpha;
*ptr = 77;`,
    questionPrompt: 'After executing `*ptr = 77;`, which memory address was modified, and what is the new value of `alpha`?',
    targetAddress: '0x1000',
    options: [
      'Address 0x1000 modified; alpha becomes 77',
      'Address 0x1008 modified; ptr becomes 77',
      'Address 0x1004 modified; beta becomes 77',
      'Segmentation Fault occurs'
    ],
    correctIndex: 0,
    explanation: 'ptr stores 0x1000 (&alpha). Dereferencing (*ptr) writes directly into memory location 0x1000, updating alpha to 77. ptr itself (at 0x1008) remains 0x1000.'
  },
  {
    id: 2,
    memory: [
      { address: '0x2000', varName: 'val', type: 'int', value: 10 },
      { address: '0x2004', varName: 'p1', type: 'int*', value: '0x2000' },
      { address: '0x2008', varName: 'p2', type: 'int**', value: '0x2004' },
    ],
    codeSnippet: `int val = 10;
int *p1 = &val;
int **p2 = &p1;
int res = **p2 + 5;`,
    questionPrompt: 'What is the value of `res` after resolving double indirection `**p2`?',
    targetAddress: '0x2000',
    options: ['15', '10', '0x2000', '0x2004'],
    correctIndex: 0,
    explanation: '*p2 yields p1 (0x2004), and *(*p2) dereferences 0x2004 to access val (10). Thus 10 + 5 = 15.'
  },
  {
    id: 3,
    memory: [
      { address: '0x3000', varName: 'arr[0]', type: 'int', value: 100 },
      { address: '0x3004', varName: 'arr[1]', type: 'int', value: 200 },
      { address: '0x3008', varName: 'arr[2]', type: 'int', value: 300 },
      { address: '0x300C', varName: 'ptr', type: 'int*', value: '0x3000' },
    ],
    codeSnippet: `int arr[3] = {100, 200, 300};
int *ptr = arr;
int val = *(ptr + 2);`,
    questionPrompt: 'What memory address does `(ptr + 2)` point to, and what value does `val` receive?',
    targetAddress: '0x3008',
    options: [
      'Points to 0x3008; val = 300',
      'Points to 0x3002; val = 200',
      'Points to 0x3004; val = 200',
      'Points to 0x300C; val = 100'
    ],
    correctIndex: 0,
    explanation: 'Pointer arithmetic scales by sizeof(int) = 4 bytes. ptr + 2 advances 2 * 4 = 8 bytes: 0x3000 + 8 = 0x3008. Dereferencing *(0x3008) yields 300.'
  }
];

export const PointerLab: React.FC<PointerLabProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u2-pointer-lab'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const currentQ = POINTER_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 50);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Pointer Lab: ${currentQ.questionPrompt}`,
          studentAnswer: currentQ.options[idx],
          correctAnswer: currentQ.options[currentQ.correctIndex],
          explanation: currentQ.explanation,
          conceptRef: 'CS103ES Unit II: Pointers and indirection operator (*, &).'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < POINTER_QUESTIONS.length) {
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
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            Memory Investigation #{currentIdx + 1} of {POINTER_QUESTIONS.length}
          </span>
          <h2 className="text-lg font-bold text-white">Visual RAM Grid & Pointer Indirection</h2>
        </div>

        {/* Visual RAM Grid Display */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400 uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Illustrative RAM Memory Model (32-bit Simulated)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Conceptual byte addresses & pointer links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQ.memory.map((cell) => {
              const isTarget = cell.address === currentQ.targetAddress;
              const isPointer = cell.type.includes('*');
              const pointsToVar = currentQ.memory.find(m => m.address === cell.value);

              return (
                <div 
                  key={cell.address}
                  className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isTarget 
                      ? 'bg-emerald-950/70 border-emerald-500 shadow-lg glow-neon scale-[1.02]' 
                      : isPointer
                      ? 'bg-indigo-950/50 border-indigo-500/70 shadow-md'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400 font-bold">{cell.address}</span>
                    <span className="text-slate-500 font-semibold">{cell.type}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white font-mono">{cell.varName}</span>
                    {isTarget && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600 animate-pulse">
                        Target & Dereference
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-emerald-300 font-mono mt-2">
                    Value: <strong className="text-white text-sm">{String(cell.value)}</strong>
                  </div>

                  {/* Visual Pointer Connection Indicator */}
                  {isPointer && pointsToVar && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-800/60 text-[10px] font-mono text-indigo-300 flex items-center gap-1.5 animate-pulse">
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span>Points to: <strong>&{pointsToVar.varName}</strong> ({pointsToVar.address})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            Source Inspection
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            <code>{currentQ.codeSnippet}</code>
          </pre>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{currentQ.questionPrompt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
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
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== currentQ.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              {selectedOpt === currentQ.correctIndex ? (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Accurate Indirection Analysis! +50 Points
                </span>
              ) : (
                <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Pointer Resolution Error
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < POINTER_QUESTIONS.length ? 'Next Memory Puzzle' : 'Complete Pointer Lab'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

