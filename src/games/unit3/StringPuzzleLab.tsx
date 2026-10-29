import React, { useState } from 'react';
import { GameContainer } from '../shared/GameContainer';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { PlayerGameResult } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { Binary, Check, X, ArrowRight, HelpCircle } from 'lucide-react';

interface StringPuzzleLabProps {
  onComplete: (result: PlayerGameResult) => void;
  onExit: () => void;
  onOpenNotes: (notesId: string) => void;
}

interface StringChallenge {
  id: number;
  title: string;
  bufferVisualization: { char: string; index: number; isNull: boolean }[];
  codeSnippet: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const STRING_CHALLENGES: StringChallenge[] = [
  {
    id: 1,
    title: 'The Null Terminator Boundary (\\0)',
    bufferVisualization: [
      { char: 'H', index: 0, isNull: false },
      { char: 'e', index: 1, isNull: false },
      { char: 'l', index: 2, isNull: false },
      { char: '\\0', index: 3, isNull: true },
      { char: 'l', index: 4, isNull: false },
      { char: 'o', index: 5, isNull: false },
      { char: '\\0', index: 6, isNull: true },
    ],
    codeSnippet: `char str[7] = {'H', 'e', 'l', '\\0', 'l', 'o', '\\0'};
size_t len = strlen(str);
printf("%s (len=%lu)", str, (unsigned long)len);`,
    prompt: 'What does `printf("%s", str)` display, and what does `strlen(str)` return?',
    options: [
      'Prints "Hel" and returns length 3',
      'Prints "Hello" and returns length 5',
      'Prints "Hel\\0lo" and returns length 6',
      'Compile error due to premature null terminator'
    ],
    correctIndex: 0,
    explanation: 'In C, strings are terminated by the FIRST null character (\'\\0\'). strlen() and %s stop immediately upon encountering \'\\0\' at index 3, yielding "Hel" of length 3. The trailing characters are ignored.'
  },
  {
    id: 2,
    title: 'strcmp() Lexicographical ASCII Comparison',
    bufferVisualization: [
      { char: 'A', index: 0, isNull: false },
      { char: 'p', index: 1, isNull: false },
      { char: 'p', index: 2, isNull: false },
      { char: '\\0', index: 3, isNull: true }
    ],
    codeSnippet: `char s1[] = "Apple";
char s2[] = "Banana";
int cmp = strcmp(s1, s2);`,
    prompt: 'What is the sign of the integer returned by `strcmp(s1, s2)`?',
    options: [
      'Negative integer (< 0), because \'A\' (65) < \'B\' (66) in ASCII',
      'Positive integer (> 0), because s1 is shorter',
      '0 (Equal)',
      'Returns 1 always'
    ],
    correctIndex: 0,
    explanation: 'strcmp compares character-by-character based on ASCII values. At index 0, \'A\' (ASCII 65) is less than \'B\' (ASCII 66), so strcmp returns a negative value.'
  }
];

export const StringPuzzleLab: React.FC<StringPuzzleLabProps> = ({
  onComplete,
  onExit,
  onOpenNotes
}) => {
  const gameDef = GAMES_REGISTRY['game-u3-string-lab'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<PlayerGameResult['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const ch = STRING_CHALLENGES[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === ch.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 70);
    } else {
      soundManager.playError();
      setMistakes(prev => [
        ...prev,
        {
          questionOrContext: `String Lab Challenge: ${ch.title}`,
          studentAnswer: ch.options[idx],
          correctAnswer: ch.options[ch.correctIndex],
          explanation: ch.explanation,
          conceptRef: 'CS103ES Unit III: String null terminator and string library functions.'
        }
      ]);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < STRING_CHALLENGES.length) {
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
            String Lab Inspection {currentIdx + 1} of {STRING_CHALLENGES.length}
          </span>
          <h2 className="text-lg font-bold text-white">{ch.title}</h2>
        </div>

        {/* Visual String Buffer with Null Terminator Indicator */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Character Memory Cells (1 byte per char)
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {ch.bufferVisualization.map((c, idx) => (
              <div 
                key={idx}
                className={`w-12 h-14 rounded-xl border flex flex-col items-center justify-center font-mono ${
                  c.isNull 
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold' 
                    : 'bg-slate-900 border-slate-700 text-cyan-300 font-bold'
                }`}
              >
                <span className="text-base">{c.char}</span>
                <span className="text-[9px] text-slate-500">[{c.index}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <pre className="p-4 text-xs sm:text-sm font-mono text-purple-300 overflow-x-auto leading-relaxed">
            <code>{ch.codeSnippet}</code>
          </pre>
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
              <strong>Buffer Rule:</strong> {ch.explanation}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 glow-cyan"
              >
                <span>{currentIdx + 1 < STRING_CHALLENGES.length ? 'Next String Challenge' : 'Complete String Lab'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </GameContainer>
  );
};

