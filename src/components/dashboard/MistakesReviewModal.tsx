import React from 'react';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { AlertCircle, X, RotateCcw, BookOpen, Check } from 'lucide-react';

interface MistakesReviewModalProps {
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
  onReplayGame: (gameId: string) => void;
  onOpenNotes: (notesId: string) => void;
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  progress,
  isOpen,
  onClose,
  onReplayGame,
  onOpenNotes
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[85vh] animate-in zoom-in-95 duration-200">
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mistakes & Remedial Review Queue</h2>
              <p className="text-xs text-slate-400">Targeted review of missed concepts to ensure full exam readiness</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4" data-lenis-prevent>
          {progress.mistakeReviewQueue.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-200">No mistakes in your review queue!</p>
              <p className="text-xs text-slate-500 mt-1">Play games to test your mastery across all units.</p>
            </div>
          ) : (
            progress.mistakeReviewQueue.map((m) => (
              <div key={m.id} className="bg-slate-950 p-4 rounded-xl border border-rose-950/80 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white font-mono">{m.question}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {m.gameId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300">
                    <strong>Your Response:</strong> {m.studentAnswer}
                  </div>
                  <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                    <strong>Correct Solution:</strong> {m.correctAnswer}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <strong>Explanation:</strong> {m.explanation}
                </p>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-cyan-400/80 font-mono">
                    Ref: {m.conceptRef}
                  </span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onClose();
                      onReplayGame(m.gameId);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Mission</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

