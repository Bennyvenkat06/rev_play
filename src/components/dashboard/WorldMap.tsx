import React, { useState } from 'react';
import { SYLLABUS_UNITS } from '../../data/syllabusData';
import { GAMES_REGISTRY } from '../../data/gamesRegistry';
import { REVISION_NOTES_DATABASE } from '../../data/revisionNotesData';
import { downloadRevisionNoteAsText } from '../../utils/downloadNotes';
import { downloadRevisionNoteAsDocx, generateDocxFilename } from '../../utils/downloadDocx';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { 
  Gamepad2, 
  BookOpen, 
  Download, 
  Star, 
  CheckCircle, 
  Zap, 
  ChevronRight,
  MapPin,
  FileType
} from 'lucide-react';

interface WorldMapProps {
  progress: UserProgress;
  onPlayGame: (gameId: string) => void;
  onOpenNotes: (notesId: string) => void;
  onOpenLabArena: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  progress,
  onPlayGame,
  onOpenNotes,
  onOpenLabArena
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-1');
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, string>>({});
  const [isGeneratingDocx, setIsGeneratingDocx] = useState<Record<string, boolean>>({});

  const currentUnit = SYLLABUS_UNITS.find(u => u.id === selectedUnitId) || SYLLABUS_UNITS[0];

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
    <div className="space-y-8">
      {/* World Region Selector Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Syllabus Regions (5 Units + Lab)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Select region to explore missions</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SYLLABUS_UNITS.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            const unitCompletedCount = unit.topics.filter(t => progress.completedGames[t.gameId]).length;

            return (
              <button
                key={unit.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedUnitId(unit.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-lg glow-cyan scale-[1.02]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {unit.unitNumber === 'LAB' ? 'LAB' : `U${unit.unitNumber}`}
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

      {/* Selected Unit Region Mission Hub */}
      <div className={`p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-b ${currentUnit.bgGradient} relative overflow-hidden shadow-2xl`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentUnit.officialCourseCode}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentUnit.unitNumber === 'LAB' ? 'Practical Lab Group' : `Unit ${currentUnit.unitNumber}`}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                Region: {currentUnit.codename}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {currentUnit.title}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {currentUnit.shortDescription}
            </p>
          </div>

          {currentUnit.id === 'lab' && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLabArena();
              }}
              className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 glow-cyan flex items-center gap-2"
            >
              <span>Launch Lab Workbench</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mission Game Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {currentUnit.topics.map((topic) => {
            const gameDef = GAMES_REGISTRY[topic.gameId];
            const comp = progress.completedGames[topic.gameId];
            const isCompleted = !!comp;
            const successMsg = downloadSuccessMap[topic.notesId];
            const isDocxBusy = isGeneratingDocx[topic.notesId];

            return (
              <div
                key={topic.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-2xl group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-cyan-400">
                          {gameDef?.badge || 'Mission'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {gameDef?.difficulty || 'Apprentice'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {gameDef?.title || topic.title}
                      </h3>
                    </div>

                    {/* Stars Earned */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-800/80 px-2 py-1 rounded-xl">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= comp.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-500 text-[10px] font-mono">
                        Not Played
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {gameDef?.description || topic.description}
                  </p>

                  {/* Academic Mapping Footnote */}
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400 mb-4">
                    <span className="text-cyan-400 font-semibold">Syllabus:</span> {topic.officialJntuhRef}
                  </div>
                </div>

                {/* Mission Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Zap className="w-3.5 h-3.5" /> +{gameDef?.xpReward || 150} XP
                    </span>
                    {comp && (
                      <span className="text-cyan-400">High: {comp.highScore}/{comp.maxScore}</span>
                    )}
                  </div>

                  {successMsg && (
                    <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {/* Launch Play Button */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPlayGame(topic.gameId);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-slate-950 font-bold text-xs transition-all shadow-md glow-cyan"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>{isCompleted ? 'Replay Mission' : 'Play Game'}</span>
                    </button>

                    {/* Review Notes Button */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenNotes(topic.notesId);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-semibold text-xs transition-colors"
                      title="Read revision notes for this topic"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Read Notes</span>
                    </button>
                  </div>

                  {/* Document Download Actions: Word (.docx) & Plain-Text (.txt) */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleDownloadDocx(topic.notesId)}
                      disabled={isDocxBusy}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/70 text-indigo-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                      title="Download formatted Microsoft Word Document (.docx)"
                    >
                      <FileType className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isDocxBusy ? 'Generating...' : 'Word (.docx)'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadTxt(topic.notesId)}
                      className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                      title="Download Plain-Text format (.txt)"
                    >
                      <Download className="w-3 h-3" />
                      <span>.txt</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
