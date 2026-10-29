import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { FileText, Check, X, ArrowRight, HelpCircle, HardDrive } from 'lucide-react';

interface FileDetectiveProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface FileClue {
  id: number;
  scenarioTitle: string;
  codeSnippet: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CLUES: FileClue[] = [
  {
    id: 1,
    scenarioTitle: 'Opening Modes: "w" vs "a"',
    codeSnippet: `FILE *fp = fopen("scores.txt", "w");
if (fp != NULL) {
    fprintf(fp, "Score: 100\\n");
    fclose(fp);
}`,
    question: 'If "scores.txt" already contained previous data, what happens when it is opened with mode `"w"`?',
    options: [
      'The file is truncated to 0 length; all previous contents are completely erased',
      'The new line is appended to the end of the existing file',
      'fopen returns NULL because the file already exists',
      'A duplicate file named scores(1).txt is created'
    ],
    correctIndex: 0,
    explanation: 'Mode "w" (write) creates an empty file if it doesn\'t exist, or truncates existing contents to zero length if it does. To preserve existing data and add to the end, mode "a" (append) must be used.'
  },
  {
    id: 2,
    scenarioTitle: 'fgetc() Return Type and EOF Constant',
    codeSnippet: `int ch;
while ((ch = fgetc(fp)) != EOF) {
    putchar(ch);
}`,
    question: 'Why MUST `ch` be declared as type `int` rather than `char` when reading with `fgetc()`?',
    options: [
      'EOF is an integer constant (-1) that cannot be safely distinguished on platforms where char is unsigned',
      'Because C compiler requires all file variables to be int',
      'Because int reads 4 characters at a time',
      'Because char cannot hold ASCII characters'
    ],
    correctIndex: 0,
    explanation: 'fgetc() returns an int so it can represent all valid unsigned char values (0 to 255) PLUS the out-of-band sentinel EOF (-1). Storing in char can truncate -1 or prevent EOF detection.'
  }
];

export const FileDetective: React.FC<FileDetectiveProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u5-file-detective'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const clue = CLUES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === clue.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 70);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `File Detective Case: ${clue.scenarioTitle}`,
          studentAnswer: clue.options[idx],
          correctAnswer: clue.options[clue.correctIndex],
          explanation: clue.explanation,
          conceptRef: 'CS103ES Unit V: Text and binary file pointers, fopen modes, EOF.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < CLUES.length) {
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
          <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
            File Case #{currentIdx + 1} of {CLUES.length}
          </span>
          <h2 className="text-lg font-bold text-white">{clue.scenarioTitle}</h2>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>File Stream Protocol</span>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono text-rose-300 overflow-x-auto leading-relaxed">
            <code>{clue.codeSnippet}</code>
          </pre>
        </div>

        {/* Question & Options */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{clue.question}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clue.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (isAnswered) {
                if (idx === clue.correctIndex) {
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
                  {isAnswered && idx === clue.correctIndex && <Check className="w-4 h-4 text-emerald-400" />}
                  {isAnswered && idx === selectedOpt && idx !== clue.correctIndex && <X className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Stream Law:</strong> {clue.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < CLUES.length ? 'Next File Clue' : 'Solve Case'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

