import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Layers, Check, X, ArrowRight, HelpCircle, Layers3, ChevronLeft, ChevronRight, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

interface CallStackChallengeProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface StackFrame {
  funcName: string;
  scopeVariables: Record<string, number | string>;
  returnTo: string;
}

interface CallStackMission {
  id: number;
  title: string;
  codeSnippet: string;
  framesHistory: {
    action: string;
    frames: StackFrame[];
  }[];
  challengePrompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const MISSIONS: CallStackMission[] = [
  {
    id: 1,
    title: 'Call-by-Value vs Output Parameter Modification',
    codeSnippet: `void modify(int val, int *ref) {
    val += 10;
    *ref += 20;
}

int main(void) {
    int a = 5, b = 15;
    modify(a, &b);
    printf("a=%d, b=%d", a, b);
    return 0;
}`,
    framesHistory: [
      {
        action: '1. main() allocates a=5, b=15 in its stack frame',
        frames: [
          { funcName: 'main()', scopeVariables: { a: 5, b: 15 }, returnTo: 'OS runtime' }
        ]
      },
      {
        action: '2. modify() called: Pushes new frame on top of main()',
        frames: [
          { funcName: 'modify(val=5, ref=&b)', scopeVariables: { val: 15, '*ref': 35 }, returnTo: 'main() line 8' },
          { funcName: 'main()', scopeVariables: { a: 5, b: 35 }, returnTo: 'OS runtime' }
        ]
      },
      {
        action: '3. modify() returns: Pops frame off stack; local `val` is destroyed!',
        frames: [
          { funcName: 'main()', scopeVariables: { a: 5, b: 35 }, returnTo: 'OS runtime' }
        ]
      }
    ],
    challengePrompt: 'What values of `a` and `b` are printed by main() after modify() finishes?',
    options: ['a = 5, b = 35', 'a = 15, b = 35', 'a = 15, b = 15', 'a = 5, b = 15'],
    correctIndex: 0,
    explanation: 'Scalar parameter `val` is passed strictly by value: changes inside modify() only altered its own local frame copy, which was destroyed upon return. However, `ref` was a pointer holding &b, modifying caller variable b directly.'
  },
  {
    id: 2,
    title: 'Nested Function Calls and Activation Records',
    codeSnippet: `int helper(int x) {
    return x * 2;
}

int compute(int n) {
    int h = helper(n + 1);
    return h + 3;
}

int main(void) {
    int res = compute(4);
    return 0;
}`,
    framesHistory: [
      {
        action: 'Stack at deepest execution point: main() -> compute(4) -> helper(5)',
        frames: [
          { funcName: 'helper(x=5)', scopeVariables: { x: 5, 'returns': 10 }, returnTo: 'compute() line 6' },
          { funcName: 'compute(n=4)', scopeVariables: { n: 4, h: 'waiting...' }, returnTo: 'main() line 11' },
          { funcName: 'main()', scopeVariables: { res: 'waiting...' }, returnTo: 'OS runtime' }
        ]
      }
    ],
    challengePrompt: 'What is the final value stored in `res` when the entire call stack has unwound?',
    options: ['13', '10', '15', '11'],
    correctIndex: 0,
    explanation: 'helper(4 + 1 = 5) returns 5 * 2 = 10 to compute(). compute() then adds 3 (10 + 3 = 13) and returns 13 to main().'
  }
];

export const CallStackChallenge: React.FC<CallStackChallengeProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u2-callstack'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());
  const [historyStepIdx, setHistoryStepIdx] = useState(0);

  const currentMission = MISSIONS[currentIdx];
  const activeHistoryEntry = currentMission.framesHistory[historyStepIdx] || currentMission.framesHistory[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentMission.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 70);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Call Stack Challenge: ${currentMission.title}`,
          studentAnswer: currentMission.options[idx],
          correctAnswer: currentMission.options[currentMission.correctIndex],
          explanation: currentMission.explanation,
          conceptRef: 'CS103ES Unit II: Call-stack mechanics, stack frames, call-by-value vs output parameters.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < MISSIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setHistoryStepIdx(0);
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
        setHistoryStepIdx(0);
        setSelectedOpt(null);
        setIsAnswered(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            Stack Frame Stage {currentIdx + 1} of {MISSIONS.length}
          </span>
          <h2 className="text-lg font-bold text-white">{currentMission.title}</h2>
        </div>

        {/* Visual Call Stack Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Source Code (6 cols) */}
          <div className="md:col-span-6 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                C Source Code
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto">
                <code>{currentMission.codeSnippet}</code>
              </pre>
            </div>
            <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Note: Call stack frames allocate local variables and track return addresses.
            </div>
          </div>

          {/* Active Call Stack Visualization (6 cols) */}
          <div className="md:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider">
                <Layers3 className="w-4 h-4" />
                <span>Call Stack (Step {historyStepIdx + 1}/{currentMission.framesHistory.length})</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Top = Active Execution Frame</span>
            </div>

            {/* Current Stack Action Annotation */}
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className="font-bold text-amber-400">▶</span>
              <span>{activeHistoryEntry.action}</span>
            </div>

            {/* Stack Frames (Top = index 0) */}
            <div className="space-y-2">
              {activeHistoryEntry.frames.map((frame, fIdx) => (
                <div 
                  key={fIdx}
                  className={`p-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                    fIdx === 0
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 glow-neon shadow-md scale-[1.01]'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      {fIdx === 0 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                      {frame.funcName}
                    </span>
                    <span className="text-[10px] text-slate-400">Return to: {frame.returnTo}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/60 mt-1.5">
                    Frame Locals: <strong className="text-emerald-300">{Object.entries(frame.scopeVariables).map(([k, v]) => `${k}=${v}`).join(', ')}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Stepping controls for Call Stack History */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-[11px] text-slate-500">Inspect stack push & pop:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={historyStepIdx === 0}
                  onClick={() => {
                    soundManager.playClick();
                    setHistoryStepIdx(prev => Math.max(0, prev - 1));
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-slate-300 hover:text-white"
                  title="Previous stack state"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={historyStepIdx === currentMission.framesHistory.length - 1}
                  onClick={() => {
                    soundManager.playClick();
                    setHistoryStepIdx(prev => Math.min(currentMission.framesHistory.length - 1, prev + 1));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-cyan-300 hover:text-white flex items-center gap-1"
                  title="Next stack state (Push/Pop)"
                >
                  <span>Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setHistoryStepIdx(0);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                  title="Reset to step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{currentMission.challengePrompt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentMission.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === currentMission.correctIndex) {
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
                  {isAnswered && idx === currentMission.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== currentMission.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              {selectedOpt === currentMission.correctIndex ? (
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Stack Frame Unwound Correctly! +70 Points
                </span>
              ) : (
                <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Scope Tracing Error
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentMission.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < MISSIONS.length ? 'Next Stack Level' : 'Complete Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

