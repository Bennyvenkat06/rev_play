import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Workflow, Check, X, ArrowRight, Sparkles } from 'lucide-react';

interface FunctionPipelineProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface PipelineChallenge {
  id: number;
  title: string;
  systemGoal: string;
  stages: {
    stageNumber: number;
    description: string;
    requiredSignature: string;
    options: {
      id: string;
      prototype: string;
      isCorrect: boolean;
    }[];
  }[];
  explanation: string;
}

const PIPELINE_CHALLENGES: PipelineChallenge[] = [
  {
    id: 1,
    title: 'Top-Down Modular Architecture: Student Grade Statistics System',
    systemGoal: 'Connect three cohesive modules with minimum coupling to read scores, compute average & highest, and display formatted report.',
    stages: [
      {
        stageNumber: 1,
        description: 'Module 1: Read student scores into an array buffer from stdin.',
        requiredSignature: 'Receives array and max capacity, returns actual number of elements read.',
        options: [
          { id: 'm1-a', prototype: 'int readScores(int scores[], int maxCapacity);', isCorrect: true },
          { id: 'm1-b', prototype: 'void readScores(int scores);', isCorrect: false },
          { id: 'm1-c', prototype: 'int readScores(void);', isCorrect: false }
        ]
      },
      {
        stageNumber: 2,
        description: 'Module 2: Compute both average and highest score in a single pass without using globals.',
        requiredSignature: 'Uses output parameters (pointers) to return multiple values to caller.',
        options: [
          { id: 'm2-a', prototype: 'void computeStats(const int scores[], int n, double *avg, int *max);', isCorrect: true },
          { id: 'm2-b', prototype: 'double computeStats(int scores[], int n);', isCorrect: false },
          { id: 'm2-c', prototype: 'void computeStats(int n);', isCorrect: false }
        ]
      },
      {
        stageNumber: 3,
        description: 'Module 3: Display report formatted to stdout.',
        requiredSignature: 'Pure consumer function with read-only data.',
        options: [
          { id: 'm3-a', prototype: 'void printReport(double avg, int max);', isCorrect: true },
          { id: 'm3-b', prototype: 'int printReport(double *avg);', isCorrect: false }
        ]
      }
    ],
    explanation: 'A well-designed top-down modular pipeline uses explicit parameters, const correctness for input buffers, and pointer output parameters when returning multiple computed values.'
  }
];

export const FunctionPipeline: React.FC<FunctionPipelineProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u2-pipeline'];
  const [selectedChoices, setSelectedChoices] = useState<Record<number, string>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const challenge = PIPELINE_CHALLENGES[0];

  const handleSelect = (stageNum: number, optionId: string) => {
    if (isVerified) return;
    soundManager.playClick();
    setSelectedChoices(prev => ({ ...prev, [stageNum]: optionId }));
  };

  const handleVerify = () => {
    let earned = 0;
    const newMistakes: PlayerGameResult['mistakes'] = [];

    challenge.stages.forEach(st => {
      const chosenId = selectedChoices[st.stageNumber];
      const correctOpt = st.options.find(o => o.isCorrect);
      if (chosenId === correctOpt?.id) {
        earned += 40;
      } else {
        newMistakes.push({
          questionOrContext: `Pipeline Stage ${st.stageNumber} Modular Contract`,
          studentAnswer: st.options.find(o => o.id === chosenId)?.prototype || 'None',
          correctAnswer: correctOpt?.prototype || '',
          explanation: `Stage ${st.stageNumber} required matching input/output parameters: ${st.requiredSignature}`,
          conceptRef: 'CS103ES Unit II: Top-down design, structure charts, modular cohesion.'
        });
      }
    });

    setIsVerified(true);
    setScore(earned);
    setMistakes(newMistakes);

    if (earned === 120) {
      soundManager.playCorrect();
    } else {
      soundManager.playError();
    }
  };

  const handleFinish = () => {
    soundManager.playClick();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const percentage = Math.round((score / gameDef.maxScore) * 100);
    const stars: 1 | 2 | 3 = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;

    onComplete({
      gameId: gameDef.id,
      unitId: gameDef.unitId,
      score,
      maxScore: gameDef.maxScore,
      percentage,
      xpEarned: Math.round(gameDef.xpReward * (percentage / 100)),
      starsEarned: stars,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      mistakes
    });
  };

  const allStagesSelected = challenge.stages.every(st => selectedChoices[st.stageNumber]);

  return (
    <GameContainer
      game={gameDef}
      score={score}
      maxScore={gameDef.maxScore}
      onOpenNotes={onOpenNotes}
      onExit={onExit}
      onRestart={() => {
        setSelectedChoices({});
        setIsVerified(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            Top-Down Modular Assembly
          </span>
          <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{challenge.systemGoal}</p>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-5">
          {challenge.stages.map((st) => (
            <div key={st.stageNumber} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  STAGE {st.stageNumber}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {st.requiredSignature}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{st.description}</p>

              <div className="space-y-2">
                {st.options.map((opt) => {
                  const isSelected = selectedChoices[st.stageNumber] === opt.id;
                  let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isVerified) {
                    if (opt.isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 glow-neon';
                    } else if (isSelected && !opt.isCorrect) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      style = 'opacity-40 text-slate-600 border-slate-900';
                    }
                  } else if (isSelected) {
                    style = 'bg-cyan-950/80 border-cyan-500 text-cyan-200';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isVerified}
                      onClick={() => handleSelect(st.stageNumber, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt.prototype}</span>
                      {isVerified && opt.isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      {isVerified && isSelected && !opt.isCorrect && <X className="w-4 h-4 text-rose-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          {!isVerified ? (
            <button
              disabled={!allStagesSelected}
              onClick={handleVerify}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                allStagesSelected
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 glow-cyan active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Verify Pipeline Architecture
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
            >
              <span>View Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </GameContainer>
  );
};

