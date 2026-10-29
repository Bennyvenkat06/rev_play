import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StatsHeader } from './components/dashboard/StatsHeader';
import { WorldMap } from './components/dashboard/WorldMap';
import { CoverageMatrix } from './components/coverage/CoverageMatrix';
import { NotesLibrary } from './components/notes/NotesLibrary';
import { RevisionNotesModal } from './components/notes/RevisionNotesModal';
import { GameResultsModal } from './components/results/GameResultsModal';
import { MistakesReviewModal } from './components/dashboard/MistakesReviewModal';
import { LabPracticeArena } from './components/lab/LabPracticeArena';

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
  const [currentView, setCurrentView] = useState<'dashboard' | 'notes' | 'coverage' | 'lab'>('dashboard');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Modals state
  const [activeNote, setActiveNote] = useState<RevisionNote | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const [lastGameResult, setLastGameResult] = useState<PlayerGameResult | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false);

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

  const handleOpenNotes = (notesId: string) => {
    const note = REVISION_NOTES_DATABASE[notesId] || REVISION_NOTES_DATABASE['notes-u1-fundamentals'];
    setActiveNote(note);
    setIsNotesModalOpen(true);
  };

  const handlePlayGame = (gameId: string) => {
    soundManager.playClick();
    if (gameId === 'game-lab-arena') {
      setCurrentView('lab');
      setActiveGameId(null);
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

  const handleReturnToUnit = () => {
    setIsResultsModalOpen(false);
    setActiveGameId(null);
    setCurrentView('dashboard');
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
              className="mt-4 px-4 py-2 bg-slate-800 rounded-xl text-white text-xs"
            >
              Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans antialiased arcade-grid selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      {/* Subtle Floating Gradient Ambient Orbs (Outer Edges) */}
      <div className="fixed top-12 left-[-80px] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none floating-orb-1" />
      <div className="fixed bottom-12 right-[-80px] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none floating-orb-2" />

      {/* Top HUD Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          setActiveGameId(null);
          setCurrentView(v);
        }}
        progress={progress}
        onSoundToggle={handleSoundToggle}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {activeGameId ? (
          /* Render Currently Active Playable Game Arena */
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {renderActiveGame()}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* User Stats & XP Bar (shown in dashboard view) */}
            {currentView === 'dashboard' && (
              <StatsHeader
                progress={progress}
                onOpenMistakesReview={() => setIsMistakesModalOpen(true)}
              />
            )}

            {/* Dashboard View: World Map of Units & Missions */}
            {currentView === 'dashboard' && (
              <WorldMap
                progress={progress}
                onPlayGame={handlePlayGame}
                onOpenNotes={handleOpenNotes}
                onOpenLabArena={() => setCurrentView('lab')}
              />
            )}

            {/* CS107ES Lab Arena View */}
            {currentView === 'lab' && (
              <LabPracticeArena
                onOpenNotes={handleOpenNotes}
              />
            )}

            {/* Revision Notes Library View */}
            {currentView === 'notes' && (
              <NotesLibrary
                onOpenNoteModal={handleOpenNotes}
                onPlayGame={handlePlayGame}
              />
            )}

            {/* JNTUH R25 Coverage Matrix View */}
            {currentView === 'coverage' && (
              <CoverageMatrix
                onPlayGame={handlePlayGame}
                onOpenNotes={handleOpenNotes}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCoverage={() => {
          setActiveGameId(null);
          setCurrentView('coverage');
        }}
        onOpenNotesLibrary={() => {
          setActiveGameId(null);
          setCurrentView('notes');
        }}
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
