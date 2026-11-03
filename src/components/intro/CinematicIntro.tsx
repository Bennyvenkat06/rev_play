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

const STANDARD_DURATION = 4200; // ms: Master timeline authoritative duration
const REDUCED_MOTION_DURATION = 1200; // ms: Fast accessible static presentation

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const totalDuration = prefersReducedMotion ? REDUCED_MOTION_DURATION : STANDARD_DURATION;

  const [currentScene, setCurrentScene] = useState<1 | 2 | 3 | 4 | 5>(() => prefersReducedMotion ? 5 : 1);
  const [progress, setProgress] = useState<number>(0); // Strictly 0 at mount
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const startTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isFinishedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Prevent background scrolling while intro overlay is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Single authoritative master timeline driven by requestAnimationFrame & performance.now()
  useEffect(() => {
    if (isFinishedRef.current) return;

    const finishIntro = () => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setProgress(1);
      setIsFadingOut(true);
      soundManager.playClick();
      setTimeout(() => {
        onCompleteRef.current();
      }, 300);
    };

    // Fail-safe fallback timeout: never leave the user stuck on black
    const fallbackTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        finishIntro();
      }
    }, totalDuration + 1000);

    const tick = (now: number) => {
      if (isFinishedRef.current) return;

      // Set the intro's start timestamp once when playback begins
      if (startTimestampRef.current === null) {
        startTimestampRef.current = now;
      }

      const elapsed = now - startTimestampRef.current;
      const clampedProgress = Math.min(1, Math.max(0, elapsed / totalDuration));
      setProgress(clampedProgress);

      if (prefersReducedMotion) {
        // Fast static presentation of RevPlay Identity
        setCurrentScene(5);
      } else {
        // Fixed master scene boundaries:
        // Awakening:     0 ms –  750 ms
        // Memory:      750 ms – 1550 ms
        // Logic:      1550 ms – 2450 ms
        // Identity:   2450 ms – 3250 ms
        // Final reveal: 3250 ms – 4200 ms
        if (elapsed < 750) {
          setCurrentScene(1);
        } else if (elapsed < 1550) {
          setCurrentScene(2);
        } else if (elapsed < 2450) {
          setCurrentScene(3);
        } else if (elapsed < 3250) {
          setCurrentScene(4);
        } else {
          setCurrentScene(5);
        }
      }

      if (elapsed >= totalDuration) {
        clearTimeout(fallbackTimer);
        finishIntro();
      } else {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      clearTimeout(fallbackTimer);
    };
  }, [prefersReducedMotion, totalDuration]);

  const progressPercent = Math.min(100, Math.round(progress * 100));

  // Ambient floating C runes for Scene 1 (Awakening)
  const codeRunes = [
    { char: 'int main(void)', x: '8%', y: '22%' },
    { char: '{ ... }', x: '84%', y: '18%' },
    { char: 'char *ptr;', x: '80%', y: '68%' },
    { char: '&memory', x: '10%', y: '72%' },
    { char: '->', x: '50%', y: '14%' },
    { char: '0x7FFE_4A20', x: '10%', y: '46%' },
    { char: 'return 0;', x: '82%', y: '46%' },
  ];

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#04060a] text-slate-100 flex flex-col justify-between overflow-hidden select-none transition-all duration-300 revplay-cinematic-intro intro-active-scene-${currentScene} ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="RevPlay Cinematic Introduction"
      data-scene={currentScene}
    >
      {/* Background Animated Tech Grid & Deep Navy Radial Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="intro-grid-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="intro-radial-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#4f46e5" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#04060a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#intro-grid-pattern)" />
          <rect width="100%" height="100%" fill="url(#intro-radial-glow)" />
        </svg>

        {/* Ambient background particles */}
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Top Header: Responsive branding */}
      <header className="relative z-20 px-3 sm:px-8 py-3 sm:py-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 shadow-md glow-cyan">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 block truncate">
              Cinematic Intro
            </span>
            <span className="text-[11px] sm:text-sm font-black tracking-wider text-white font-display uppercase truncate max-w-[170px] sm:max-w-none block">
              THE C REALM — CODE BECOMES A WORLD
            </span>
          </div>
        </div>

        <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 shrink-0">
          Entering Home...
        </div>
      </header>

      {/* Center Stage: Sequential, finite playback of all 5 scenes */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-6">
        {/* ========================================================= */}
        {/* SCENE 01: AWAKENING (0.0s – 0.75s)                         */}
        {/* ========================================================= */}
        {currentScene === 1 && (
          <div className="revplay-intro-scene revplay-intro-scene-1 revplay-intro-scene-active text-center space-y-6 max-w-2xl relative w-full px-4">
            {/* Ambient floating C runes */}
            {codeRunes.map((rune, idx) => (
              <span
                key={idx}
                className="absolute font-mono text-[11px] sm:text-xs font-bold text-cyan-400/50 select-none pointer-events-none drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] hidden sm:inline intro-rune"
                style={{ 
                  left: rune.x, 
                  top: rune.y,
                  animationDelay: `${idx * 0.25}s`
                }}
              >
                {rune.char}
              </span>
            ))}

            {/* Top row fragments */}
            <div className="flex items-center justify-between w-full max-w-lg mx-auto">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/50 shadow-md glow-cyan intro-fragment-left">
                int main(void)
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/50 shadow-md glow-neon intro-fragment-right">
                int x = 10;
              </span>
            </div>

            {/* Central Awakening Identity */}
            <div className="space-y-3 py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Scene 01 • Awakening</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-tight">
                The C Realm Awakes.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
                Syntax fragments assemble into an interactive computational world.
              </p>
            </div>

            {/* Bottom row fragments */}
            <div className="flex items-center justify-between w-full max-w-lg mx-auto">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-indigo-300 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-indigo-500/50 shadow-md glow-purple intro-fragment-left">
                char *ptr;
              </span>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-cyan-300 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/50 shadow-md glow-cyan intro-fragment-right">
                &x
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 02: MEMORY COMES ALIVE (0.75s – 1.55s)               */}
        {/* ========================================================= */}
        {currentScene === 2 && (
          <div className="revplay-intro-scene revplay-intro-scene-2 revplay-intro-scene-active intro-scene-fade text-center space-y-4 max-w-2xl w-full px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-mono text-emerald-300 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scene 02 • Memory Comes Alive</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              Simulated Educational Memory Model
            </h2>

            {/* Glowing Memory Cells + Pointer Connection Beam */}
            <div className="relative max-w-xl mx-auto pt-4 pb-2">
              {/* Pointer Connection SVG Beam from ptr (right) back to target x (left) */}
              <div className="absolute -top-3 left-0 right-0 h-10 pointer-events-none z-10">
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="beamGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  {/* Glowing arc from ptr (x=83) to target x (x=17) */}
                  <path
                    d="M 83 22 Q 50 2, 17 22"
                    fill="none"
                    stroke="url(#beamGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="pointer-beam-svg"
                  />
                  {/* Arrowhead at target x */}
                  <polygon points="17,22 22,18 22,26" fill="#10b981" className="pointer-beam-arrow" />
                </svg>
              </div>

              {/* Memory Cells Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 relative z-0">
                {/* Cell x: 10 */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/95 border-2 border-emerald-500 shadow-lg glow-neon memory-cell-1 relative">
                  <span className="text-[10px] font-mono text-emerald-400 block font-semibold mb-1">[ x : 10 ]</span>
                  <span className="text-xs font-mono text-slate-400 block">int x</span>
                  <span className="text-base sm:text-2xl font-black text-emerald-400 font-mono block mt-1">10</span>
                  <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-[9px] text-emerald-300 font-mono font-bold shadow">
                    TARGET
                  </span>
                </div>

                {/* Cell y: 20 */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-md memory-cell-2">
                  <span className="text-[10px] font-mono text-slate-400 block font-semibold mb-1">[ y : 20 ]</span>
                  <span className="text-xs font-mono text-slate-400 block">int y</span>
                  <span className="text-base sm:text-2xl font-black text-white font-mono block mt-1">20</span>
                </div>

                {/* Cell ptr: &x */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/95 border-2 border-indigo-500 shadow-lg glow-purple memory-cell-3 relative">
                  <span className="text-[10px] font-mono text-indigo-400 block font-semibold mb-1">[ ptr : &x ]</span>
                  <span className="text-xs font-mono text-slate-400 block">char *ptr</span>
                  <span className="text-xs sm:text-sm font-black text-indigo-300 font-mono block mt-1 truncate">
                    → &x
                  </span>
                  <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-400 text-[9px] text-indigo-300 font-mono font-bold shadow">
                    POINTS
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 max-w-md mx-auto">
              Simulated educational memory model — illustrative references, not hardware addresses.
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 03: LOGIC TAKES SHAPE (1.55s – 2.45s)                */}
        {/* ========================================================= */}
        {currentScene === 3 && (
          <div className="revplay-intro-scene revplay-intro-scene-3 revplay-intro-scene-active intro-scene-fade text-center space-y-4 max-w-2xl w-full px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-xs font-mono text-indigo-300 shadow-sm">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scene 03 • Logic Takes Shape</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white font-display">
              Decision Branches, Loop Trails & Arrays
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
              {/* 1. Decision Branch with glowing SVG circuit */}
              <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Decision Branch</span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold block mb-1">if (x || ++y)</span>
                </div>

                <div className="w-full h-10 my-1 flex items-center justify-center">
                  <svg className="w-36 h-10 overflow-visible" viewBox="0 0 140 40">
                    <path d="M 10 20 L 40 20" stroke="#06b6d4" strokeWidth="2" />
                    <path d="M 40 20 Q 60 6, 125 6" fill="none" stroke="#10b981" strokeWidth="2.5" className="branch-true-line" />
                    <path d="M 40 20 Q 60 34, 125 34" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[10px] font-mono font-bold">
                    ✓ True evaluated
                  </div>
                  <div className="px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-500 text-[10px] font-mono">
                    ✗ False skipped
                  </div>
                </div>
              </div>

              {/* 2. Loop Trail (Visible single 360 pass) */}
              <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 text-center flex flex-col items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Loop Traversal</span>
                <div className="relative w-14 h-14 flex items-center justify-center my-1">
                  <svg className="w-14 h-14 -rotate-90 overflow-visible" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(30, 41, 59, 0.8)" strokeWidth="3.5" />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="loop-svg-circle"
                    />
                  </svg>
                  <RotateCw className="w-4 h-4 text-cyan-400 absolute" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-semibold">1 single iteration</span>
              </div>

              {/* 3. Contiguous Array Assembly */}
              <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 text-center flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Contiguous Array</span>
                  <span className="text-[11px] font-mono text-purple-300 font-bold block mb-1.5">arr[4]</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 font-mono text-xs my-1">
                  <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-600 text-purple-300 font-bold array-cell-0 shadow">[0]</span>
                  <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-600 text-purple-300 font-bold array-cell-1 shadow">[1]</span>
                  <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-600 text-purple-300 font-bold array-cell-2 shadow">[2]</span>
                  <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-600 text-purple-300 font-bold array-cell-3 shadow">[3]</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">Aligned Memory</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 04: REVPLAY IDENTITY (2.45s – 3.25s)                 */}
        {/* ========================================================= */}
        {currentScene === 4 && (
          <div className="revplay-intro-scene revplay-intro-scene-4 revplay-intro-scene-active intro-scene-fade text-center space-y-5 max-w-xl w-full px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl glow-cyan mx-auto flex items-center justify-center emblem-converge">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-mono text-purple-300 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Scene 04 • Convergence</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-wider uppercase wordmark-wipe drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                REV<span className="text-cyan-400">PLAY</span>
              </h1>

              <div className="text-xs sm:text-sm font-mono text-slate-400 tracking-wide">
                JNTUH R25 C Syllabus Gaming Platform
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 05: FINAL REVEAL AND AUTOMATIC ENTRY (3.25s – 4.20s) */}
        {/* ========================================================= */}
        {currentScene === 5 && (
          <div className="revplay-intro-scene revplay-intro-scene-5 revplay-intro-scene-active intro-scene-fade text-center space-y-5 max-w-xl relative overflow-hidden w-full px-4">
            {/* Finishing light sweep pass */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none intro-light-sweep" />

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 shadow-2xl glow-cyan mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scene 05 • Final Reveal</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-wider uppercase drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                REV<span className="text-cyan-400">PLAY</span>
              </h1>

              <p className="text-base sm:text-lg text-cyan-300 font-extrabold uppercase tracking-wider font-display text-glow-cyan">
                THINK IN CODE. PLAY THE LOGIC.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 pt-3 animate-pulse">
              <span>Entering the C Realm...</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Progress Bar: Synchronized single pass from 0% to 100% */}
      <footer className="relative z-20 px-3 sm:px-8 py-3 sm:py-6">
        <div className="max-w-xl mx-auto space-y-2">
          {/* Progress Bar Track */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full"
              style={{ 
                width: `${(progress * 100).toFixed(2)}%`,
                transition: 'none'
              }}
            />
          </div>

          {/* 5-Scene Stage Markers (Synchronized with master timeline) */}
          <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-slate-500">
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
