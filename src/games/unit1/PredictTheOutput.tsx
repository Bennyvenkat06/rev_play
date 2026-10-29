import React, { useState } from 'react';
import { GameContainer, GameMode } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Check, X, Terminal, HelpCircle } from 'lucide-react';
import { InteractiveExecutionPanel, ExecutionTraceStep } from '../../components/simulation/InteractiveExecutionPanel';

interface PredictTheOutputProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface Question {
  id: number;
  snippet: string;
  codeLines: string[];
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptRef: string;
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

const QUESTIONS: Question[] = [
  {
    id: 1,
    snippet: `#include <stdio.h>

int main(void) {
    int a = 14, b = 4;
    printf("%d, %.2f", a / b, (float)a / b);
    return 0;
}`,
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int a = 14, b = 4;',
      '    printf("%d, %.2f", a / b, (float)a / b);',
      '    return 0;',
      '}'
    ],
    options: ['3, 3.50', '3.50, 3.50', '3, 3.00', '3.5, 3.5'],
    correctIndex: 0,
    explanation: 'Integer division (14 / 4) truncates towards zero to 3. The cast (float)a promotes 14 to 14.0f before division by 4, producing 3.50.',
    conceptRef: 'CS103ES Unit I: Integer division vs explicit type casting & format specifiers.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize a = 14, b = 4 in local execution scope.',
        variables: { a: 14, b: 4 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate a / b: 14 / 4 truncates decimal to integer 3.',
        variables: { a: 14, b: 4, 'a / b': 3 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate (float)a / b: 14.0f / 4 evaluates to 3.500000f.',
        variables: { a: 14, b: 4, '(float)a / b': 3.5 },
        output: '3, 3.50'
      },
      {
        lineIndex: 4,
        description: 'Program exits with status 0.',
        variables: { a: 14, b: 4 },
        output: '3, 3.50'
      }
    ]
  },
  {
    id: 2,
    snippet: `#include <stdio.h>

int main(void) {
    int x = 5;
    int y = ++x * 2;
    int z = x++ * 2;
    printf("x=%d, y=%d, z=%d", x, y, z);
    return 0;
}`,
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int x = 5;',
      '    int y = ++x * 2;',
      '    int z = x++ * 2;',
      '    printf("x=%d, y=%d, z=%d", x, y, z);',
      '    return 0;',
      '}'
    ],
    options: ['x=7, y=12, z=12', 'x=7, y=10, z=12', 'x=6, y=12, z=12', 'x=7, y=12, z=14'],
    correctIndex: 0,
    explanation: '++x increments x to 6 before multiplication (y = 6 * 2 = 12). In x++ * 2, the current value of x (6) is used in multiplication (z = 6 * 2 = 12), and then x is incremented to 7.',
    conceptRef: 'CS103ES Unit I: Prefix (++x) vs Postfix (x++) increment operators.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize x = 5.',
        variables: { x: 5, y: 0, z: 0 }
      },
      {
        lineIndex: 3,
        description: 'Prefix ++x increments x from 5 to 6 first; then y = 6 * 2 = 12.',
        variables: { x: 6, y: 12, z: 0 }
      },
      {
        lineIndex: 4,
        description: 'Postfix x++ evaluates current x (6) * 2 = 12 for z; then x increments to 7.',
        variables: { x: 7, y: 12, z: 12 }
      },
      {
        lineIndex: 5,
        description: 'printf outputs "x=7, y=12, z=12".',
        variables: { x: 7, y: 12, z: 12 },
        output: 'x=7, y=12, z=12'
      }
    ]
  },
  {
    id: 3,
    snippet: `#include <stdio.h>

int main(void) {
    int a = 10, b = 20, c = 30;
    int result = a + b * c / 10;
    printf("%d", result);
    return 0;
}`,
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int a = 10, b = 20, c = 30;',
      '    int result = a + b * c / 10;',
      '    printf("%d", result);',
      '    return 0;',
      '}'
    ],
    options: ['70', '90', '30', '100'],
    correctIndex: 0,
    explanation: '* and / have higher precedence than + and associate left-to-right: b * c = 600, then 600 / 10 = 60, then a + 60 = 70.',
    conceptRef: 'CS103ES Unit I: Arithmetic operator precedence and associativity.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize a = 10, b = 20, c = 30.',
        variables: { a: 10, b: 20, c: 30, result: 0 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate b * c: 20 * 30 = 600.',
        variables: { a: 10, b: 20, c: 30, 'subExpr': 600 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate 600 / 10 = 60. Then a + 60 = 70.',
        variables: { a: 10, b: 20, c: 30, result: 70 }
      },
      {
        lineIndex: 4,
        description: 'printf outputs "70".',
        variables: { a: 10, b: 20, c: 30, result: 70 },
        output: '70'
      }
    ]
  },
  {
    id: 4,
    snippet: `#include <stdio.h>

int main(void) {
    int x = 1, y = 0;
    if (x || ++y) {
        printf("Branch 1: y=%d", y);
    } else {
        printf("Branch 2: y=%d", y);
    }
    return 0;
}`,
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int x = 1, y = 0;',
      '    if (x || ++y) {',
      '        printf("Branch 1: y=%d", y);',
      '    } else {',
      '        printf("Branch 2: y=%d", y);',
      '    }',
      '    return 0;',
      '}'
    ],
    options: ['Branch 1: y=0', 'Branch 1: y=1', 'Branch 2: y=0', 'Branch 2: y=1'],
    correctIndex: 0,
    explanation: 'Short-circuit evaluation in C! Since left operand x is non-zero (1), the logical OR (||) condition evaluates to true. The right side (++y) is NEVER evaluated, so y remains 0 and Branch 1 executes.',
    conceptRef: 'CS103ES Unit I: Short-circuit evaluation in logical conditions.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize x = 1, y = 0 in execution scope.',
        variables: { x: 1, y: 0 }
      },
      {
        lineIndex: 3,
        description: 'Evaluate left operand: x is 1 (non-zero, TRUE).',
        variables: { x: 1, y: 0 },
        conditionResult: true
      },
      {
        lineIndex: 3,
        description: 'Short-circuit active: ++y is SKIPPED! y remains 0.',
        variables: { x: 1, y: 0 },
        skippedExpr: '++y skipped (not evaluated)',
        conditionResult: true,
        branchTaken: 'Branch 1'
      },
      {
        lineIndex: 4,
        description: 'Branch 1 executes: printf outputs "Branch 1: y=0".',
        variables: { x: 1, y: 0 },
        branchTaken: 'Branch 1',
        output: 'Branch 1: y=0'
      },
      {
        lineIndex: 8,
        description: 'Program terminates and returns 0.',
        variables: { x: 1, y: 0 },
        output: 'Branch 1: y=0'
      }
    ],
    supportedParameters: [
      {
        key: 'x',
        label: 'Initial value of x',
        min: 0,
        max: 1,
        step: 1,
        description: 'Set x=1 to see short-circuit skip ++y. Set x=0 to see ++y evaluate!'
      },
      {
        key: 'y',
        label: 'Initial value of y',
        min: 0,
        max: 3,
        step: 1,
        description: 'Starting value of y before evaluation.'
      }
    ],
    simulationRunner: (params) => {
      const initX = params.x ?? 1;
      let curY = params.y ?? 0;
      const initialY = curY;
      const isXTrue = initX !== 0;

      const steps: ExecutionTraceStep[] = [
        {
          lineIndex: 2,
          description: `Initialize x = ${initX}, y = ${initialY}.`,
          variables: { x: initX, y: initialY }
        }
      ];

      if (isXTrue) {
        steps.push({
          lineIndex: 3,
          description: `Evaluate left operand: x is ${initX} (TRUE).`,
          variables: { x: initX, y: initialY },
          conditionResult: true
        });
        steps.push({
          lineIndex: 3,
          description: `Short-circuit active: ++y is SKIPPED. y remains ${initialY}.`,
          variables: { x: initX, y: initialY },
          skippedExpr: '++y skipped',
          conditionResult: true,
          branchTaken: 'Branch 1'
        });
        steps.push({
          lineIndex: 4,
          description: `Branch 1 executes: printf outputs "Branch 1: y=${initialY}".`,
          variables: { x: initX, y: initialY },
          branchTaken: 'Branch 1',
          output: `Branch 1: y=${initialY}`
        });
        steps.push({
          lineIndex: 8,
          description: 'Program exits with code 0.',
          variables: { x: initX, y: initialY },
          output: `Branch 1: y=${initialY}`
        });
        return { steps, finalOutput: `Branch 1: y=${initialY}` };
      } else {
        curY += 1;
        steps.push({
          lineIndex: 3,
          description: 'Evaluate left operand: x is 0 (FALSE). Cannot short-circuit!',
          variables: { x: initX, y: initialY },
          conditionResult: false
        });
        steps.push({
          lineIndex: 3,
          description: `Right operand (++y) MUST evaluate! y increments to ${curY}.`,
          variables: { x: initX, y: curY },
          conditionResult: curY !== 0,
          branchTaken: 'Branch 1'
        });
        steps.push({
          lineIndex: 4,
          description: `Branch 1 executes: printf outputs "Branch 1: y=${curY}".`,
          variables: { x: initX, y: curY },
          branchTaken: 'Branch 1',
          output: `Branch 1: y=${curY}`
        });
        steps.push({
          lineIndex: 8,
          description: 'Program exits with code 0.',
          variables: { x: initX, y: curY },
          output: `Branch 1: y=${curY}`
        });
        return { steps, finalOutput: `Branch 1: y=${curY}` };
      }
    }
  },
  {
    id: 5,
    snippet: `#include <stdio.h>

int main(void) {
    int i = 0, sum = 0;
    while (i < 4) {
        i++;
        if (i == 2) continue;
        sum += i;
    }
    printf("sum = %d", sum);
    return 0;
}`,
    codeLines: [
      '#include <stdio.h>',
      'int main(void) {',
      '    int i = 0, sum = 0;',
      '    while (i < 4) {',
      '        i++;',
      '        if (i == 2) continue;',
      '        sum += i;',
      '    }',
      '    printf("sum = %d", sum);',
      '    return 0;',
      '}'
    ],
    options: ['sum = 8', 'sum = 10', 'sum = 6', 'sum = 7'],
    correctIndex: 0,
    explanation: 'Iterations: i=1 (sum=1); i=2 (continue skips addition); i=3 (sum=1+3=4); i=4 (sum=4+4=8). Loop terminates because 4 < 4 is false.',
    conceptRef: 'CS103ES Unit I: while loops and the continue statement.',
    traceSteps: [
      {
        lineIndex: 2,
        description: 'Initialize i = 0, sum = 0.',
        variables: { i: 0, sum: 0 }
      },
      {
        lineIndex: 4,
        description: 'Iteration 1: i becomes 1; sum += 1 -> sum = 1.',
        variables: { i: 1, sum: 1 }
      },
      {
        lineIndex: 5,
        description: 'Iteration 2: i becomes 2; i == 2 is TRUE, continue skips addition!',
        variables: { i: 2, sum: 1 },
        skippedExpr: 'sum += i skipped by continue'
      },
      {
        lineIndex: 6,
        description: 'Iteration 3: i becomes 3; sum += 3 -> sum = 4.',
        variables: { i: 3, sum: 4 }
      },
      {
        lineIndex: 6,
        description: 'Iteration 4: i becomes 4; sum += 4 -> sum = 8.',
        variables: { i: 4, sum: 8 }
      },
      {
        lineIndex: 8,
        description: 'Loop terminates because i < 4 (4 < 4) is FALSE. printf outputs "sum = 8".',
        variables: { i: 4, sum: 8 },
        output: 'sum = 8'
      }
    ]
  }
];

export const PredictTheOutput: React.FC<PredictTheOutputProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u1-predict'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());
  const [mode, setMode] = useState<GameMode>('practice');

  const currentQ = QUESTIONS[currentIdx];
  const isSelectedCorrect = selectedOption === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 20);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `C Snippet #${currentQ.id} Output Prediction`,
          studentAnswer: currentQ.options[idx],
          correctAnswer: currentQ.options[currentQ.correctIndex],
          explanation: currentQ.explanation,
          conceptRef: currentQ.conceptRef
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
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
    setCurrentIdx(0);
    setSelectedOption(null);
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
      <div className="space-y-5">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
          <span className="text-cyan-400 font-bold">{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}% Completed</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Code Snippet Terminal */}
        <div className="bg-[#05070d] rounded-xl border border-slate-800 overflow-hidden shadow-inner">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-300">challenge_{currentQ.id}.c</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Curated Program Simulation</span>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed">
            <code>{currentQ.snippet}</code>
          </pre>
        </div>

        {/* Question Prompt */}
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Predict the exact standard output printed to stdout:</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold glow-neon';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-300';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-left font-mono text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <X className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Automatically Expanded Interactive Explanation & Execution Simulation Panel */}
        {isAnswered && (
          <InteractiveExecutionPanel
            isCorrect={isSelectedCorrect}
            selectedLabel={selectedOption !== null ? currentQ.options[selectedOption] : 'None'}
            correctLabel={currentQ.options[currentQ.correctIndex]}
            explanation={currentQ.explanation}
            codeLines={currentQ.codeLines}
            steps={currentQ.traceSteps}
            conceptName={currentQ.conceptRef.split(':')[1]?.trim() || currentQ.conceptRef}
            initialVariables={{ x: 1, y: 0 }}
            supportedParameters={currentQ.supportedParameters}
            simulationRunner={currentQ.simulationRunner}
            onNext={handleNext}
            nextLabel={currentIdx + 1 < QUESTIONS.length ? 'Next Question' : 'Complete Challenge'}
          />
        )}
      </div>
    </GameContainer>
  );
};
