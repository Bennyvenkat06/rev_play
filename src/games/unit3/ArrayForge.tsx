import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Grid, Check, X, ArrowRight, AlertTriangle } from 'lucide-react';

interface ArrayForgeProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface ArrayChallenge {
  id: number;
  arrayName: string;
  baseAddress: number;
  elementSize: number; // e.g. 4 bytes for int
  elements: number[];
  prompt: string;
  codeSnippet: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGES: ArrayChallenge[] = [
  {
    id: 1,
    arrayName: 'scores',
    baseAddress: 4096, // 0x1000
    elementSize: 4,
    elements: [45, 82, 91, 67, 74],
    prompt: 'What is the exact memory byte address of element `scores[3]`, and what value does it store?',
    codeSnippet: `int scores[5] = {45, 82, 91, 67, 74};
// Base address of scores (&scores[0]) = 4096 (0x1000)`,
    options: [
      'Address 4108, Value 67',
      'Address 4099, Value 67',
      'Address 4108, Value 91',
      'Address 4112, Value 74'
    ],
    correctIndex: 0,
    explanation: 'Address formula: Base + (index * sizeof(int)) = 4096 + (3 * 4) = 4096 + 12 = 4108. With 0-based indexing: index 0 is 45, 1 is 82, 2 is 91, 3 is 67.'
  },
  {
    id: 2,
    arrayName: 'buffer',
    baseAddress: 5000,
    elementSize: 4,
    elements: [10, 20, 30, 40],
    prompt: 'A program executes: `int x = buffer[4];` What happens in standard C?',
    codeSnippet: `int buffer[4] = {10, 20, 30, 40};
int x = buffer[4]; // Accessing index 4`,
    options: [
      'Undefined Behavior (Accessing out of bounds buffer[4] past valid 0..3 range)',
      'x receives 0 automatically',
      'Compiler throws a mandatory syntax error',
      'x receives 40'
    ],
    correctIndex: 0,
    explanation: 'In C, valid indices for an array of size 4 are strictly 0, 1, 2, and 3. C performs NO automatic bounds checking at runtime. Accessing buffer[4] reads memory outside the array boundary, resulting in Undefined Behavior.'
  },
  {
    id: 3,
    arrayName: 'data',
    baseAddress: 6000,
    elementSize: 4,
    elements: [1, 2, 3, 4, 5],
    prompt: 'What is the equivalence relation between array indexing and pointer arithmetic?',
    codeSnippet: `int data[5] = {1, 2, 3, 4, 5};
// Which expression accesses element at index 2?`,
    options: [
      '*(data + 2) is identical to data[2]',
      '*data + 2 is identical to data[2]',
      '&data + 2 is identical to data[2]',
      'data[2] is independent of pointers'
    ],
    correctIndex: 0,
    explanation: 'In C, the subscript notation arr[i] is defined as syntactically identical to *(arr + i).'
  }
];

export const ArrayForge: React.FC<ArrayForgeProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u3-array-forge'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const ch = CHALLENGES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === ch.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 45);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Array Forge Challenge #${ch.id}`,
          studentAnswer: ch.options[idx],
          correctAnswer: ch.options[ch.correctIndex],
          explanation: ch.explanation,
          conceptRef: 'CS103ES Unit III: Array declarations, subscripts, memory bounds.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < CHALLENGES.length) {
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
          <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
            Array Memory Cell Analysis {currentIdx + 1} of {CHALLENGES.length}
          </span>
          <h2 className="text-lg font-bold text-white">Contiguous 1D Array Storage</h2>
        </div>

        {/* Visual Array Cells */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Hardware Contiguous Blocks (Base: {ch.baseAddress})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {ch.elements.map((val, idx) => {
              const cellAddr = ch.baseAddress + idx * ch.elementSize;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                  <div className="text-[10px] font-mono text-cyan-400">Byte {cellAddr}</div>
                  <div className="text-lg font-black font-mono text-white my-1">{val}</div>
                  <div className="text-[11px] font-mono text-slate-500">[{idx}]</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <pre className="p-4 text-xs sm:text-sm font-mono text-purple-300 overflow-x-auto leading-relaxed">
            <code>{ch.codeSnippet}</code>
          </pre>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white">
            {ch.prompt}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ch.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === ch.correctIndex) {
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
                  {isAnswered && idx === ch.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== ch.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Analysis:</strong> {ch.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < CHALLENGES.length ? 'Next Array Puzzle' : 'Complete Array Forge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

