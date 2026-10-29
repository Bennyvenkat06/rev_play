import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Layers, Check, X, ArrowRight, HelpCircle } from 'lucide-react';

interface MemoryLayoutChallengeProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface LayoutComparison {
  id: number;
  title: string;
  structCode: string;
  unionCode: string;
  structSize: number;
  unionSize: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const COMPARISONS: LayoutComparison[] = [
  {
    id: 1,
    title: 'Sizeof Comparison: Struct vs Union',
    structCode: `struct SData {
    char ch;      // 1 byte
    int val;      // 4 bytes
    double dbl;   // 8 bytes
};`,
    unionCode: `union UData {
    char ch;      // 1 byte
    int val;      // 4 bytes
    double dbl;   // 8 bytes
};`,
    structSize: 16, // with alignment padding
    unionSize: 8,   // size of largest member (double)
    question: 'Assuming standard 64-bit alignment, what is `sizeof(union UData)` compared to `sizeof(struct SData)`?',
    options: [
      'sizeof(union) = 8 bytes; sizeof(struct) >= 13 bytes (padded to 16)',
      'sizeof(union) = 13 bytes; sizeof(struct) = 8 bytes',
      'Both have identical size of 13 bytes',
      'sizeof(union) = 1 byte; sizeof(struct) = 8 bytes'
    ],
    correctIndex: 0,
    explanation: 'A union allocates memory equal to its largest member (double = 8 bytes) because all members share the same base address. A struct allocates space for all members sequentially plus alignment padding (1 + 3 pad + 4 + 8 = 16 bytes).'
  },
  {
    id: 2,
    title: 'Shared Memory Mutation Trap in Union',
    structCode: `union Test {
    int i;
    char c;
};
union Test t;
t.i = 65;
t.c = 'Z'; // ASCII 90`,
    unionCode: '',
    structSize: 4,
    unionSize: 4,
    question: 'After executing `t.c = \'Z\';`, what happens to the value read from `t.i`?',
    options: [
      'The low-order byte of t.i is overwritten by 90 (\'Z\'), altering the integer value',
      't.i remains 65 because members are stored separately',
      'Compile error because you cannot assign to two union members',
      't.i becomes 0 automatically'
    ],
    correctIndex: 0,
    explanation: 'In a union, all members share the exact same memory bytes! Assigning to t.c directly overwrites the lowest byte of integer t.i.'
  }
];

export const MemoryLayoutChallenge: React.FC<MemoryLayoutChallengeProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u4-memory-layout'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const comp = COMPARISONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === comp.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 75);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Memory Layout Challenge: ${comp.title}`,
          studentAnswer: comp.options[idx],
          correctAnswer: comp.options[comp.correctIndex],
          explanation: comp.explanation,
          conceptRef: 'CS103ES Unit IV: Union shared memory representation, sizeof, and struct differences.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < COMPARISONS.length) {
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
            Memory Layout Analysis {currentIdx + 1} of {COMPARISONS.length}
          </span>
          <h2 className="text-lg font-bold text-white">{comp.title}</h2>
        </div>

        {/* Visual Memory Representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-cyan-400">STRUCT MEMORY MODEL</span>
              <span className="text-slate-500">Distinct offsets</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-cyan-300">
              <code>{comp.structCode}</code>
            </pre>
            <div className="text-[11px] text-slate-400 font-mono">
              Layout: [ ch (1B) | pad (3B) | val (4B) | dbl (8B) ] = 16B total
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-purple-400">UNION MEMORY MODEL</span>
              <span className="text-slate-500">Shared offset 0x0</span>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-purple-300">
              <code>{comp.unionCode || comp.structCode}</code>
            </pre>
            <div className="text-[11px] text-slate-400 font-mono">
              Layout: All members overlap across same 8 bytes = 8B total
            </div>
          </div>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{comp.question}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comp.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === comp.correctIndex) {
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
                  {isAnswered && idx === comp.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== comp.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Memory Footprint Rule:</strong> {comp.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < COMPARISONS.length ? 'Next Layout Test' : 'Complete Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

