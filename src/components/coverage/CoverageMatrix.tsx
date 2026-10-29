import React, { useState } from 'react';
import { COVERAGE_MATRIX, OFFICIAL_SYLLABUS_SOURCE, LAB_PRACTICE_GROUPS } from '../../data/syllabusData';
import { soundManager } from '../../utils/sound';
import { 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  Gamepad2, 
  CheckCircle, 
  Filter,
  FileCode,
  Info
} from 'lucide-react';

interface CoverageMatrixProps {
  onPlayGame: (gameId: string) => void;
  onOpenNotes: (notesId: string) => void;
}

export const CoverageMatrix: React.FC<CoverageMatrixProps> = ({
  onPlayGame,
  onOpenNotes
}) => {
  const [filterCourse, setFilterCourse] = useState<'ALL' | 'CS103ES' | 'CS107ES'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = COVERAGE_MATRIX.filter((item) => {
    if (filterCourse !== 'ALL' && item.courseCode !== filterCourse) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.topicName.toLowerCase().includes(q) ||
        item.syllabusRef.toLowerCase().includes(q) ||
        item.gameTitle.toLowerCase().includes(q) ||
        item.notesTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Source Citation & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-cyan-950 border border-cyan-800 text-cyan-400">
                Official Source of Truth
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {OFFICIAL_SYLLABUS_SOURCE.regulation}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              JNTUH R25 Syllabus & Lab Coverage Matrix
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every interactive game in RevPlay is mathematically and pedagogically mapped to the prescribed theory units (<strong>{OFFICIAL_SYLLABUS_SOURCE.theoryCourseCode}</strong>) and laboratory experiments (<strong>{OFFICIAL_SYLLABUS_SOURCE.labCourseCode}</strong>).
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{OFFICIAL_SYLLABUS_SOURCE.localNote}</span>
            </div>
          </div>

          <a 
            href={OFFICIAL_SYLLABUS_SOURCE.officialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>View Official University PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] uppercase text-slate-400">Theory Units (CS103ES)</div>
            <div className="text-xl font-bold text-cyan-400 font-mono">5 / 5 Complete</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] uppercase text-slate-400">Lab Groups (CS107ES)</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">6 / 6 Groups Mapped</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] uppercase text-slate-400">Interactive Games</div>
            <div className="text-xl font-bold text-purple-400 font-mono">16 Playable Arenas</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] uppercase text-slate-400">Verified Revision Notes</div>
            <div className="text-xl font-bold text-amber-400 font-mono">100% Exportable (.txt)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Course:</span>
          {(['ALL', 'CS103ES', 'CS107ES'] as const).map((code) => (
            <button
              key={code}
              onClick={() => {
                soundManager.playClick();
                setFilterCourse(code);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterCourse === code
                  ? 'bg-cyan-600 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {code === 'ALL' ? 'All (Theory & Lab)' : code}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search syllabus topic, game, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Coverage Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Syllabus Ref</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Topic / Experiment Title</th>
                <th className="py-3 px-4">Associated Game</th>
                <th className="py-3 px-4">Revision Notes (.txt)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold whitespace-nowrap">
                    {item.syllabusRef}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      item.courseCode === 'CS103ES' 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {item.courseCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    <div>{item.topicName}</div>
                    {item.supplementalNotice && (
                      <span className="text-[10px] text-amber-400 block mt-0.5 font-mono">
                        {item.supplementalNotice}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPlayGame(item.gameId);
                      }}
                      className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-indigo-200 hover:underline font-medium"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{item.gameTitle}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenNotes(item.notesId);
                      }}
                      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item.notesTitle}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Lab Objectives Deep-Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          CS107ES Official Lab Practice Groups (1 to 6) Checklist
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Track official lab requirements including writing, compiling, debugging, pointer arithmetic, dynamic memory, structures, and text/binary file pipelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LAB_PRACTICE_GROUPS.map((grp) => (
            <div key={grp.groupNumber} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">GROUP {grp.groupNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Verified
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{grp.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{grp.officialObjective}</p>
              
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                {grp.experiments.map((exp) => (
                  <div key={exp.id} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span className="truncate">{exp.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenNotes(grp.experiments[0].notesId);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View Notes (.txt)
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onPlayGame('game-lab-arena');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Launch Workbench →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

