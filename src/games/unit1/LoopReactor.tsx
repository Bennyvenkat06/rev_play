import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Play, RotateCcw, Check, X, ArrowRight, Zap, RefreshCw, Cpu } from 'lucide-react';

interface LoopReactorProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface LoopScenario {
  id: number;
  title: string;
  loopType: 'for' | 'while' | 'do-while';
  codeLines: string[];
  initialState: { i: number; sum: number; product: number; terminated: boolean };
  steps: {
    iteration: number;
    activeLine: number;
    i: number;
    sum: number;
    product: number;
    explanation: string;
    actionType: 'check' | 'update' | 'continue' | 'break' | 'exit';
  }[];
  challenge: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const SCENARIOS: LoopScenario[] = [
  {
    id: 1,
    title: 'For Loop Sum Accumulation with Step Increment',
    loopType: 'for',
    codeLines: [
      'int sum = 0;',
      'for (int i = 1; i <= 4; i++) {',
      '    sum += i * 2;',
      '}',
      'printf("%d", sum);'
    ],
    initialState: { i: 0, sum: 0, product: 1, terminated: false },
    steps: [
      { iteration: 1, activeLine: 1, i: 1, sum: 0, product: 1, explanation: 'Init i = 1; Condition 1 <= 4 is TRUE. Entering loop.', actionType: 'check' },
      { iteration: 1, activeLine: 2, i: 1, sum: 2, product: 1, explanation: 'Body executes: sum += (1 * 2) -> sum = 2', actionType: 'update' },
      { iteration: 2, activeLine: 1, i: 2, sum: 2, product: 1, explanation: 'Step i++ -> i=2; Condition 2 <= 4 is TRUE.', actionType: 'check' },
      { iteration: 2, activeLine: 2, i: 2, sum: 6, product: 1, explanation: 'Body executes: sum += (2 * 2) -> sum = 6', actionType: 'update' },
      { iteration: 3, activeLine: 1, i: 3, sum: 6, product: 1, explanation: 'Step i++ -> i=3; Condition 3 <= 4 is TRUE.', actionType: 'check' },
      { iteration: 3, activeLine: 2, i: 3, sum: 12, product: 1, explanation: 'Body executes: sum += (3 * 2) -> sum = 12', actionType: 'update' },
      { iteration: 4, activeLine: 1, i: 4, sum: 12, product: 1, explanation: 'Step i++ -> i=4; Condition 4 <= 4 is TRUE.', actionType: 'check' },
      { iteration: 4, activeLine: 2, i: 4, sum: 20, product: 1, explanation: 'Body executes: sum += (4 * 2) -> sum = 20', actionType: 'update' },
      { iteration: 5, activeLine: 1, i: 5, sum: 20, product: 1, explanation: 'Step i++ -> i=5; Condition 5 <= 4 is FALSE. Loop Exits!', actionType: 'exit' },
    ],
    challenge: {
      prompt: 'After loop termination, what is the value of loop counter variable `i` and `sum`?',
      options: ['i = 5, sum = 20', 'i = 4, sum = 20', 'i = 5, sum = 12', 'i = 4, sum = 12'],
      correctIndex: 0,
      explanation: 'The loop exits only after the increment step makes i = 5, which causes 5 <= 4 to evaluate to false.'
    }
  },
  {
    id: 2,
    title: 'While Loop with Break Condition',
    loopType: 'while',
    codeLines: [
      'int i = 1, sum = 0;',
      'while (i <= 10) {',
      '    if (i == 4) break;',
      '    sum += i;',
      '    i++;',
      '}'
    ],
    initialState: { i: 1, sum: 0, product: 1, terminated: false },
    steps: [
      { iteration: 1, activeLine: 1, i: 1, sum: 0, product: 1, explanation: 'Condition 1 <= 10 TRUE.', actionType: 'check' },
      { iteration: 1, activeLine: 3, i: 1, sum: 1, product: 1, explanation: 'i != 4; sum += 1 -> sum = 1; i becomes 2', actionType: 'update' },
      { iteration: 2, activeLine: 1, i: 2, sum: 1, product: 1, explanation: 'Condition 2 <= 10 TRUE.', actionType: 'check' },
      { iteration: 2, activeLine: 3, i: 2, sum: 3, product: 1, explanation: 'i != 4; sum += 2 -> sum = 3; i becomes 3', actionType: 'update' },
      { iteration: 3, activeLine: 1, i: 3, sum: 3, product: 1, explanation: 'Condition 3 <= 10 TRUE.', actionType: 'check' },
      { iteration: 3, activeLine: 3, i: 3, sum: 6, product: 1, explanation: 'i != 4; sum += 3 -> sum = 6; i becomes 4', actionType: 'update' },
      { iteration: 4, activeLine: 2, i: 4, sum: 6, product: 1, explanation: 'Condition i == 4 is TRUE! break statement immediately terminates loop!', actionType: 'break' },
    ],
    challenge: {
      prompt: 'What are the final values of `i` and `sum` when the break executes?',
      options: ['i = 4, sum = 6', 'i = 4, sum = 10', 'i = 5, sum = 6', 'i = 3, sum = 3'],
      correctIndex: 0,
      explanation: 'When i becomes 4, the break triggers before executing sum += 4 or i++, leaving i = 4 and sum = 6.'
    }
  },
  {
    id: 3,
    title: 'Do-While Loop Exit-Control Execution',
    loopType: 'do-while',
    codeLines: [
      'int count = 0;',
      'do {',
      '    count += 5;',
      '} while (count < 5);'
    ],
    initialState: { i: 0, sum: 0, product: 1, terminated: false },
    steps: [
      { iteration: 1, activeLine: 1, i: 0, sum: 0, product: 1, explanation: 'Entering do-while loop unconditionally.', actionType: 'check' },
      { iteration: 1, activeLine: 2, i: 5, sum: 5, product: 1, explanation: 'Body executes: count += 5 -> count = 5', actionType: 'update' },
      { iteration: 1, activeLine: 3, i: 5, sum: 5, product: 1, explanation: 'Condition tested: 5 < 5 is FALSE! Loop terminates after 1 execution.', actionType: 'exit' },
    ],
    challenge: {
      prompt: 'How many times does the body of a do-while loop execute if the condition is initially false?',
      options: ['Exactly 1 time', '0 times', 'Infinite times', 'Depends on compiler'],
      correctIndex: 0,
      explanation: 'A do-while loop is exit-controlled: the condition is checked after the body executes, guaranteeing at least one iteration.'
    }
  }
];

export const LoopReactor: React.FC<LoopReactorProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u1-loop'];
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const currentScenario = SCENARIOS[scenarioIdx];
  const currentStep = currentScenario.steps[stepIdx];
  const isLoopFinished = stepIdx >= currentScenario.steps.length - 1;

  const handleStepForward = () => {
    soundManager.playClick();
    if (stepIdx < currentScenario.steps.length - 1) {
      setStepIdx(prev => prev + 1);
    }
  };

  const handleResetStepper = () => {
    soundManager.playClick();
    setStepIdx(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedChallengeOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentScenario.challenge.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 50);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Loop Reactor Challenge (${currentScenario.title})`,
          studentAnswer: currentScenario.challenge.options[idx],
          correctAnswer: currentScenario.challenge.options[currentScenario.challenge.correctIndex],
          explanation: currentScenario.challenge.explanation,
          conceptRef: 'CS103ES Unit I: Loop counting, termination condition, break mechanics.'
        }
      ]);
    }
  };

  const handleNextScenario = () => {
    soundManager.playClick();
    if (scenarioIdx + 1 < SCENARIOS.length) {
      setScenarioIdx(prev => prev + 1);
      setStepIdx(0);
      setSelectedChallengeOption(null);
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
        setScenarioIdx(0);
        setStepIdx(0);
        setSelectedChallengeOption(null);
        setIsAnswered(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        {/* Scenario Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Simulation {scenarioIdx + 1} of {SCENARIOS.length}
            </span>
            <h2 className="text-lg font-bold text-white">{currentScenario.title}</h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
            Type: {currentScenario.loopType.toUpperCase()}
          </span>
        </div>

        {/* Interactive Workspace: Code Stepper on Left, Memory Registers on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Code Stepper (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">Execution Stepper</span>
                <span className="text-xs font-mono text-cyan-400">Iteration #{currentStep.iteration}</span>
              </div>
              <div className="p-4 font-mono text-xs sm:text-sm space-y-1">
                {currentScenario.codeLines.map((line, idx) => {
                  const isActive = idx === currentStep.activeLine;
                  return (
                    <div 
                      key={idx}
                      className={`px-3 py-1.5 rounded transition-colors flex items-center gap-3 ${
                        isActive 
                          ? 'bg-cyan-950/90 border border-cyan-500/80 text-cyan-300 font-bold glow-cyan' 
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="text-[11px] text-slate-600 w-4 select-none">{idx + 1}</span>
                      <span>{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Controls */}
            <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="text-xs text-slate-400 font-mono">
                Step {stepIdx + 1} of {currentScenario.steps.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetStepper}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  disabled={isLoopFinished}
                  onClick={handleStepForward}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    isLoopFinished
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 glow-cyan active:scale-95'
                  }`}
                >
                  <span>Step Iteration</span>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Variable Memory Registers (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Live RAM Registers</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-mono block">Counter i</span>
                  <span className="text-2xl font-black font-mono text-cyan-400">{currentStep.i}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-mono block">Accumulator sum</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">{currentStep.sum}</span>
                </div>
              </div>
            </div>

            {/* Current Step Explanation Log */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5" />
                <span>Instruction Trace</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentStep.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Challenge */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="text-sm font-semibold text-white">
            {currentScenario.challenge.prompt}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentScenario.challenge.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800';

              if (isAnswered) {
                if (idx === currentScenario.challenge.correctIndex) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold glow-neon';
                } else if (idx === selectedChallengeOption) {
                  btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                } else {
                  btnStyle = 'opacity-50 text-slate-600 border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentScenario.challenge.correctIndex && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  {isAnswered && idx === selectedChallengeOption && idx !== currentScenario.challenge.correctIndex && (
                    <X className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 flex-wrap animate-in fade-in">
              <p className="text-xs text-slate-300 max-w-xl">
                <strong>Explanation:</strong> {currentScenario.challenge.explanation}
              </p>
              <button
                onClick={handleNextScenario}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{scenarioIdx + 1 < SCENARIOS.length ? 'Next Loop Challenge' : 'Complete Reactor'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </GameContainer>
  );
};

