import React, { useState, useEffect } from 'react';
import { UserProgress } from '../../types/progress';
import { GameDefinition } from '../../types/games';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { SYLLABUS_UNITS } from '../../data/syllabusData';
import { soundManager } from '../../utils/sound';
import { 
  Gamepad2, 
  Sparkles, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Compass, 
  BookOpen, 
  FlaskConical, 
  ShieldCheck, 
  Trophy, 
  Star, 
  Zap, 
  Cpu, 
  GitBranch, 
  Code2, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Terminal, 
  FileText,
  Clock,
  Flame,
  Award,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

interface HomePageProps {
  progress: UserProgress;
  onNavigate: (view: 'home' | 'syllabus' | 'lab' | 'notes' | 'coverage') => void;
  onPlayGame: (gameId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  onNavigate,
  onPlayGame,
}) => {
  // Determine actual next or resume mission based on genuine progress
  const allGameIds = Object.keys(GAMES_REGISTRY);
  const completedCount = Object.keys(progress.completedGames).length;
  const totalStars = Object.values(progress.completedGames).reduce((acc, curr) => acc + curr.stars, 0);

  // Find next uncompleted mission in registry sequence, or resume last played
  let targetMission: GameDefinition = GAMES_REGISTRY['game-u1-predict'];
  let isResuming = false;

  if (progress.recentResults && progress.recentResults.length > 0) {
    const lastResult = progress.recentResults[0];
    // Find first uncompleted mission starting from last result
    const uncompleted = allGameIds.find(id => !progress.completedGames[id]);
    if (uncompleted && GAMES_REGISTRY[uncompleted]) {
      targetMission = GAMES_REGISTRY[uncompleted];
    } else if (GAMES_REGISTRY[lastResult.gameId]) {
      targetMission = GAMES_REGISTRY[lastResult.gameId];
      isResuming = true;
    }
  } else {
    // New learner: target mission is game-u1-predict
    targetMission = GAMES_REGISTRY['game-u1-predict'];
  }

  // Micro-Simulation preview state for Section 6 (Featured Experience)
  const [previewStep, setPreviewStep] = useState(0);
  const [previewIsPlaying, setPreviewIsPlaying] = useState(false);

  const previewSteps = [
    {
      line: 0,
      code: 'int a = 10;',
      desc: 'Variable `a` is allocated in illustrative RAM at simulated address 0x1000 with initial value 10.',
      memA: 10,
      memPtr: 'NULL',
      output: ''
    },
    {
      line: 1,
      code: 'int *ptr = &a;',
      desc: 'Pointer `ptr` is allocated at 0x1004. It stores the address of `a` (&a = 0x1000).',
      memA: 10,
      memPtr: '0x1000',
      output: ''
    },
    {
      line: 2,
      code: '*ptr += 15;',
      desc: 'Dereferencing `*ptr`: Accesses target address 0x1000 directly. `a` is updated from 10 to 25!',
      memA: 25,
      memPtr: '0x1000',
      output: ''
    },
    {
      line: 3,
      code: 'printf("a = %d", a);',
      desc: 'Standard output prints current value of `a`. stdout outputs "a = 25".',
      memA: 25,
      memPtr: '0x1000',
      output: 'a = 25'
    }
  ];

  // Auto-step preview if playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (previewIsPlaying) {
      timer = setTimeout(() => {
        if (previewStep < previewSteps.length - 1) {
          setPreviewStep(prev => prev + 1);
        } else {
          setPreviewIsPlaying(false);
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [previewIsPlaying, previewStep, previewSteps.length]);

  return (
    <div className="space-y-20 pb-16">
      {/* ================================================================= */}
      {/* SECTION 1: HERO SECTION */}
      {/* ================================================================= */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Course Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-400 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>JNTUH R25 C Syllabus Gaming Platform</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white font-display tracking-tight leading-[1.08]">
            Think in Code. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_24px_rgba(6,182,212,0.35)]">
              Play the Logic.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed px-2">
            Explore C programming through interactive challenges, animated execution, hands-on experiments and meaningful revision.
          </p>
        </div>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Primary CTA: Uses actual progress */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayGame(targetMission.id);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-950/60 active:scale-95 glow-cyan flex items-center justify-center gap-3 group"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isResuming ? 'Continue Your Journey' : completedCount === 0 ? 'Start Your Journey' : 'Continue Your Journey'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary CTA: Go to Syllabus World */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('syllabus');
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/80 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-slate-200 hover:text-white"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Explore Syllabus World</span>
          </button>
        </div>

        {/* Honest Progress Subtitle */}
        <div className="text-xs font-mono text-slate-400 flex items-center justify-center gap-2 flex-wrap">
          <span>Next mission:</span>
          <span className="font-bold text-cyan-300 underline underline-offset-4 decoration-cyan-500/50">
            {targetMission.title} ({targetMission.badge})
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400">+{targetMission.xpReward} XP</span>
        </div>

        {/* Hero Visual Banner: Code-to-Logic Assembly preview */}
        <div className="relative pt-6 max-w-2xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-bold text-white">revplay_core.c</span>
              </div>
              <span className="text-cyan-400 font-semibold hidden sm:inline">Active Execution Pipeline</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 font-mono text-xs">
              {/* Code snippet side */}
              <div className="space-y-1 text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                <div className="text-slate-500">// 1. Algorithmic Source</div>
                <div><span className="text-purple-400">int</span> x = <span className="text-amber-400">1</span>, y = <span className="text-amber-400">0</span>;</div>
                <div className="bg-cyan-950/60 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-800/60">
                  <span className="text-purple-400">if</span> (x || ++y) &#123;
                </div>
                <div className="pl-4 text-emerald-400">printf("Branch 1: y=%d", y);</div>
                <div>&#125;</div>
              </div>

              {/* Execution transformation side */}
              <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <div className="text-slate-500 text-[11px] mb-1.5">// 2. Dynamic Memory & Logic</div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">x = 1 (TRUE)</span>
                    <span className="text-cyan-400 font-bold">→</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      Short-circuit: ++y skipped
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Output:</span>
                  <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Branch 1: y=0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: HOW REVPLAY WORKS (5-Step Pedagogical Loop) */}
      {/* ================================================================= */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block">
            Pedagogical Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            How RevPlay Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            A cohesive 5-stage learning loop designed to transform abstract C syntax into crystal-clear conceptual mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Step 1: Explore */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition-all card-lift flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  01
                </span>
                <Compass className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">Explore</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tour 5 theory regions and the CS107ES practical lab forge mapped strictly to the JNTUH R25 curriculum.
              </p>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-slate-800/80">
              5 Units + Lab
            </div>
          </div>

          {/* Step 2: Play */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all card-lift flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  02
                </span>
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Play</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tackle 16 interactive challenge missions: branch routing, loop stepping, pointer indirection, and sorting races.
              </p>
            </div>
            <div className="text-[11px] font-mono text-indigo-400 pt-2 border-t border-slate-800/80">
              Active Challenges
            </div>
          </div>

          {/* Step 3: Understand */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 transition-all card-lift flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  03
                </span>
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Understand</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step through synchronized line-by-line execution traces with dynamic variable inspection and short-circuit alerts.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-slate-800/80">
              Visual State Traces
            </div>
          </div>

          {/* Step 4: Revise */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 transition-all card-lift flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  04
                </span>
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white">Revise</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Read authoritative topic notes with syntax rules, complete code examples, and standard viva voce Q&A.
              </p>
            </div>
            <div className="text-[11px] font-mono text-purple-400 pt-2 border-t border-slate-800/80">
              Curated Notes Library
            </div>
          </div>

          {/* Step 5: Master */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 transition-all card-lift flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  05
                </span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white">Master</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Export genuine Word (.docx) documents, review diagnostic mistakes, and achieve 3-star ranking on all units.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-slate-800/80">
              Word (.docx) Export
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: WHAT MAKES IT DIFFERENT */}
      {/* ================================================================= */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 block">
            Why RevPlay Beats Passive Revision
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            What Makes RevPlay Different
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Traditional textbooks describe how code works. RevPlay lets you manipulate, visualize, and test it in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Feature 1: Real-Time Execution Visualization */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Real-Time Execution Tracing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step through actual C99 programs line-by-line. Variables update with genuine state transitions, condition branches illuminate, and skipped short-circuit operations are clearly labeled.
            </p>
          </div>

          {/* Feature 2: Accurate C Specification Rules */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Accurate Language Mechanics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict compliance with standard C: logical short-circuiting in <code className="text-cyan-300">if (x || ++y)</code>, pointer byte-scaling by <code className="text-cyan-300">sizeof(T)</code>, and function stack frame lifecycle semantics.
            </p>
          </div>

          {/* Feature 3: Genuine Word (.docx) Export */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Official .docx Word Notes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate genuine Microsoft Word (.docx) files with verified headings, tables, formatted code blocks, and syllabus alignments for offline study and exam preparation.
            </p>
          </div>

          {/* Feature 4: CS107ES Practical Laboratory Arena */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">CS107ES Lab Arena</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full coverage of weekly laboratory programming tasks: quadratic roots, Armstrong numbers, matrix multiplication, string manipulations, and file copy utilities.
            </p>
          </div>

          {/* Feature 5: Diagnostic Remedial Mistakes Review */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Diagnostic Mistake Review</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every incorrect decision is automatically logged to your review queue with clear explanations, syllabus references, and instant one-click replay options.
            </p>
          </div>

          {/* Feature 6: Local-First & Zero Friction */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 transition-all card-lift space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Zero Lock-in, 100% Offline</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All progress, high scores, stars, and notes are persisted client-side in your browser. No mandatory account creation, zero tracking, instant load times.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: PROGRESS SNAPSHOT (Real User Data) */}
      {/* ================================================================= */}
      <section className="max-w-6xl mx-auto">
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-slate-800/80">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Your Learning Record
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Real-Time Progress Snapshot
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {completedCount === 0 
                  ? 'Your learning record is fresh! Complete your first challenge to earn XP and stars.'
                  : `You have completed ${completedCount} of 16 syllabus missions with ${totalStars} stars earned.`
                }
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('syllabus');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Syllabus Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 pt-5 sm:pt-6">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Level</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">{progress.level}</span>
              <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">Master</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Total XP</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{progress.totalXp}</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Experience</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Missions</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">{completedCount} / 16</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Completed</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Stars</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{totalStars} / 48</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Acquired</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Daily Streak</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{progress.streakDays}d</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Active</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 uppercase block mb-1">Review Queue</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">{progress.mistakeReviewQueue.length}</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Mistakes Logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: CONTINUE PLAYING (Recommended Mission) */}
      {/* ================================================================= */}
      <section className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              Direct Action
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {isResuming ? 'Continue Where You Left Off' : 'Recommended Next Mission'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            Curated sequence aligned to syllabus
          </span>
        </div>

        {/* Featured Mission Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {targetMission.unitId.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {targetMission.badge}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-300">
                Difficulty: {targetMission.difficulty}
              </span>
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{targetMission.estimatedMinutes} mins
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {targetMission.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {targetMission.description}
            </p>

            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Ref: {targetMission.officialTopicRef}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                onPlayGame(targetMission.id);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 glow-cyan flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Mission</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('syllabus');
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors text-center"
            >
              Browse All 16 Missions
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: FEATURED EXPERIENCE (Interactive Mini-Simulation Preview) */}
      {/* ================================================================= */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block">
            Featured Experience
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
            Interactive C Execution in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test RevPlay's interactive stepping engine right here. Step through pointers and memory indirection before launching a full mission.
          </p>
        </div>

        {/* Micro-Simulator Component */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-cyan-400 font-bold">Pointer Indirection & Modification</span>
              <span className="text-slate-600">•</span>
              <span>Step {previewStep + 1} of {previewSteps.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={previewStep === 0}
                onClick={() => {
                  soundManager.playClick();
                  setPreviewIsPlaying(false);
                  setPreviewStep(prev => Math.max(0, prev - 1));
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-slate-300 hover:text-white"
                title="Step backward"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setPreviewIsPlaying(!previewIsPlaying);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white flex items-center gap-1 font-bold"
              >
                <Play className={`w-3.5 h-3.5 ${previewIsPlaying ? 'fill-cyan-400' : ''}`} />
                <span>{previewIsPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                disabled={previewStep === previewSteps.length - 1}
                onClick={() => {
                  soundManager.playClick();
                  setPreviewIsPlaying(false);
                  setPreviewStep(prev => Math.min(previewSteps.length - 1, prev + 1));
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 disabled:opacity-30 text-slate-300 hover:text-white"
                title="Step forward"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setPreviewIsPlaying(false);
                  setPreviewStep(0);
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Stepping Stage: Code + RAM Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Source Code with Synchronized Active Line */}
            <div className="md:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 font-mono text-xs space-y-1.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-800 mb-2">
                Active Source Code (C99)
              </div>
              {previewSteps.map((s, idx) => {
                const isActive = idx === previewStep;
                return (
                  <div 
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-3 ${
                      isActive 
                        ? 'bg-cyan-950/90 border border-cyan-500 text-cyan-200 font-bold glow-cyan shadow-md' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-600 select-none w-4 text-right">{idx + 1}</span>
                    <span className="whitespace-pre">{s.code}</span>
                    {isActive && <span className="ml-auto text-[10px] text-cyan-400 font-semibold">◀ active</span>}
                  </div>
                );
              })}
            </div>

            {/* Illustrative Simulated Memory & stdout */}
            <div className="md:col-span-6 space-y-3">
              {/* Annotation Description */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  Action at Step {previewStep + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {previewSteps[previewStep].desc}
                </p>
              </div>

              {/* Memory Grid */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="uppercase font-bold text-emerald-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Illustrative RAM Memory Model
                  </span>
                  <span>32-bit Architecture</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {/* Cell a */}
                  <div className={`p-2.5 rounded-xl border text-center font-mono transition-all ${
                    previewStep === 0 || previewStep === 2
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-md glow-neon'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="text-[10px] text-slate-500">0x1000 • int a</div>
                    <div className="text-lg font-black text-white mt-1">
                      {previewSteps[previewStep].memA}
                    </div>
                  </div>

                  {/* Cell ptr */}
                  <div className={`p-2.5 rounded-xl border text-center font-mono transition-all ${
                    previewStep >= 1
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md glow-purple'
                      : 'bg-slate-950 border-slate-800 opacity-50'
                  }`}>
                    <div className="text-[10px] text-slate-500">0x1004 • int* ptr</div>
                    <div className="text-sm font-bold text-cyan-300 mt-2 truncate">
                      {previewSteps[previewStep].memPtr}
                    </div>
                  </div>
                </div>
              </div>

              {/* stdout Console */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>stdout console:</span>
                </div>
                <div className="min-h-[18px] text-emerald-400 font-bold">
                  {previewSteps[previewStep].output ? (
                    <span>{previewSteps[previewStep].output}</span>
                  ) : (
                    <span className="text-slate-600 font-normal italic">(Waiting for printf...)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7: FINAL CTA (Enter Syllabus World) */}
      {/* ================================================================= */}
      <section className="max-w-5xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-800/60 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto glow-cyan">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
              Ready to Master the Entire Syllabus?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Enter the full Syllabus World to navigate all five theory units, the CS107ES practical laboratory forge, downloadable revision notes, and exam coverage matrices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('syllabus');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 glow-cyan flex items-center justify-center gap-2"
            >
              <span>ENTER SYLLABUS WORLD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('lab');
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>Lab Workbench</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('notes');
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Notes Library</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

