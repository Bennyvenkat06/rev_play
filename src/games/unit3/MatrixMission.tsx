import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Grid3X3, Check, X, ArrowRight, HelpCircle } from 'lucide-react';

interface MatrixMissionProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface MatrixChallenge {
  id: number;
  title: string;
  matrixA: number[][];
  matrixB: number[][];
  rows: number;
  cols: number;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MATRIX_CHALLENGES: MatrixChallenge[] = [
  {
    id: 1,
    title: 'Row-Major Memory Offset Calculation',
    matrixA: [
      [10, 20, 30],
      [40, 50, 60]
    ],
    matrixB: [],
    rows: 2,
    cols: 3,
    prompt: 'In a 2x3 matrix `int M[2][3]`, which 1D memory offset corresponds to cell `M[1][2]` (row 1, col 2) in Row-Major order?',
    options: [
      'Offset index 5: Formula = (row * cols + col) = (1 * 3 + 2) = 5',
      'Offset index 4: Formula = (row * rows + col) = (1 * 2 + 2) = 4',
      'Offset index 3: Direct sum of row and col',
      'Offset index 2: Row index is ignored'
    ],
    correctIndex: 0,
    explanation: 'C stores 2D arrays in Row-Major order: consecutive row elements are adjacent. Address offset = row * NumColumns + col = 1 * 3 + 2 = 5 (the last element, storing 60).'
  },
  {
    id: 2,
    title: 'Cell-by-Cell Matrix Addition',
    matrixA: [
      [1, 2],
      [3, 4]
    ],
    matrixB: [
      [5, 6],
      [7, 8]
    ],
    rows: 2,
    cols: 2,
    prompt: 'What is the resultant 2x2 sum matrix C = A + B?',
    options: [
      'C = [[6, 8], [10, 12]]',
      'C = [[5, 12], [21, 32]]',
      'C = [[7, 7], [7, 7]]',
      'C = [[1, 4], [9, 16]]'
    ],
    correctIndex: 0,
    explanation: 'Matrix addition adds corresponding elements: C[0][0]=1+5=6, C[0][1]=2+6=8, C[1][0]=3+7=10, C[1][1]=4+8=12.'
  }
];

export const MatrixMission: React.FC<MatrixMissionProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u3-matrix'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const ch = MATRIX_CHALLENGES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === ch.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 80);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Matrix Mission: ${ch.title}`,
          studentAnswer: ch.options[idx],
          correctAnswer: ch.options[ch.correctIndex],
          explanation: ch.explanation,
          conceptRef: 'CS103ES Unit III: 2D arrays, row-major memory mapping, matrix addition.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < MATRIX_CHALLENGES.length) {
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
            Matrix Grid Mission {currentIdx + 1} of {MATRIX_CHALLENGES.length}
          </span>
          <h2 className="text-lg font-bold text-white">{ch.title}</h2>
        </div>

        {/* Visual 2D Matrices */}
        <div className="flex flex-wrap items-center justify-center gap-8 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="text-xs font-mono text-slate-400 text-center mb-2 font-bold">Matrix A ({ch.rows}x{ch.cols})</div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${ch.cols}, minmax(0, 1fr))` }}>
              {ch.matrixA.map((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center font-mono">
                    <span className="text-sm font-bold text-cyan-300">{val}</span>
                    <span className="text-[9px] text-slate-500">[{r}][{c}]</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {ch.matrixB.length > 0 && (
            <>
              <span className="text-2xl font-bold text-slate-600 font-mono">+</span>
              <div>
                <div className="text-xs font-mono text-slate-400 text-center mb-2 font-bold">Matrix B ({ch.rows}x{ch.cols})</div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${ch.cols}, minmax(0, 1fr))` }}>
                  {ch.matrixB.map((row, r) =>
                    row.map((val, c) => (
                      <div key={`${r}-${c}`} className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center font-mono">
                        <span className="text-sm font-bold text-purple-300">{val}</span>
                        <span className="text-[9px] text-slate-500">[{r}][{c}]</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{ch.prompt}</span>
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
              <strong>Calculation Note:</strong> {ch.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < MATRIX_CHALLENGES.length ? 'Next Matrix Mission' : 'Complete Matrix Lab'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

