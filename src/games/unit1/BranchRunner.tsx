import React, { useState } from 'react';
import { GameContainer, GameMode } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { GitBranch, Check, X, ArrowRight, Cpu, HelpCircle, Terminal } from 'lucide-react';
import { InteractiveExecutionPanel, ExecutionTraceStep } from '../../components/simulation/InteractiveExecutionPanel';

interface BranchRunnerProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface BranchLevel {
  id: number;
  inputDescription: string;
  conceptName: string;
  variables: Record<string, number | string>;
  codeLines: string[];
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
  correctLabel: string;
  explanation: string;
  traceSteps: ExecutionTraceStep[];
  supportedParameters?: {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    description: string;
  }[];
  simulationRunner?: (params: Record<string, number>) => {
    steps: ExecutionTraceStep[];
    finalOutput: string;
  };
}

const LEVELS: BranchLevel[] = [
  // Level 1: Mandatory Logical OR Short-Circuit Evaluation Regression Test
  {
    id: 1,
    inputDescription: 'Logical OR Short-Circuit Evaluation',
    conceptName: 'Logical OR Short-Circuit Rule (§6.5.14)',
    variables: { x: 1, y: 0 },
    codeLines: [
      '#include <stdio.h>',
      '',
      'int main(void) {',
      '    int x = 1, y = 0;',
      '',
      '    if (x || ++y) {',
      '        printf("Branch 1: y=%d", y);',
      '    } else {',
      '        printf("Branch 2: y=%d", y);',
      '    }',
      '',
      '    return 0;',
      '}'
    ],
    options: [
      { id: 'opt-b1-y0', label: 'Branch 1: y=0', isCorrect: true },
      { id: 'opt-b1-y1', label: 'Branch 1: y=1', isCorrect: false },
      { id: 'opt-b2-y0', label: 'Branch 2: y=0', isCorrect: false },
      { id: 'opt-b2-y1', label: 'Branch 2: y=1', isCorrect: false }
    ],
    correctLabel: 'Branch 1: y=0',
    explanation: 'Short-circuit evaluation rule in C: The logical OR operator (||) evaluates left-to-right. Since operand x is 1 (non-zero, true), the overall || condition is already guaranteed to be true. The compiler skips evaluation of the right operand (++y) entirely. Therefore, y remains 0, the if branch executes, and printf outputs "Branch 1: y=0".',
    traceSteps: [
      {
        lineIndex: 3,
        description: 'Execution starts: Initialize variables x = 1 and y = 0 in the current execution scope.',
        variables: { x: 1, y: 0 }
      },
      {
        lineIndex: 5,
        description: 'Evaluate left operand of logical OR: x is evaluated. Since x == 1 (non-zero), it is TRUE.',
        variables: { x: 1, y: 0 },
        conditionResult: true
      },
      {
        lineIndex: 5,
        description: 'Short-Circuit Triggered: Because left operand is TRUE, C guarantees the right operand (++y) is SKIPPED! y remains 0.',
        variables: { x: 1, y: 0 },
        skippedExpr: '++y skipped (not evaluated)',
        conditionResult: true,
        branchTaken: 'Branch 1'
      },
      {
        lineIndex: 6,
        description: 'Condition evaluated to true: Control enters Branch 1. printf executes with current y = 0.',
        variables: { x: 1, y: 0 },
        branchTaken: 'Branch 1',
        output: 'Branch 1: y=0'
      },
      {
        lineIndex: 11,
        description: 'Program terminates and returns 0.',
        variables: { x: 1, y: 0 },
        output: 'Branch 1: y=0'
      }
    ],
    supportedParameters: [
      {
        key: 'x',
        label: 'Initial value of x (left operand)',
        min: 0,
        max: 1,
        step: 1,
        description: 'When x = 1 (true), short-circuit skips ++y. When x = 0 (false), ++y must evaluate!'
      },
      {
        key: 'y',
        label: 'Initial value of y',
        min: 0,
        max: 4,
        step: 1,
        description: 'Base starting value of y before the if-statement.'
      }
    ],
    simulationRunner: (params) => {
      const initX = params.x ?? 1;
      let curY = params.y ?? 0;
      const initialY = curY;
      const isXTrue = initX !== 0;

      const steps: ExecutionTraceStep[] = [
        {
          lineIndex: 3,
          description: `Initialize variables x = ${initX} and y = ${initialY}.`,
          variables: { x: initX, y: initialY }
        }
      ];

      if (isXTrue) {
        // Short-circuit
        steps.push({
          lineIndex: 5,
          description: `Evaluate left operand: x is ${initX} (non-zero, TRUE).`,
          variables: { x: initX, y: initialY },
          conditionResult: true
        });
        steps.push({
          lineIndex: 5,
          description: `Short-Circuit active: right operand (++y) is SKIPPED. y remains ${initialY}.`,
          variables: { x: initX, y: initialY },
          skippedExpr: '++y skipped',
          conditionResult: true,
          branchTaken: 'Branch 1'
        });
        steps.push({
          lineIndex: 6,
          description: `Branch 1 executes: printf outputs "Branch 1: y=${initialY}".`,
          variables: { x: initX, y: initialY },
          branchTaken: 'Branch 1',
          output: `Branch 1: y=${initialY}`
        });
        steps.push({
          lineIndex: 11,
          description: 'Program exits with code 0.',
          variables: { x: initX, y: initialY },
          output: `Branch 1: y=${initialY}`
        });
        return { steps, finalOutput: `Branch 1: y=${initialY}` };
      } else {
        // No short-circuit: x is 0, so ++y evaluates!
        curY += 1;
        steps.push({
          lineIndex: 5,
          description: `Evaluate left operand: x is 0 (FALSE). Cannot short-circuit!`,
          variables: { x: initX, y: initialY },
          conditionResult: false
        });
        steps.push({
          lineIndex: 5,
          description: `Right operand (++y) MUST be evaluated! y increments from ${initialY} to ${curY}.`,
          variables: { x: initX, y: curY },
          conditionResult: curY !== 0,
          branchTaken: 'Branch 1'
        });
        steps.push({
          lineIndex: 6,
          description: `Since ++y (${curY}) is non-zero, Branch 1 executes! printf outputs "Branch 1: y=${curY}".`,
          variables: { x: initX, y: curY },
          branchTaken: 'Branch 1',
          output: `Branch 1: y=${curY}`
        });
        steps.push({
          lineIndex: 11,
          description: 'Program exits with code 0.',
          variables: { x: initX, y: curY },
          output: `Branch 1: y=${curY}`
        });
        return { steps, finalOutput: `Branch 1: y=${curY}` };
      }
    }
  },

  // Level 2: Switch-case fallthrough trap
  {
    id: 2,
    inputDescription: 'Switch-Case Statement Fallthrough Trap',
    conceptName: 'Switch Fallthrough & Break Mechanics',
    variables: { code: 2, signal: 0 },
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int code = 2, signal = 0;',
      '    switch (code) {',
      '        case 1: signal = 100; break;',
      '        case 2: signal = 200; // No break statement here!',
      '        case 3: signal = 300; break;',
      '        default: signal = 0;',
      '    }',
      '    printf("signal = %d", signal);',
      '    return 0;',
      '}'
    ],
    options: [
      { id: 'opt-200', label: 'signal = 200', isCorrect: false },
      { id: 'opt-300', label: 'signal = 300', isCorrect: true },
      { id: 'opt-0', label: 'signal = 0', isCorrect: false },
      { id: 'opt-100', label: 'signal = 100', isCorrect: false }
    ],
    correctLabel: 'signal = 300',
    explanation: 'code matches case 2, so signal is set to 200. Because there is NO break statement, control falls through directly into case 3, overwriting signal with 300 before hitting the break statement.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize variables: code = 2, signal = 0.',
        variables: { code: 2, signal: 0 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate switch(code): code value 2 matches label case 2.',
        variables: { code: 2, signal: 0 },
        branchTaken: 'case 2'
      },
      {
        lineIndex: 5,
        description: 'case 2 executes: signal is assigned 200. Note: NO break statement!',
        variables: { code: 2, signal: 200 }
      },
      {
        lineIndex: 6,
        description: 'Fallthrough: Execution flows unconditionally into case 3! signal is overwritten to 300, then break terminates switch.',
        variables: { code: 2, signal: 300 },
        branchTaken: 'case 3 (Fallthrough)'
      },
      {
        lineIndex: 9,
        description: 'printf outputs "signal = 300".',
        variables: { code: 2, signal: 300 },
        output: 'signal = 300'
      }
    ]
  },

  // Level 3: Ternary conditional operator
  {
    id: 3,
    inputDescription: 'Ternary Conditional Operator & Nested Expressions',
    conceptName: 'Conditional Operator (?:)',
    variables: { a: 15, b: 25, max: 0, category: 0 },
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int a = 15, b = 25;',
      '    int max = (a > b) ? a : b;',
      '    int category = (max > 20) ? (max * 2) : (max / 2);',
      '    printf("max=%d, cat=%d", max, category);',
      '    return 0;',
      '}'
    ],
    options: [
      { id: 'opt-cat50', label: 'max = 25, category = 50', isCorrect: true },
      { id: 'opt-cat12', label: 'max = 25, category = 12', isCorrect: false },
      { id: 'opt-cat7', label: 'max = 15, category = 7', isCorrect: false },
      { id: 'opt-cat30', label: 'max = 15, category = 30', isCorrect: false }
    ],
    correctLabel: 'max = 25, category = 50',
    explanation: 'Expression (a > b) is (15 > 25) which is false, selecting b (25). In the next line, (max > 20) is (25 > 20) which is true, selecting (max * 2 = 50).',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize a = 15, b = 25.',
        variables: { a: 15, b: 25, max: 0, category: 0 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate (a > b): 15 > 25 is FALSE. Select false branch b (25). max becomes 25.',
        variables: { a: 15, b: 25, max: 25, category: 0 },
        conditionResult: false
      },
      {
        lineIndex: 4,
        description: 'Evaluate (max > 20): 25 > 20 is TRUE. Select true branch (25 * 2 = 50). category becomes 50.',
        variables: { a: 15, b: 25, max: 25, category: 50 },
        conditionResult: true
      },
      {
        lineIndex: 5,
        description: 'printf outputs "max=25, cat=50".',
        variables: { a: 15, b: 25, max: 25, category: 50 },
        output: 'max=25, cat=50'
      }
    ]
  }
];

export const BranchRunner: React.FC<BranchRunnerProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u1-branch'];
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());
  const [mode, setMode] = useState<GameMode>('practice');

  const currentLevel = LEVELS[currentLevelIdx];
  const selectedOpt = currentLevel.options.find(o => o.id === selectedOptId);
  const isSelectedCorrect = selectedOpt?.isCorrect ?? false;

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptId(optId);
    setIsAnswered(true);

    const chosen = currentLevel.options.find(o => o.id === optId);
    const correct = currentLevel.options.find(o => o.isCorrect);

    if (chosen?.isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 40);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Branch Runner Level ${currentLevel.id}: ${currentLevel.inputDescription}`,
          studentAnswer: chosen?.label || 'None',
          correctAnswer: correct?.label || '',
          explanation: currentLevel.explanation,
          conceptRef: currentLevel.conceptName
        }
      ]);
    }
  };

  const handleNextLevel = () => {
    soundManager.playClick();
    if (currentLevelIdx + 1 < LEVELS.length) {
      setCurrentLevelIdx(prev => prev + 1);
      setSelectedOptId(null);
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

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setSelectedOptId(null);
    setIsAnswered(false);
    setScore(0);
    setMistakes([]);
  };

  return (
    <GameContainer
      game={gameDef}
      score={score}
      maxScore={gameDef.maxScore}
      onOpenNotes={onOpenNotes}
      onExit={onExit}
      onRestart={handleRestart}
      initialMode={mode}
      onModeChange={setMode}
    >
      <div className="space-y-6">
        {/* Stage Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white">
              Decision Stage {currentLevelIdx + 1} of {LEVELS.length}
            </span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {currentLevel.inputDescription}
          </span>
        </div>

        {/* State Registers / Variable Inspector */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="font-mono">Variable Inspector (Initial State):</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap font-mono">
            {Object.entries(currentLevel.variables).map(([key, val]) => (
              <span key={key} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-400">
                {key} = <strong className="text-white">{String(val)}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Source Code Panel */}
        <div className="bg-[#05070d] rounded-xl border border-slate-800 overflow-hidden shadow-inner">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>branch_evaluation_{currentLevel.id}.c</span>
            </div>
            <span className="text-[10px] text-slate-500">Curated Program Simulation</span>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed">
            <code>{currentLevel.codeLines.join('\n')}</code>
          </pre>
        </div>

        {/* Decision Prompt & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Predict the exact program flow and standard output:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentLevel.options.map((opt) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold glow-neon';
                } else if (opt.id === selectedOptId) {
                  style = 'bg-rose-950/90 border-rose-500 text-rose-300';
                } else {
                  style = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt.label}</span>
                  {isAnswered && opt.isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswered && opt.id === selectedOptId && !opt.isCorrect && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Explanation & Execution Simulation Panel */}
        {isAnswered && (
          <InteractiveExecutionPanel
            isCorrect={isSelectedCorrect}
            selectedLabel={selectedOpt?.label || 'None'}
            correctLabel={currentLevel.correctLabel}
            explanation={currentLevel.explanation}
            codeLines={currentLevel.codeLines}
            steps={currentLevel.traceSteps}
            conceptName={currentLevel.conceptName}
            initialVariables={{ x: 1, y: 0 }}
            supportedParameters={currentLevel.supportedParameters}
            simulationRunner={currentLevel.simulationRunner}
            onNext={handleNextLevel}
            nextLabel={currentLevelIdx + 1 < LEVELS.length ? 'Next Decision Level' : 'Complete Branch Runner'}
          />
        )}
      </div>
    </GameContainer>
  );
};
