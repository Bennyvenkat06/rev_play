import React, { useState, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import { Navbar, NavViewMode, LegacyNavViewMode } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { CinematicIntro } from './components/intro/CinematicIntro';
import { TheorySection, TheoryMode } from './components/theory/TheorySection';
import { LabSection, LabMode } from './components/lab/LabSection';
import { ProgressSection } from './components/dashboard/ProgressSection';
import { NotesLibrary } from './components/notes/NotesLibrary';
import { RevisionNotesModal } from './components/notes/RevisionNotesModal';
import { GameResultsModal } from './components/results/GameResultsModal';
import { MistakesReviewModal } from './components/dashboard/MistakesReviewModal';

// Games
import { PredictTheOutput } from './games/unit1/PredictTheOutput';
import { BranchRunner } from './games/unit1/BranchRunner';
import { LoopReactor } from './games/unit1/LoopReactor';
import { FlowchartBuilder } from './games/unit1/FlowchartBuilder';

import { PointerLab } from './games/unit2/PointerLab';
import { CallStackChallenge } from './games/unit2/CallStackChallenge';
import { FunctionPipeline } from './games/unit2/FunctionPipeline';

import { ArrayForge } from './games/unit3/ArrayForge';
import { MatrixMission } from './games/unit3/MatrixMission';
import { StringPuzzleLab } from './games/unit3/StringPuzzleLab';

import { RecursionMaze } from './games/unit4/RecursionMaze';
import { StructureBuilder } from './games/unit4/StructureBuilder';
import { MemoryLayoutChallenge } from './games/unit4/MemoryLayoutChallenge';

import { SortingRace } from './games/unit5/SortingRace';
import { BinarySearchArena } from './games/unit5/BinarySearchArena';
import { FileDetective } from './games/unit5/FileDetective';

// Data & Utils
import { REVISION_NOTES_DATABASE } from './data/revisionNotesData';
import { loadUserProgress, recordGameCompletion, saveUserProgress } from './utils/storage';
import { soundManager } from './utils/sound';
import { UserProgress } from './types/progress';
import { PlayerGameResult } from './types/games';
import { RevisionNote } from './types/notes';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [currentView, setCurrentView] = useState<NavViewMode>('home');
  const [theoryMode, setTheoryMode] = useState<TheoryMode>('practice');
  const [labMode, setLabMode] = useState<LabMode>('practice');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Cinematic intro overlay on first visit/browser refresh
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Modals state
  const [activeNote, setActiveNote] = useState<RevisionNote | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const [lastGameResult, setLastGameResult] = useState<PlayerGameResult | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false);

  // Parse URL hash for direct addressability:
  // #/theory/practice, #/theory/challenge, #/laboratory/practice, #/laboratory/challenge, etc.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const parts = hash.split('/');
      const section = parts[0];
      const sub = parts[1];

      if (section === 'theory') {
        setCurrentView('theory');
        if (sub === 'challenge' || sub === 'practice') {
          setTheoryMode(sub);
        }
      } else if (section === 'laboratory' || section === 'lab') {
        setCurrentView('laboratory');
        if (sub === 'challenge' || sub === 'practice') {
          setLabMode(sub);
        }
      } else if (section === 'notes') {
        setCurrentView('notes');
      } else if (section === 'progress' || section === 'coverage') {
        setCurrentView('progress');
      } else if (section === 'home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when view or mode changes
  const updateUrlHash = useCallback((view: NavViewMode, tMode?: TheoryMode, lMode?: LabMode) => {
    try {
      if (view === 'theory') {
        window.location.hash = `#/theory/${tMode || theoryMode}`;
      } else if (view === 'laboratory') {
        window.location.hash = `#/laboratory/${lMode || labMode}`;
      } else {
        window.location.hash = `#/${view}`;
      }
    } catch (e) {
      // Ignored in non-browser environments
    }
  }, [theoryMode, labMode]);

  // Lenis smooth scroll initialization (respecting reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Keep sound manager in sync with user preference
  useEffect(() => {
    soundManager.enabled = progress.soundEnabled;
  }, [progress.soundEnabled]);

  const handleSoundToggle = () => {
    const updated = !progress.soundEnabled;
    soundManager.enabled = updated;
    const newProgress = { ...progress, soundEnabled: updated };
    setProgress(newProgress);
    saveUserProgress(newProgress);
    if (updated) soundManager.playClick();
  };

  const handleNavigate = (view: NavViewMode | LegacyNavViewMode, subMode?: 'practice' | 'challenge') => {
    setActiveGameId(null);
    let targetView: NavViewMode = 'home';

    if (view === 'theory' || view === 'syllabus') {
      targetView = 'theory';
      const m = (subMode as TheoryMode) || theoryMode;
      setTheoryMode(m);
      updateUrlHash('theory', m, labMode);
    } else if (view === 'laboratory' || view === 'lab') {
      targetView = 'laboratory';
      const m = (subMode as LabMode) || labMode;
      setLabMode(m);
      updateUrlHash('laboratory', theoryMode, m);
    } else if (view === 'progress' || view === 'coverage') {
      targetView = 'progress';
      updateUrlHash('progress');
    } else if (view === 'notes') {
      targetView = 'notes';
      updateUrlHash('notes');
    } else {
      targetView = 'home';
      updateUrlHash('home');
    }

    setCurrentView(targetView);
  };

  const handleOpenNotes = (notesId: string) => {
    const note = REVISION_NOTES_DATABASE[notesId] || REVISION_NOTES_DATABASE['notes-u1-fundamentals'];
    setActiveNote(note);
    setIsNotesModalOpen(true);
  };

  const handlePlayGame = (gameId: string) => {
    soundManager.playClick();
    if (gameId === 'game-lab-arena') {
      setCurrentView('laboratory');
      setLabMode('practice');
      setActiveGameId(null);
      updateUrlHash('laboratory', theoryMode, 'practice');
    } else {
      setActiveGameId(gameId);
    }
  };

  const handleGameComplete = (result: PlayerGameResult) => {
    const updatedProgress = recordGameCompletion(result);
    setProgress(updatedProgress);
    setLastGameResult(result);
    setIsResultsModalOpen(true);
  };

  const handleReplayActiveGame = () => {
    setIsResultsModalOpen(false);
    if (lastGameResult) {
      const gId = lastGameResult.gameId;
      setActiveGameId(null);
      setTimeout(() => setActiveGameId(gId), 50);
    }
  };

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleReturnToUnit = () => {
    setIsResultsModalOpen(false);
    setActiveGameId(null);
    setCurrentView('theory');
    setTheoryMode('practice');
    updateUrlHash('theory', 'practice', labMode);
  };

  const renderActiveGame = () => {
    if (!activeGameId) return null;

    const commonProps = {
      onComplete: handleGameComplete,
      onExit: () => {
        soundManager.playClick();
        setActiveGameId(null);
      },
      onOpenNotes: handleOpenNotes
    };

    switch (activeGameId) {
      // Unit I
      case 'game-u1-predict':
        return <PredictTheOutput {...commonProps} />;
      case 'game-u1-branch':
        return <BranchRunner {...commonProps} />;
      case 'game-u1-loop':
        return <LoopReactor {...commonProps} />;
      case 'game-u1-flowchart':
        return <FlowchartBuilder {...commonProps} />;

      // Unit II
      case 'game-u2-pointer-lab':
        return <PointerLab {...commonProps} />;
      case 'game-u2-callstack':
        return <CallStackChallenge {...commonProps} />;
      case 'game-u2-pipeline':
        return <FunctionPipeline {...commonProps} />;

      // Unit III
      case 'game-u3-array-forge':
        return <ArrayForge {...commonProps} />;
      case 'game-u3-matrix':
        return <MatrixMission {...commonProps} />;
      case 'game-u3-string-lab':
        return <StringPuzzleLab {...commonProps} />;

      // Unit IV
      case 'game-u4-recursion-maze':
        return <RecursionMaze {...commonProps} />;
      case 'game-u4-struct-builder':
        return <StructureBuilder {...commonProps} />;
      case 'game-u4-memory-layout':
        return <MemoryLayoutChallenge {...commonProps} />;

      // Unit V
      case 'game-u5-sort-race':
        return <SortingRace {...commonProps} />;
      case 'game-u5-binary-search':
        return <BinarySearchArena {...commonProps} />;
      case 'game-u5-file-detective':
        return <FileDetective {...commonProps} />;

      default:
        return (
          <div className="text-center py-20 text-slate-400">
            <p>Game "{activeGameId}" is loading...</p>
            <button 
              onClick={() => setActiveGameId(null)} 
              className="mt-4 px-4 py-2 bg-slate-800 rounded-xl text-white text-xs hover:bg-slate-700"
            >
              Return to Theory
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans antialiased arcade-grid selection:bg-cyan-500 selection:text-black relative overflow-x-clip">
      {/* First-Visit Cinematic Intro Overlay */}
      {showIntro && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}

      {/* Subtle Floating Gradient Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-12 left-0 sm:-left-20 w-60 sm:w-96 h-60 sm:h-96 bg-cyan-600/10 rounded-full blur-3xl floating-orb-1" />
        <div className="absolute bottom-12 right-0 sm:-right-20 w-60 sm:w-96 h-60 sm:h-96 bg-indigo-600/10 rounded-full blur-3xl floating-orb-2" />
      </div>

      {/* Top HUD Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => handleNavigate(v)}
        progress={progress}
        onSoundToggle={handleSoundToggle}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {activeGameId ? (
          /* Render Active Interactive Mission Arena */
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {renderActiveGame()}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 1. Home View */}
            {currentView === 'home' && (
              <HomePage
                progress={progress}
                onNavigate={(v, sub) => handleNavigate(v, sub)}
                onPlayGame={handlePlayGame}
              />
            )}

            {/* 2. Theory (CS103ES): Practice & Challenge Modes */}
            {currentView === 'theory' && (
              <TheorySection
                initialMode={theoryMode}
                onModeChange={(m) => {
                  setTheoryMode(m);
                  updateUrlHash('theory', m, labMode);
                }}
                progress={progress}
                onPlayGame={handlePlayGame}
                onOpenNotes={handleOpenNotes}
              />
            )}

            {/* 3. Laboratory (CS107ES): Practice & Challenge Modes */}
            {currentView === 'laboratory' && (
              <LabSection
                initialMode={labMode}
                onModeChange={(m) => {
                  setLabMode(m);
                  updateUrlHash('laboratory', theoryMode, m);
                }}
                onOpenNotes={handleOpenNotes}
              />
            )}

            {/* 4. Revision Library View (22 detailed notes with DOCX & TXT download) */}
            {currentView === 'notes' && (
              <NotesLibrary
                onOpenNoteModal={handleOpenNotes}
                onPlayGame={handlePlayGame}
              />
            )}

            {/* 5. Progress & Coverage Matrix View */}
            {currentView === 'progress' && (
              <ProgressSection
                progress={progress}
                onOpenMistakesReview={() => setIsMistakesModalOpen(true)}
                onPlayGame={handlePlayGame}
                onOpenNotes={handleOpenNotes}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(v) => handleNavigate(v)}
      />

      {/* Revision Notes Modal with Working Word (.docx) & Plain-Text (.txt) Download */}
      <RevisionNotesModal
        note={activeNote}
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onPlayGame={handlePlayGame}
      />

      {/* Game Results Screen Modal */}
      <GameResultsModal
        result={lastGameResult}
        isOpen={isResultsModalOpen}
        onReplay={handleReplayActiveGame}
        onReturnToUnit={handleReturnToUnit}
        onOpenNotes={(notesId) => {
          setIsResultsModalOpen(false);
          handleOpenNotes(notesId);
        }}
      />

      {/* Mistakes Remedial Review Modal */}
      <MistakesReviewModal
        progress={progress}
        isOpen={isMistakesModalOpen}
        onClose={() => setIsMistakesModalOpen(false)}
        onReplayGame={handlePlayGame}
        onOpenNotes={handleOpenNotes}
      />
    </div>
  );
};

export default App;
