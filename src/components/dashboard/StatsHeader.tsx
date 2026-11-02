import React from 'react';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { Trophy, Star, Zap, Award, Flame, AlertCircle } from 'lucide-react';

interface StatsHeaderProps {
  progress: UserProgress;
  onOpenMistakesReview: () => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  progress,
  onOpenMistakesReview
}) => {
  const xpInCurrentLevel = progress.totalXp % 300;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  const totalCompleted = Object.keys(progress.completedGames).length;
  const totalStars = Object.values(progress.completedGames).reduce((acc, curr) => acc + curr.stars, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 relative z-10">
        {/* User Level and Profile */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-950/60 glow-cyan">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase font-bold">LVL</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{progress.level}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
              ★ {progress.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white font-display uppercase tracking-wide">
                C Programming Revision Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                JNTUH R25
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Level {progress.level} Master • {300 - xpInCurrentLevel} XP until Level {progress.level + 1}
            </p>

            {/* XP Progress Bar */}
            <div className="w-40 sm:w-64 h-2 bg-slate-950 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500 rounded-full" 
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Badges (responsive 3-col on mobile) */}
        <div className="w-full md:w-auto space-y-2.5">
          <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-3">
            <div className="bg-slate-950/80 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-amber-400 font-mono">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span>Stars</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white font-mono">{totalStars}</div>
            </div>

            <div className="bg-slate-950/80 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-cyan-400 font-mono">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Missions</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white font-mono">{totalCompleted}/16</div>
            </div>

            <div className="bg-slate-950/80 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-rose-400 font-mono">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-400" />
                <span>Streak</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white font-mono">{progress.streakDays}d</div>
            </div>
          </div>

          {/* Mistakes Review Queue Button */}
          {progress.mistakeReviewQueue.length > 0 && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMistakesReview();
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold transition-all shadow-md active:scale-95"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Review Mistakes ({progress.mistakeReviewQueue.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

