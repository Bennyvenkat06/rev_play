import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Flag, Play, RotateCcw, Check, X, ArrowRight, Zap, Trophy } from 'lucide-react';

interface SortingRaceProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface SortRaceChallenge {
  id: number;
  title: string;
  initialArray: number[];
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGES: SortRaceChallenge[] = [
  {
    id: 1,
    title: 'Bubble Sort Pass 1 Mechanics',
    initialArray: [64, 34, 25, 12, 22, 11, 90],
    prompt: 'After the FIRST complete pass of Bubble Sort (ascending), which element is guaranteed to be in its final sorted position?',
    options: [
      'The largest element (90) at the very end of the array',
      'The smallest element (11) at the start of the array',
      'All elements are sorted after pass 1',
      'The middle element (12)'
    ],
    correctIndex: 0,
    explanation: 'In Bubble Sort, adjacent comparisons bubble the largest unsorted element to the end of the array during each pass. After Pass 1, 90 is locked in its final resting position at the last index.'
  },
  {
    id: 2,
    title: 'Selection Sort vs Bubble Sort Swaps',
    initialArray: [5, 4, 3, 2, 1],
    prompt: 'Why does Selection Sort perform significantly fewer swaps than Bubble Sort on reverse-ordered data?',
    options: [
      'Selection Sort performs at most O(N) swaps (exactly one swap per pass) by finding the minimum before swapping',
      'Selection Sort doesn\'t use swaps at all',
      'Selection Sort has O(log N) comparisons',
      'Selection Sort only sorts even numbers first'
    ],
    correctIndex: 0,
    explanation: 'Selection Sort scans the entire unsorted partition to identify the minimum element and executes at most ONE swap per pass (O(N) total swaps). Bubble Sort swaps adjacent elements whenever inverted, executing O(N^2) swaps on reverse-ordered arrays.'
  },
  {
    id: 3,
    title: 'Insertion Sort on Nearly-Sorted Input',
    initialArray: [1, 2, 3, 5, 4],
    prompt: 'What is the best-case time complexity of Insertion Sort when the array is already sorted or nearly sorted?',
    options: [
      'O(N) linear time, because each element requires only 1 comparison and 0 shifts',
      'O(N^2) quadratic time',
      'O(N log N) logarithmic time',
      'O(1) constant time'
    ],
    correctIndex: 0,
    explanation: 'When the array is already sorted, the inner while loop of Insertion Sort terminates immediately on the first comparison (arr[j] > key is false). Hence, only N-1 comparisons are made, achieving O(N) linear time.'
  }
];

export const SortingRace: React.FC<SortingRaceProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u5-sort-race'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  // Interactive sorting visualizer state
  const [bars, setBars] = useState<number[]>([45, 12, 89, 34, 70, 23]);
  const [activeIndices, setActiveIndices] = useState<[number, number] | null>(null);
  const [sortStats, setSortStats] = useState({ comparisons: 0, swaps: 0 });
  const [isSorting, setIsSorting] = useState(false);

  const ch = CHALLENGES[currentIdx];

  const runBubbleStep = async () => {
    if (isSorting) return;
    setIsSorting(true);
    soundManager.playClick();
    const arr = [...bars];
    let comps = 0;
    let swps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        setActiveIndices([j, j + 1]);
        comps++;
        setSortStats({ comparisons: comps, swaps: swps });
        await new Promise(r => setTimeout(r, 250));

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swps++;
          setBars([...arr]);
          setSortStats({ comparisons: comps, swaps: swps });
          soundManager.playClick();
          await new Promise(r => setTimeout(r, 250));
        }
      }
    }
    setActiveIndices(null);
    setIsSorting(false);
    soundManager.playVictory();
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === ch.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 55);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Sorting Race Challenge: ${ch.title}`,
          studentAnswer: ch.options[idx],
          correctAnswer: ch.options[ch.correctIndex],
          explanation: ch.explanation,
          conceptRef: 'CS103ES Unit V: Bubble sort, insertion sort, selection sort comparison.'
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
        setBars([45, 12, 89, 34, 70, 23]);
        setSortStats({ comparisons: 0, swaps: 0 });
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
            Sorting Track #{currentIdx + 1} of {CHALLENGES.length}
          </span>
          <h2 className="text-lg font-bold text-white">{ch.title}</h2>
        </div>

        {/* Live Sorting Race Track Simulator */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Flag className="w-4 h-4 text-rose-400" />
              <span>Real-Time Algorithm Race Simulator</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <span>Comparisons: <strong className="text-cyan-400">{sortStats.comparisons}</strong></span>
              <span>Swaps: <strong className="text-amber-400">{sortStats.swaps}</strong></span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="h-40 flex items-end justify-center gap-3 pt-4 border-b border-slate-800 pb-2">
            {bars.map((val, idx) => {
              const isComparing = activeIndices && (activeIndices[0] === idx || activeIndices[1] === idx);
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[60px]">
                  <span className="text-[10px] font-mono text-slate-400">{val}</span>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-200 ${
                      isComparing 
                        ? 'bg-rose-500 shadow-lg shadow-rose-500/50' 
                        : 'bg-cyan-600/80 hover:bg-cyan-500'
                    }`}
                    style={{ height: `${val * 1.3}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-600">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <button
              disabled={isSorting}
              onClick={runBubbleStep}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isSorting ? 'Simulating...' : 'Simulate Live Bubble Sort'}</span>
            </button>
          </div>
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
              <strong>Algorithm Analysis:</strong> {ch.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < CHALLENGES.length ? 'Next Sorting Stage' : 'Complete Sorting Race'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

