import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PlayerGameResult } from '../../types/games';
import { REVISION_NOTES_DATABASE } from '../../data/revisionNotesData';
import { downloadRevisionNoteAsText, generateNotesFilename } from '../../utils/downloadNotes';
import { downloadRevisionNoteAsDocx, generateDocxFilename } from '../../utils/downloadDocx';
import { soundManager } from '../../utils/sound';
import { 
  Trophy, 
  Star, 
  RotateCcw, 
  BookOpen, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Clock,
  FileType
} from 'lucide-react';

interface GameResultsModalProps {
  result: PlayerGameResult | null;
  isOpen: boolean;
  onReplay: () => void;
  onReturnToUnit: () => void;
  onOpenNotes: (notesId: string) => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  result,
  isOpen,
  onReplay,
  onReturnToUnit,
  onOpenNotes
}) => {
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      if (result.percentage >= 60) {
        soundManager.playVictory();
        confetti({
          particleCount: result.percentage >= 90 ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        soundManager.playError();
      }
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const matchingNote = Object.values(REVISION_NOTES_DATABASE).find(
    n => n.associatedGameId === result.gameId
  ) || REVISION_NOTES_DATABASE['notes-u1-fundamentals'];

  const handleDownloadDocx = async () => {
    soundManager.playClick();
    if (matchingNote) {
      setIsGeneratingDocx(true);
      const success = await downloadRevisionNoteAsDocx(matchingNote);
      setIsGeneratingDocx(false);
      if (success) {
        setDownloadStatus(`Saved Word Document (.docx): ${generateDocxFilename(matchingNote)}`);
        setTimeout(() => setDownloadStatus(null), 4000);
      }
    }
  };

  const handleDownloadTxt = () => {
    soundManager.playClick();
    if (matchingNote) {
      const success = downloadRevisionNoteAsText(matchingNote);
      if (success) {
        setDownloadStatus(`Saved Plain-Text (.txt): ${generateNotesFilename(matchingNote)}`);
        setTimeout(() => setDownloadStatus(null), 4000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" data-lenis-prevent>
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="results-title"
      >
        {/* Banner */}
        <div className="p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700/80 text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 mb-3 shadow-lg glow-cyan">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 id="results-title" className="text-2xl font-black text-white tracking-wide">
            {result.percentage >= 80 ? 'MISSION ACCOMPLISHED!' : result.percentage >= 50 ? 'MISSION COMPLETED' : 'MISSION REPORT'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            {result.gameId.toUpperCase()} • {result.unitId.toUpperCase()}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((starIdx) => {
              const active = starIdx <= result.starsEarned;
              return (
                <div 
                  key={starIdx}
                  className={`p-2 rounded-xl transition-all ${
                    active 
                      ? 'bg-amber-500/20 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                      : 'bg-slate-800 text-slate-600 scale-95'
                  }`}
                >
                  <Star className={`w-7 h-7 ${active ? 'fill-amber-400' : ''}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Score & XP HUD */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">Score</span>
              <span className="text-xl font-bold font-mono text-cyan-400">
                {result.score} / {result.maxScore}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">({result.percentage}%)</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1 flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> XP Earned
              </span>
              <span className="text-xl font-bold font-mono text-amber-400">
                +{result.xpEarned} XP
              </span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">Rank Progress</span>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time
              </span>
              <span className="text-xl font-bold font-mono text-slate-200">
                {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Session</span>
            </div>
          </div>

          {/* Download feedback notification */}
          {downloadStatus && (
            <div className="bg-emerald-950/80 border border-emerald-800/80 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadStatus}</span>
            </div>
          )}

          {/* Mistakes review (if any) */}
          {result.mistakes.length > 0 ? (
            <div className="bg-slate-950/80 rounded-xl border border-rose-950/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Concept Feedback & Mistakes to Review ({result.mistakes.length})</span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {result.mistakes.map((m, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
                    <p className="font-semibold text-slate-300 mb-1">{m.questionOrContext}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400 mb-1.5 font-mono">
                      <span className="text-rose-400">Your Answer: {m.studentAnswer}</span>
                      <span className="text-emerald-400">Correct: {m.correctAnswer}</span>
                    </div>
                    <p className="text-slate-400 font-sans">{m.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Flawless execution! You mastered the logic without recorded mistakes.</span>
            </div>
          )}

          {/* Mandatory Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Review Revision Notes */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenNotes(matchingNote.id);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-98 glow-cyan"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Revision Notes</span>
              </button>

              {/* 2. Download Revision Notes: Word (.docx) */}
              <button
                onClick={handleDownloadDocx}
                disabled={isGeneratingDocx}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all active:scale-98 shadow-md shadow-indigo-950/50"
                title="Download matching Microsoft Word document (.docx)"
              >
                <FileType className="w-4 h-4 text-white" />
                <span>{isGeneratingDocx ? 'Generating Word...' : 'Download Word (.docx)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Secondary text export */}
              <button
                onClick={handleDownloadTxt}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-xs font-semibold transition-colors"
                title="Download plain text fallback"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>

              {/* 3. Replay Game */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onReplay();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Replay Game</span>
              </button>

              {/* 4. Return to Unit */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onReturnToUnit();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-all active:scale-98"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Unit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
