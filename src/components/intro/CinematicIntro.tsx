import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Cpu, 
  GitBranch, 
  RotateCw,
  ArrowRight,
  Layers
} from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [currentScene, setCurrentScene] = useState<1 | 2 | 3 | 4 | 5>(() => prefersReducedMotion ? 5 : 1);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const isFinishedRef = useRef(false);

  // Prevent background scrolling while intro is displayed
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (isFinishedRef.current) return;

    // Reduced motion duration: 1.2s static accessible identity screen
    // Standard cinematic duration: 3.8s finite single-pass sequence
    const totalDuration = prefersReducedMotion ? 1200 : 3800;
    const startTime = Date.now();

    const finishIntro = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      setIsFadingOut(true);
      soundManager.playClick();
      setTimeout(() => {
        onComplete();
      }, 350);
    };

    // Single master timeline loop: Progress bar and scenes are synchronized to the exact same clock
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgressPercent(pct);

      if (prefersReducedMotion) {
        setCurrentScene(5);
      } else {
        // Precise scene timeline breakdown (total 3800ms)
        // 0ms - 750ms: Scene 1 (Awakening)
        // 750ms - 1500ms: Scene 2 (Memory)
        // 1500ms - 2300ms: Scene 3 (Logic)
        // 2300ms - 3100ms: Scene 4 (Identity)
        // 3100ms - 3800ms: Scene 5 (Entry & Direct Transition)
        if (elapsed < 750) {
          setCurrentScene(1);
        } else if (elapsed < 1500) {
          setCurrentScene(2);
        } else if (elapsed < 2300) {
          setCurrentScene(3);
        } else if (elapsed < 3100) {
          setCurrentScene(4);
        } else {
          setCurrentScene(5);
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        finishIntro();
      }
    }, 25);

    return () => {
      clearInterval(timer);
    };
  }, [prefersReducedMotion]);

  // Code runes for Scene 1
  const codeRunes = [
    { char: 'int main()', x: '10%', y: '24%' },
    { char: '{ ... }', x: '82%', y: '20%' },
    { char: 'char *ptr;', x: '75%', y: '68%' },
    { char: '&memory', x: '14%', y: '72%' },
    { char: '->', x: '48%', y: '16%' },
    { char: '0x7FFE_4A20', x: '12%', y: '48%' },
    { char: 'return 0;', x: '84%', y: '45%' },
  ];

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#04060a] text-slate-100 flex flex-col justify-between overflow-hidden select-none transition-all duration-300 ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="RevPlay Cinematic Introduction"
    >
      {/* Background Animated Tech Grid & Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="intro-grid-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="intro-radial-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#4f46e5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#04060a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#intro-grid-pattern)" />
          <rect width="100%" height="100%" fill="url(#intro-radial-glow)" />
        </svg>

        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Top Header: Responsive branding */}
      <header className="relative z-20 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block">
              Cinematic Intro
            </span>
            <span className="text-xs sm:text-sm font-black tracking-wider text-white font-display uppercase">
              THE C REALM — CODE BECOMES A WORLD
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Entering Home...
        </div>
      </header>

      {/* Center Stage: Sequential, finite playback of all 5 scenes */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6">
        {/* ========================================================= */}
        {/* SCENE 1: AWAKENING (0 - 750ms) */}
        {/* ========================================================= */}
        {currentScene === 1 && !prefersReducedMotion && (
          <div className="text-center space-y-4 max-w-xl animate-in duration-300">
            {codeRunes.map((rune, idx) => (
              <span
                key={idx}
                className="absolute font-mono text-[11px] sm:text-xs font-bold text-cyan-400/60 select-none pointer-events-none drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] hidden sm:inline intro-rune-float"
                style={{ 
                  left: rune.x, 
                  top: rune.y,
                  animationDelay: `${idx * 0.35}s`
                }}
              >
                {rune.char}
              </span>
            ))}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Scene 1 • Awakening</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
              Raw Code Awakens.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto">
              Behind every curly brace and semicolon lies an interactive computational landscape.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: MEMORY (750 - 1500ms) */}
        {/* ========================================================= */}
        {currentScene === 2 && !prefersReducedMotion && (
          <div className="text-center space-y-4 max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-mono text-emerald-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scene 2 • Memory Architecture</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              Variables Transform into Physical Memory
            </h2>

            {/* Glowing Simulated RAM Cells */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto pt-2">
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-cyan-500/80 shadow-md glow-cyan">
                <div className="text-[10px] font-mono text-cyan-400">0x1000</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-white">int x</div>
                <div className="text-sm sm:text-lg font-black text-emerald-400 font-mono mt-1">
                  42
                </div>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-indigo-500/80 shadow-md">
                <div className="text-[10px] font-mono text-indigo-400">0x1004</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-white">int* ptr</div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono mt-1 truncate">
                  → &x (0x1000)
                </div>
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-purple-500/80 shadow-md">
                <div className="text-[10px] font-mono text-purple-400">0x1008</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-white">char arr[4]</div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono mt-1">
                  'C', '\0'
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: LOGIC & CONTROL (1500 - 2300ms) */}
        {/* ========================================================= */}
        {currentScene === 3 && !prefersReducedMotion && (
          <div className="text-center space-y-4 max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-xs font-mono text-indigo-300">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scene 3 • Logic & Control Flow</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              Execution Paths, Loops & Arrays Assemble
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-lg mx-auto pt-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Branch Decision</span>
                <span className="text-xs font-mono text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 inline-block">
                  Branch 1: y=0
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Loop Traversal</span>
                <div className="flex items-center justify-center gap-1 text-cyan-300 font-mono text-xs">
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>i++ step</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Contiguous Array</span>
                <span className="text-xs font-mono text-purple-300 font-bold">
                  [0][1][2][3]
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 4: IDENTITY (2300 - 3100ms) */}
        {/* ========================================================= */}
        {currentScene === 4 && !prefersReducedMotion && (
          <div className="text-center space-y-4 max-w-xl animate-in fade-in zoom-in-90 duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl glow-cyan mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400 mb-1">
                Scene 4 • Convergence
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-wider uppercase">
                REV<span className="text-cyan-400">PLAY</span>
              </h1>
              <div className="text-xs font-mono text-slate-400 mt-1">
                JNTUH R25 C Syllabus Gaming Platform
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 5: ENTRY (3100 - 3800ms, or Static Reduced Motion) */}
        {/* ========================================================= */}
        {(currentScene === 5 || prefersReducedMotion) && (
          <div className="text-center space-y-4 max-w-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-2xl glow-cyan mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-wider uppercase">
                REV<span className="text-cyan-400">PLAY</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-200 font-semibold mt-1">
                Think in Code. Play the Logic.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 pt-2 animate-pulse">
              <span>Entering the C Realm...</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Progress Bar: Synchronized single pass from 0% to 100% */}
      <footer className="relative z-20 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-xl mx-auto space-y-2">
          {/* Progress Bar Track */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 5-Scene Stage Markers (Synchronized with timeline) */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className={currentScene >= 1 ? 'text-cyan-400 font-bold' : ''}>1. Awakening</span>
            <span className={currentScene >= 2 ? 'text-emerald-400 font-bold' : ''}>2. Memory</span>
            <span className={currentScene >= 3 ? 'text-indigo-400 font-bold' : ''}>3. Logic</span>
            <span className={currentScene >= 4 ? 'text-purple-400 font-bold' : ''}>4. Identity</span>
            <span className={currentScene >= 5 ? 'text-cyan-300 font-bold' : ''}>5. Entry ({progressPercent}%)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
