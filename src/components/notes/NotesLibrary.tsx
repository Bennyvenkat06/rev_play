import React, { useState } from 'react';
import { REVISION_NOTES_DATABASE } from '../../data/revisionNotesData';
import { downloadRevisionNoteAsText } from '../../utils/downloadNotes';
import { downloadRevisionNoteAsDocx, generateDocxFilename } from '../../utils/downloadDocx';
import { soundManager } from '../../utils/sound';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  CheckCircle, 
  Zap,
  Filter,
  FileType
} from 'lucide-react';

interface NotesLibraryProps {
  onOpenNoteModal: (notesId: string) => void;
  onPlayGame: (gameId: string) => void;
}

export const NotesLibrary: React.FC<NotesLibraryProps> = ({
  onOpenNoteModal,
  onPlayGame
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, string>>({});
  const [loadingDocxMap, setLoadingDocxMap] = useState<Record<string, boolean>>({});

  const allNotes = Object.values(REVISION_NOTES_DATABASE);

  const filteredNotes = allNotes.filter((note) => {
    if (selectedUnit !== 'all' && note.unitId !== selectedUnit) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.subtitle.toLowerCase().includes(q) ||
        note.objective.toLowerCase().includes(q) ||
        note.unitName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadDocx = async (noteId: string) => {
    soundManager.playClick();
    const note = REVISION_NOTES_DATABASE[noteId];
    if (note) {
      setLoadingDocxMap(prev => ({ ...prev, [noteId]: true }));
      const ok = await downloadRevisionNoteAsDocx(note);
      setLoadingDocxMap(prev => ({ ...prev, [noteId]: false }));
      if (ok) {
        setDownloadSuccessMap(prev => ({ ...prev, [noteId]: 'Word (.docx) saved!' }));
        setTimeout(() => {
          setDownloadSuccessMap(prev => {
            const copy = { ...prev };
            delete copy[noteId];
            return copy;
          });
        }, 3000);
      }
    }
  };

  const handleDownloadTxt = (noteId: string) => {
    soundManager.playClick();
    const note = REVISION_NOTES_DATABASE[noteId];
    if (note) {
      const ok = downloadRevisionNoteAsText(note);
      if (ok) {
        setDownloadSuccessMap(prev => ({ ...prev, [noteId]: 'Text (.txt) saved!' }));
        setTimeout(() => {
          setDownloadSuccessMap(prev => {
            const copy = { ...prev };
            delete copy[noteId];
            return copy;
          });
        }, 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-950 border border-indigo-800 text-indigo-300">
                Authoritative Notes & DOCX Exporter
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Microsoft Word (.docx) & Plain-Text (.txt) Supported
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Syllabus Revision Notes Library
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              High-yield, syllabus-grounded C programming revision summaries with correct code snippets, step-by-step traces, common pitfall analysis, and one-click genuine Word (.docx) export.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black font-mono text-cyan-400">
              {allNotes.length}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Authoritative Documents</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {[
              { id: 'all', label: 'All Units' },
              { id: 'unit-1', label: 'Unit I (Loops & Decisions)' },
              { id: 'unit-2', label: 'Unit II (Pointers & Functions)' },
              { id: 'unit-3', label: 'Unit III (Arrays & Strings)' },
              { id: 'unit-4', label: 'Unit IV (Recursion & Structs)' },
              { id: 'unit-5', label: 'Unit V (Files & Sorting)' },
              { id: 'lab', label: 'Lab (CS107ES)' },
            ].map((unit) => (
              <button
                key={unit.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedUnit(unit.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedUnit === unit.id
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => {
          const successMsg = downloadSuccessMap[note.id];
          const isLoadingDocx = loadingDocxMap[note.id];

          return (
            <div 
              key={note.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400">
                    {note.courseCode}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]">
                    {note.unitName.split('—')[0].trim()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mb-1.5 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {note.objective}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Associated Game: <strong>{note.associatedGameTitle}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Includes Worked Traces & Pitfalls</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {successMsg && (
                  <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenNoteModal(note.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors border border-slate-700"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Notes</span>
                  </button>

                  {/* Word .docx Export Button */}
                  <button
                    onClick={() => handleDownloadDocx(note.id)}
                    disabled={isLoadingDocx}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-950/50"
                    title="Export as Microsoft Word (.docx)"
                  >
                    <FileType className="w-3.5 h-3.5" />
                    <span>{isLoadingDocx ? '...' : '.docx'}</span>
                  </button>

                  {/* Secondary .txt Export Button */}
                  <button
                    onClick={() => handleDownloadTxt(note.id)}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    title="Export as Plain Text (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.txt</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onPlayGame(note.associatedGameId);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-indigo-300 py-1 transition-colors font-medium"
                >
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span>Launch {note.associatedGameTitle}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
