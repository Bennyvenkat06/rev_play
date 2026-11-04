import React, { useState } from 'react';
import { LabPracticeArena } from './LabPracticeArena';
import { LabChallengeArena } from './LabChallengeArena';
import { soundManager } from '../../utils/sound';
import {
  Compass,
  Zap,
  FlaskConical,
  Terminal,
  Code2,
  BookOpen,
  Layers,
  ShieldCheck
} from 'lucide-react';

export type LabMode = 'practice' | 'challenge';

interface LabSectionProps {
  initialMode?: LabMode;
  onModeChange?: (mode: LabMode) => void;
  onOpenNotes: (notesId: string) => void;
}

export const LabSection: React.FC<LabSectionProps> = ({
  initialMode = 'practice',
  onModeChange,
  onOpenNotes
}) => {
  const [mode, setMode] = useState<LabMode>(initialMode);

  const handleModeSwitch = (newMode: LabMode) => {
    soundManager.playClick();
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Academic Section Header with Integrated Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                JNTUH R25 CS107ES
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Programming for Problem Solving Lab (Practical)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              Laboratory Workbench & Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Master hands-on C programming through prescribed experiment simulations, line-level bug hunting, and independent algorithmic programming challenges.
            </p>
          </div>

          {/* Integrated Mode Switcher: Practice vs Challenge */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono shadow-inner shrink-0">
            <button
              onClick={() => handleModeSwitch('practice')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                mode === 'practice'
                  ? 'bg-cyan-600 text-slate-950 glow-cyan shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Practice Mode</span>
            </button>
            <button
              onClick={() => handleModeSwitch('challenge')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                mode === 'challenge'
                  ? 'bg-indigo-600 text-white shadow-md glow-neon'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Challenge Mode</span>
            </button>
          </div>
        </div>

        {/* Mode Description Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {mode === 'practice'
                ? 'Active Mode: Guided laboratory experiments, interactive simulations, and bug hunting.'
                : 'Active Mode: Independent problem solving with code editor, custom stdin console, and test-case verification.'}
            </span>
          </div>
          <span className="text-slate-500">6 Prescribed Lab Groups • 16 Reconciled Programmes</span>
        </div>
      </div>

      {/* RENDER MODE EXPERIENCE */}
      {mode === 'challenge' ? (
        /* 4B: LABORATORY CHALLENGE EXPERIENCE */
        <LabChallengeArena
          onOpenNotes={onOpenNotes}
        />
      ) : (
        /* 4A: LABORATORY PRACTICE EXPERIENCE (Complete existing Lab Arena preserved) */
        <LabPracticeArena
          onOpenNotes={onOpenNotes}
        />
      )}
    </div>
  );
};

