import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Search, Check, X, ArrowRight, Target, HelpCircle } from 'lucide-react';

interface BinarySearchArenaProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface SearchMission {
  id: number;
  sortedArray: number[];
  target: number;
  steps: {
    low: number;
    high: number;
    mid: number;
    midVal: number;
    decision: string;
  }[];
  challenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const SEARCH_MISSIONS: SearchMission[] = [
  {
    id: 1,
    sortedArray: [12, 25, 33, 47, 59, 68, 77, 85, 94],
    target: 68,
    steps: [
      { low: 0, high: 8, mid: 4, midVal: 59, decision: 'arr[4]=59 < 68: Target is greater, so discard left half -> set low = 4 + 1 = 5' },
      { low: 5, high: 8, mid: 6, midVal: 77, decision: 'arr[6]=77 > 68: Target is smaller, so discard right half -> set high = 6 - 1 = 5' },
      { low: 5, high: 5, mid: 5, midVal: 68, decision: 'arr[5]=68 == 68: MATCH FOUND at index 5 in 3 iterations!' },
    ],
    challenge: {
      question: 'Why does Binary Search achieve O(log2 N) time complexity compared to O(N) Linear Search?',
      options: [
        'Because each comparison cuts the remaining search space exactly in half',
        'Because it checks all elements at once in parallel',
        'Because it only works on small arrays',
        'Because it converts decimal numbers to binary'
      ],
      correctIndex: 0,
      explanation: 'Binary Search repeatedly divides the sorted search space in half (N, N/2, N/4...). The number of divisions needed to reduce N to 1 is log2(N), giving logarithmic efficiency.'
    }
  },
  {
    id: 2,
    sortedArray: [10, 20, 30, 40, 50],
    target: 35, // Not present
    steps: [
      { low: 0, high: 4, mid: 2, midVal: 30, decision: 'arr[2]=30 < 35 -> low = 3' },
      { low: 3, high: 4, mid: 3, midVal: 40, decision: 'arr[3]=40 > 35 -> high = 2' },
      { low: 3, high: 2, mid: 2, midVal: 30, decision: 'low (3) > high (2): Search interval inverted! Target not present in array.' }
    ],
    challenge: {
      question: 'What is the exact terminating condition that indicates the target key is NOT present in the sorted array?',
      options: [
        'low > high (search interval boundaries cross)',
        'mid == 0',
        'high == 0',
        'low == high'
      ],
      correctIndex: 0,
      explanation: 'The loop condition is while (low <= high). When the target is absent, adjustments inevitably cause low to exceed high (low > high), terminating the loop unsuccessfully and returning -1.'
    }
  }
];

export const BinarySearchArena: React.FC<BinarySearchArenaProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u5-binary-search'];
  const [missionIdx, setMissionIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const mission = SEARCH_MISSIONS[missionIdx];
  const step = mission.steps[stepIdx];

  const handleNextStep = () => {
    soundManager.playClick();
    if (stepIdx < mission.steps.length - 1) {
      setStepIdx(prev => prev + 1);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === mission.challenge.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 65);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Binary Search Arena: ${mission.challenge.question}`,
          studentAnswer: mission.challenge.options[idx],
          correctAnswer: mission.challenge.options[mission.challenge.correctIndex],
          explanation: mission.challenge.explanation,
          conceptRef: 'CS103ES Unit V: Binary search intervals, low/mid/high mechanics.'
        }
      ]);
    }
  };

  const handleNextMission = () => {
    soundManager.playClick();
    if (missionIdx + 1 < SEARCH_MISSIONS.length) {
      setMissionIdx(prev => prev + 1);
      setStepIdx(0);
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
        setMissionIdx(0);
        setStepIdx(0);
        setSelectedOpt(null);
        setIsAnswered(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
              Search Arena Mission {missionIdx + 1} of {SEARCH_MISSIONS.length}
            </span>
            <h2 className="text-lg font-bold text-white">Target Search Key: <span className="text-cyan-400 font-mono">{mission.target}</span></h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Step {stepIdx + 1} of {mission.steps.length}
          </div>
        </div>

        {/* Sorted Array Pointer Tracker */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {mission.sortedArray.map((val, idx) => {
              const isLow = idx === step.low;
              const isMid = idx === step.mid;
              const isHigh = idx === step.high;
              const inRange = idx >= step.low && idx <= step.high;

              let cellStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-40';
              if (inRange) {
                cellStyle = 'bg-slate-900 border-slate-700 text-slate-200 opacity-100';
              }
              if (isMid) {
                cellStyle = 'bg-cyan-950 border-cyan-500 text-cyan-300 font-black glow-cyan scale-105';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Pointer labels */}
                  <div className="h-4 text-[10px] font-mono font-bold">
                    {isLow && <span className="text-emerald-400">LOW</span>}
                    {isMid && <span className="text-cyan-400">MID</span>}
                    {isHigh && <span className="text-amber-400">HIGH</span>}
                  </div>

                  <div className={`w-12 h-14 rounded-xl border flex flex-col items-center justify-center font-mono transition-all ${cellStyle}`}>
                    <span className="text-sm font-bold">{val}</span>
                    <span className="text-[9px] text-slate-500">[{idx}]</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Decision Log */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between gap-4">
            <span>{step.decision}</span>
            {stepIdx < mission.steps.length - 1 && (
              <button
                onClick={handleNextStep}
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shrink-0"
              >
                Advance Step →
              </button>
            )}
          </div>
        </div>

        {/* Verification Challenge */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{mission.challenge.question}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mission.challenge.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === mission.challenge.correctIndex) {
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
                  {isAnswered && idx === mission.challenge.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== mission.challenge.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Binary Search Law:</strong> {mission.challenge.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextMission}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{missionIdx + 1 < SEARCH_MISSIONS.length ? 'Next Mission' : 'Complete Binary Search Arena'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

