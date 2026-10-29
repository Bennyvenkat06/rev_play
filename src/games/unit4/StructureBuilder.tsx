import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Box, Check, X, ArrowRight, HelpCircle } from 'lucide-react';

interface StructureBuilderProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface StructChallenge {
  id: number;
  title: string;
  structCode: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const STRUCT_CHALLENGES: StructChallenge[] = [
  {
    id: 1,
    title: 'Direct Dot (.) vs Pointer Arrow (->) Operator',
    structCode: `struct Student {
    int id;
    float cgpa;
};

int main(void) {
    struct Student s1 = {101, 8.5f};
    struct Student *ptr = &s1;
    // Accessing cgpa through ptr:
    float score = ptr->cgpa;
}`,
    question: 'Which syntax is 100% equivalent to `ptr->cgpa`?',
    options: [
      '(*ptr).cgpa',
      '*ptr.cgpa',
      '&ptr.cgpa',
      'ptr.cgpa'
    ],
    correctIndex: 0,
    explanation: 'The arrow operator (->) is syntactic shorthand for (*ptr).member. The parentheses in (*ptr).member are mandatory because the dot operator has higher precedence than the dereference operator (*).'
  },
  {
    id: 2,
    title: 'Passing Structs: By-Value vs By-Pointer',
    structCode: `void updateCGPA(struct Student *s, float newScore) {
    s->cgpa = newScore;
}`,
    question: 'Why is passing large structures via pointer `(struct Student *s)` preferred in C?',
    options: [
      'Avoids copying the entire struct data block on the call stack and allows modifying caller data',
      'Because C does not allow structs to be passed by value',
      'Because pointers make struct members execute faster',
      'Pointers automatically initialize unassigned fields'
    ],
    correctIndex: 0,
    explanation: 'Passing by value creates a full byte-for-byte copy on the call stack (which is slow for large structs and prevents modifying caller memory). Passing a pointer copies only an address (4 or 8 bytes) and enables in-place mutation.'
  }
];

export const StructureBuilder: React.FC<StructureBuilderProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u4-struct-builder'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const ch = STRUCT_CHALLENGES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === ch.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 65);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Structure Builder: ${ch.title}`,
          studentAnswer: ch.options[idx],
          correctAnswer: ch.options[ch.correctIndex],
          explanation: ch.explanation,
          conceptRef: 'CS103ES Unit IV: User-defined structures, member access (. and ->).'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < STRUCT_CHALLENGES.length) {
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
            Structure Blueprint #{currentIdx + 1} of {STRUCT_CHALLENGES.length}
          </span>
          <h2 className="text-lg font-bold text-white">{ch.title}</h2>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            Structure Specification
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-amber-300 overflow-x-auto leading-relaxed">
            <code>{ch.structCode}</code>
          </pre>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{ch.question}</span>
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
              <strong>Architecture Rule:</strong> {ch.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < STRUCT_CHALLENGES.length ? 'Next Blueprint' : 'Complete Structure Builder'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

