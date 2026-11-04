import React, { useState } from 'react';
import { SYLLABUS_UNITS } from '../../data/syllabusData';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { REVISION_NOTES_DATABASE } from '../../data/revisionNotesData';
import { downloadRevisionNoteAsDocx } from '../../utils/downloadDocx';
import { downloadRevisionNoteAsText } from '../../utils/downloadNotes';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { TheoryChallengeArena } from './TheoryChallengeArena';
import {
  Compass,
  Zap,
  BookOpen,
  Download,
  Star,
  CheckCircle2,
  Play,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  ChevronRight,
  Lightbulb,
  FileText,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export type TheoryMode = 'practice' | 'challenge';

interface TheorySectionProps {
  initialMode?: TheoryMode;
  onModeChange?: (mode: TheoryMode) => void;
  progress: UserProgress;
  onPlayGame: (gameId: string) => void;
  onOpenNotes: (notesId: string) => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  initialMode = 'practice',
  onModeChange,
  progress,
  onPlayGame,
  onOpenNotes
}) => {
  const [mode, setMode] = useState<TheoryMode>(initialMode);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-1');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, string>>({});
  const [isGeneratingDocx, setIsGeneratingDocx] = useState<Record<string, boolean>>({});

  // Theory units: strictly Units 1 to 5 (CS103ES)
  const theoryUnits = SYLLABUS_UNITS.filter(u => u.id !== 'lab');
  const currentUnit = theoryUnits.find(u => u.id === selectedUnitId) || theoryUnits[0];

  const handleModeSwitch = (newMode: TheoryMode) => {
    soundManager.playClick();
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  const handleDownloadDocx = async (notesId: string) => {
    soundManager.playClick();
    const note = REVISION_NOTES_DATABASE[notesId];
    if (note) {
      setIsGeneratingDocx(prev => ({ ...prev, [notesId]: true }));
      const ok = await downloadRevisionNoteAsDocx(note);
      setIsGeneratingDocx(prev => ({ ...prev, [notesId]: false }));
      if (ok) {
        setDownloadSuccessMap(prev => ({ ...prev, [notesId]: 'Word (.docx) saved' }));
        setTimeout(() => {
          setDownloadSuccessMap(prev => {
            const copy = { ...prev };
            delete copy[notesId];
            return copy;
          });
        }, 3000);
      }
    }
  };

  const handleDownloadTxt = (notesId: string) => {
    soundManager.playClick();
    const note = REVISION_NOTES_DATABASE[notesId];
    if (note) {
      const ok = downloadRevisionNoteAsText(note);
      if (ok) {
        setDownloadSuccessMap(prev => ({ ...prev, [notesId]: 'Text (.txt) saved' }));
        setTimeout(() => {
          setDownloadSuccessMap(prev => {
            const copy = { ...prev };
            delete copy[notesId];
            return copy;
          });
        }, 3000);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Academic Section Header with Integrated Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                JNTUH R25 CS103ES
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Programming for Problem Solving (Theory)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              Theory Learning Platform
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Master the official 5-unit theoretical foundations through interactive visual demonstrations, guided lessons, and conceptual diagnostic assessments.
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
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {mode === 'practice'
                ? 'Active Mode: Guided visual learning, step-by-step concept explorations, and worked solutions.'
                : 'Active Mode: Independent conceptual assessments, code tracing, error hunting, and scoring.'}
            </span>
          </div>
          <span className="text-slate-500">5 Theory Units • 16 Interactive Modules</span>
        </div>
      </div>

      {/* RENDER MODE EXPERIENCE */}
      {mode === 'challenge' ? (
        /* 3B: THEORY CHALLENGE EXPERIENCE */
        <TheoryChallengeArena
          onOpenNotes={onOpenNotes}
          onRecordScore={() => {}}
        />
      ) : (
        /* 3A: THEORY PRACTICE EXPERIENCE */
        <div className="space-y-8">
          {/* Five-Unit Theory Navigation Pills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 5-Unit Curriculum Navigation
              </h2>
              <span className="text-xs font-mono text-slate-500">
                Click a unit to navigate concepts
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {theoryUnits.map((unit) => {
                const isSelected = unit.id === selectedUnitId;
                const unitCompletedCount = unit.topics.filter(t => progress.completedGames[t.gameId]).length;

                return (
                  <button
                    key={unit.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedUnitId(unit.id);
                      setSelectedTopicId(null);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-xl glow-cyan scale-[1.02]'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}>
                        UNIT {unit.unitNumber}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {unitCompletedCount}/{unit.topics.length}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {unit.codename}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Unit Mission & Concept Hub */}
          <div className={`p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-b ${currentUnit.bgGradient} relative overflow-hidden shadow-2xl`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {currentUnit.officialCourseCode}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Unit {currentUnit.unitNumber} Foundation
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Region: {currentUnit.codename}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white font-display">
                  {currentUnit.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {currentUnit.shortDescription}
                </p>
              </div>
            </div>

            {/* Topics & Concept Cards Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentUnit.topics.map((topic) => {
                const gameDef = GAMES_REGISTRY[topic.gameId];
                const comp = progress.completedGames[topic.gameId];
                const isCompleted = !!comp;
                const successMsg = downloadSuccessMap[topic.notesId];
                const isDocxBusy = isGeneratingDocx[topic.notesId];

                return (
                  <div
                    key={topic.id}
                    className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all hover:shadow-2xl space-y-4 group"
                  >
                    <div>
                      {/* Topic Header & Badges */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400">
                              {gameDef?.badge || 'Concept'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {gameDef?.difficulty || 'Apprentice'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {topic.title}
                          </h3>
                        </div>

                        {/* Stars */}
                        {isCompleted ? (
                          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/80 px-2 py-1 rounded-xl">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (comp?.stars || 0)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Topic Description & Syllabus Citation */}
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                        {topic.description}
                      </p>

                      <div className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 p-2 rounded-lg border border-cyan-900/60 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                        <span>{topic.officialJntuhRef}</span>
                      </div>
                    </div>

                    {/* Actions: Launch Interactive Visual Exploration / Notes */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Play / Explore Button */}
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onPlayGame(topic.gameId);
                          }}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 glow-cyan flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                          <span>{isCompleted ? 'Replay Simulation' : 'Launch Simulation'}</span>
                        </button>

                        {/* Open Notes */}
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onOpenNotes(topic.notesId);
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                          title="Read in-depth revision notes"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Notes</span>
                        </button>
                      </div>

                      {/* Download Buttons (.docx and .txt) */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                        <span>Offline Study Notes:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadDocx(topic.notesId)}
                            disabled={isDocxBusy}
                            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                            title="Download verified Microsoft Word (.docx)"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>{isDocxBusy ? 'Exporting...' : 'Word (.docx)'}</span>
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => handleDownloadTxt(topic.notesId)}
                            className="hover:text-slate-300 transition-colors flex items-center gap-1"
                            title="Download Plain-Text (.txt)"
                          >
                            <Download className="w-3 h-3" />
                            <span>Text (.txt)</span>
                          </button>
                        </div>
                      </div>

                      {successMsg && (
                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 p-1.5 rounded text-center border border-emerald-800/60 animate-in fade-in">
                          ✓ {successMsg}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

