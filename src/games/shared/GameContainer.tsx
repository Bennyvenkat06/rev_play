import React, { useState } from 'react';
import { GameDefinition } from '../../types/games';
import { soundManager } from '../../utils/sound';
import { 
  Trophy, 
  Heart, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  Compass,
  Zap
} from 'lucide-react';

export type GameMode = 'practice' | 'challenge';

interface GameContainerProps {
  game: GameDefinition;
  score: number;
  maxScore: number;
  lives?: number;
  maxLives?: number;
  timeRemaining?: number; // seconds, if timed
  onOpenNotes: (notesId: string) => void;
  onExit: () => void;
  onRestart: () => void;
  children: React.ReactNode;
  initialMode?: GameMode;
  onModeChange?: (mode: GameMode) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  game,
  score,
  maxScore,
  lives,
  maxLives = 3,
  timeRemaining,
  onOpenNotes,
  onExit,
  onRestart,
  children,
  initialMode = 'practice',
  onModeChange
}) => {
  const [soundOn, setSoundOn] = useState(soundManager.enabled);
  const [mode, setMode] = useState<GameMode>(initialMode);

  const toggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    setSoundOn(soundManager.enabled);
    if (soundManager.enabled) soundManager.playClick();
  };

  const handleModeSwitch = (newMode: GameMode) => {
    soundManager.playClick();
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Game HUD Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onExit();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Return to Unit"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-400">
                {game.badge}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                {game.difficulty}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white mt-0.5">{game.title}</h1>
          </div>
        </div>

        {/* Live HUD Elements */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Practice vs Challenge Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => handleModeSwitch('practice')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'practice'
                  ? 'bg-cyan-600 text-slate-950 font-bold glow-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Practice Mode: Unlimited time, in-depth step traces, and no penalty pressure"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Practice</span>
            </button>
            <button
              onClick={() => handleModeSwitch('challenge')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'challenge'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Challenge Mode: Timed scoring challenge"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Challenge</span>
            </button>
          </div>

          {/* Lives (shown in challenge mode if enabled) */}
          {mode === 'challenge' && lives !== undefined && (
            <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              {Array.from({ length: maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all ${
                    i < lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-700 scale-90'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Timer (shown in challenge mode if applicable) */}
          {mode === 'challenge' && timeRemaining !== undefined && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <Clock className={`w-4 h-4 ${timeRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
              <span className={timeRemaining <= 10 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-bold">{score}</span>
            <span className="text-slate-500">/ {maxScore}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenNotes(game.notesId);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-semibold transition-colors"
              title="Review syllabus revision notes for this game"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onRestart();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title={soundOn ? 'Mute sound' : 'Enable sound'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative min-h-[500px]">
        {children}
      </div>
    </div>
  );
};
