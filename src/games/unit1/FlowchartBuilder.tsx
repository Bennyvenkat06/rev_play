import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { GitCommit, Check, X, ArrowRight, ArrowDown, MoveUp, MoveDown, Play } from 'lucide-react';

interface FlowchartBuilderProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface Block {
  id: string;
  type: 'terminal' | 'input' | 'process' | 'decision';
  label: string;
  codeMapping: string;
}

interface FlowchartMission {
  id: number;
  title: string;
  goal: string;
  blocks: Block[];
  correctSequence: string[]; // array of block IDs in correct order
  explanation: string;
}

const MISSIONS: FlowchartMission[] = [
  {
    id: 1,
    title: 'Algorithm: Find Maximum of Three Numbers (A, B, C)',
    goal: 'Order the flowchart sequence so the program correctly identifies and prints the largest integer.',
    blocks: [
      { id: 'b-start', type: 'terminal', label: 'START Program', codeMapping: 'int main(void) {' },
      { id: 'b-input', type: 'input', label: 'READ integers a, b, c', codeMapping: 'scanf("%d %d %d", &a, &b, &c);' },
      { id: 'b-dec1', type: 'decision', label: 'IS a >= b AND a >= c ?', codeMapping: 'if (a >= b && a >= c) { max = a; }' },
      { id: 'b-dec2', type: 'decision', label: 'ELSE IF b >= c ?', codeMapping: 'else if (b >= c) { max = b; }' },
      { id: 'b-proc', type: 'process', label: 'ELSE max = c', codeMapping: 'else { max = c; }' },
      { id: 'b-out', type: 'input', label: 'PRINT max', codeMapping: 'printf("Max: %d", max);' },
      { id: 'b-end', type: 'terminal', label: 'END Program', codeMapping: 'return 0; }' }
    ],
    correctSequence: ['b-start', 'b-input', 'b-dec1', 'b-dec2', 'b-proc', 'b-out', 'b-end'],
    explanation: 'First read inputs; then check if a is greatest; if false, test b >= c; if both fail, c is greatest; finally print output and terminate.'
  },
  {
    id: 2,
    title: 'Algorithm: Counting Loop Sum of First N Positive Integers',
    goal: 'Assemble the structured loop flowchart to calculate sum = 1 + 2 + ... + N.',
    blocks: [
      { id: 'b-start', type: 'terminal', label: 'START Program', codeMapping: 'int main(void) {' },
      { id: 'b-init', type: 'process', label: 'INITIALIZE sum = 0, i = 1', codeMapping: 'int sum = 0, i = 1;' },
      { id: 'b-input', type: 'input', label: 'READ integer N', codeMapping: 'scanf("%d", &n);' },
      { id: 'b-loop', type: 'decision', label: 'IS i <= N ? (Loop Condition)', codeMapping: 'while (i <= n) {' },
      { id: 'b-accum', type: 'process', label: 'sum = sum + i; i = i + 1;', codeMapping: '    sum += i; i++; }' },
      { id: 'b-out', type: 'input', label: 'PRINT sum', codeMapping: 'printf("%d", sum);' },
      { id: 'b-end', type: 'terminal', label: 'END Program', codeMapping: 'return 0; }' }
    ],
    correctSequence: ['b-start', 'b-init', 'b-input', 'b-loop', 'b-accum', 'b-out', 'b-end'],
    explanation: 'Variables sum and i must be initialized before entering the loop. The condition (i <= N) governs accumulation until i exceeds N.'
  }
];

export const FlowchartBuilder: React.FC<FlowchartBuilderProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u1-flowchart'];
  const [missionIdx, setMissionIdx] = useState(0);
  const currentMission = MISSIONS[missionIdx];

  // Scramble blocks initially (except keeping start at beginning optionally, or fully shuffled)
  const [userSequence, setUserSequence] = useState<string[]>(() => {
    return [...currentMission.correctSequence].sort(() => Math.random() - 0.5);
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const moveUp = (index: number) => {
    if (index === 0 || isVerified) return;
    soundManager.playClick();
    const updated = [...userSequence];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setUserSequence(updated);
  };

  const moveDown = (index: number) => {
    if (index === userSequence.length - 1 || isVerified) return;
    soundManager.playClick();
    const updated = [...userSequence];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setUserSequence(updated);
  };

  const handleVerify = () => {
    const isCorrect = userSequence.every((id, idx) => id === currentMission.correctSequence[idx]);
    setIsVerified(true);
    setIsSuccess(isCorrect);

    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 60);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `Flowchart Builder: ${currentMission.title}`,
          studentAnswer: 'Incorrect flowchart block sequencing',
          correctAnswer: 'Strict logical sequence: Init -> Input -> Decisions -> Body -> Output -> Exit',
          explanation: currentMission.explanation,
          conceptRef: 'CS103ES Unit I: Algorithmic decision steps and structured loop design.'
        }
      ]);
    }
  };

  const handleNextMission = () => {
    soundManager.playClick();
    if (missionIdx + 1 < MISSIONS.length) {
      const nextIdx = missionIdx + 1;
      setMissionIdx(nextIdx);
      setUserSequence([...MISSIONS[nextIdx].correctSequence].sort(() => Math.random() - 0.5));
      setIsVerified(false);
      setIsSuccess(false);
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

  const blockMap = new Map(currentMission.blocks.map(b => [b.id, b]));

  return (
    <GameContainer
      game={gameDef}
      score={score}
      maxScore={gameDef.maxScore}
      onOpenNotes={onOpenNotes}
      onExit={onExit}
      onRestart={() => {
        setMissionIdx(0);
        setUserSequence([...MISSIONS[0].correctSequence].sort(() => Math.random() - 0.5));
        setIsVerified(false);
        setIsSuccess(false);
        setScore(0);
        setMistakes([]);
      }}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            Flowchart Mission {missionIdx + 1} of {MISSIONS.length}
          </span>
          <h2 className="text-lg font-bold text-white">{currentMission.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentMission.goal}</p>
        </div>

        {/* Reorderable Sequence List */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          {userSequence.map((id, index) => {
            const block = blockMap.get(id);
            if (!block) return null;

            const isCorrectPosition = isVerified && id === currentMission.correctSequence[index];
            const isIncorrectPosition = isVerified && id !== currentMission.correctSequence[index];

            return (
              <React.Fragment key={id}>
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isCorrectPosition
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : isIncorrectPosition
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono flex items-center justify-center text-cyan-400 font-bold shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold font-mono tracking-wide flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          block.type === 'decision' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          block.type === 'input' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                          block.type === 'terminal' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          'bg-slate-900 text-slate-400'
                        }`}>
                          {block.type.toUpperCase()}
                        </span>
                        <span>{block.label}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {block.codeMapping}
                      </div>
                    </div>
                  </div>

                  {/* Move Up/Down Controls */}
                  {!isVerified && (
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => moveUp(index)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={index === userSequence.length - 1}
                        onClick={() => moveDown(index)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {index < userSequence.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Verification and Next Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          {!isVerified ? (
            <button
              onClick={handleVerify}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
            >
              Verify Flowchart Logic
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-4 flex-wrap animate-in fade-in">
              <div className="flex items-center gap-2">
                {isSuccess ? (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Perfect Sequence! +60 Points
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Flowchart Sequence Incorrect
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">({currentMission.explanation})</span>
              </div>

              <button
                onClick={handleNextMission}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{missionIdx + 1 < MISSIONS.length ? 'Next Mission' : 'Complete Flowchart Builder'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </GameContainer>
  );
};

