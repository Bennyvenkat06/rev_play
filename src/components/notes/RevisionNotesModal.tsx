import React, { useState } from 'react';
import { RevisionNote } from '../../types/notes';
import { downloadRevisionNoteAsText, generateNotesFilename } from '../../utils/downloadNotes';
import { downloadRevisionNoteAsDocx, generateDocxFilename } from '../../utils/downloadDocx';
import { soundManager } from '../../utils/sound';
import { 
  Download, 
  CheckCircle, 
  X, 
  BookOpen, 
  FileText, 
  AlertTriangle, 
  Code, 
  HelpCircle, 
  CheckSquare, 
  Zap,
  Bookmark,
  FileType
} from 'lucide-react';

interface RevisionNotesModalProps {
  note: RevisionNote | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayGame?: (gameId: string) => void;
}

export const RevisionNotesModal: React.FC<RevisionNotesModalProps> = ({
  note,
  isOpen,
  onClose,
  onPlayGame
}) => {
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  if (!isOpen || !note) return null;

  const handleDownloadDocx = async () => {
    soundManager.playClick();
    setIsGeneratingDocx(true);
    const success = await downloadRevisionNoteAsDocx(note);
    setIsGeneratingDocx(false);
    if (success) {
      setDownloadSuccessMsg(`Word Document (.docx) saved: ${generateDocxFilename(note)}`);
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    }
  };

  const handleDownloadTxt = () => {
    soundManager.playClick();
    const success = downloadRevisionNoteAsText(note);
    if (success) {
      setDownloadSuccessMsg(`Plain-Text (.txt) saved: ${generateNotesFilename(note)}`);
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    }
  };

  const handleCopySummary = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(
      `${note.title} — ${note.courseCode}\n\nObjective:\n${note.objective}\n\nSummary:\n${note.conceptSummary.join('\n')}`
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="notes-title"
      >
        {/* Header HUD */}
        <div className="p-5 sm:p-6 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-start justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                {note.courseCode}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {note.unitName}
              </span>
              {note.isSupplemental ? (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-amber-950/60 border border-amber-800 text-amber-300">
                  Supplemental Practice
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                  Official JNTUH R25
                </span>
              )}
            </div>
            <h2 id="notes-title" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
              {note.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">{note.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Action: Download Word (.docx) */}
            <button
              onClick={handleDownloadDocx}
              disabled={isGeneratingDocx}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all shadow-lg shadow-indigo-950/50"
              title="Download formatted Microsoft Word Document (.docx)"
            >
              <FileType className="w-4 h-4 text-white" />
              <span>{isGeneratingDocx ? 'Generating .docx...' : 'Download Word (.docx)'}</span>
            </button>

            {/* Secondary Action: Download Plain Text (.txt) */}
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              title="Download plain-text revision note (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.txt</span>
            </button>

            {onPlayGame && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  onPlayGame(note.associatedGameId);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all shadow-md active:scale-95 glow-cyan"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Play Game</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close revision notes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download confirmation banner */}
        {downloadSuccessMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-800 px-6 py-2.5 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMsg}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-mono">Offline Ready</span>
          </div>
        )}

        {/* Content Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200" data-lenis-prevent>
          
          {/* Section 1: Revision Objective & Context */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5" />
                1. Revision Objective & Alignment
              </h3>
              <button 
                onClick={handleCopySummary}
                className="text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors"
              >
                {copiedNotification ? '✓ Copied!' : 'Copy Summary'}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{note.objective}</p>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap gap-y-1 gap-x-4">
              <span><strong>Game:</strong> {note.associatedGameTitle}</span>
              <span><strong>Mapping:</strong> {note.officialSyllabusMapping}</span>
            </div>
          </div>

          {/* Section 2: Core Concept Summary */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              2. Core Concept Summary
            </h3>
            <ul className="space-y-2">
              {note.conceptSummary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: C Syntax & Terminology */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              3. Key C Syntax & Terminology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {note.syntaxAndTerminology.map((item, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-sm font-bold text-emerald-400 font-mono mb-1">{item.term}</div>
                  <div className="text-xs text-slate-300 mb-2">{item.definition}</div>
                  {item.syntax && (
                    <div className="bg-slate-900 px-2.5 py-1.5 rounded font-mono text-xs text-cyan-300 border border-slate-800 break-all">
                      {item.syntax}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Verified C Code Examples */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              4. Verified C Code Examples & Idioms
            </h3>
            <div className="space-y-4">
              {note.codeExamples.map((ex, idx) => (
                <div key={idx} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>{ex.title}</span>
                    <span className="text-[11px] font-mono text-cyan-400">Standard C99/C11</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-[#0a0d16]">
                    <code>{ex.code}</code>
                  </pre>
                  <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400">
                    <strong>Note:</strong> {ex.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Worked Execution Trace (if present) */}
          {note.workedTrace && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                5. Worked Execution Trace
              </h3>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
                <p className="text-xs text-slate-400 mb-3">{note.workedTrace.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="py-2 px-2.5">Step</th>
                        <th className="py-2 px-2.5">Statement Executed</th>
                        <th className="py-2 px-2.5">Variable State</th>
                        <th className="py-2 px-2.5">Trace Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {note.workedTrace.steps.map((st) => (
                        <tr key={st.step} className="hover:bg-slate-900/50">
                          <td className="py-2 px-2.5 text-cyan-400 font-bold">{st.step}</td>
                          <td className="py-2 px-2.5 text-slate-200">{st.codeLine}</td>
                          <td className="py-2 px-2.5 text-emerald-400">
                            {Object.entries(st.variableState).map(([k, v]) => `${k}=${v}`).join(', ')}
                          </td>
                          <td className="py-2 px-2.5 text-slate-400 font-sans">{st.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                  <strong>Output:</strong> {note.workedTrace.finalOutput}
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Common Mistakes & Pitfalls */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              6. Common Mistakes & Edge Cases
            </h3>
            <div className="space-y-3">
              {note.commonMistakes.map((m, idx) => (
                <div key={idx} className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4">
                  <div className="text-xs font-bold text-rose-300 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Trap: {m.pitfall}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono mb-2">
                    <div className="bg-rose-950/40 p-2.5 rounded border border-rose-900/60 text-rose-300">
                      <div className="text-[10px] text-rose-400 uppercase font-sans font-bold mb-1">❌ Faulty Pattern:</div>
                      <pre className="overflow-x-auto">{m.badCode}</pre>
                    </div>
                    <div className="bg-emerald-950/40 p-2.5 rounded border border-emerald-900/60 text-emerald-300">
                      <div className="text-[10px] text-emerald-400 uppercase font-sans font-bold mb-1">✔ Safe Idiom:</div>
                      <pre className="overflow-x-auto">{m.fixedCode}</pre>
                    </div>
                  </div>
                  <p className="text-xs text-rose-300/80 font-sans">
                    <strong>Consequence:</strong> {m.consequence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7 & 8: Quick Checklist & Exam Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                7. Quick Revision Checklist
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {note.quickChecklist.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                8. JNTUH Exam Tips
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {note.examTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">!</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Source: JNTUH R25 CSE (AI&ML) CS103ES / CS107ES</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadDocx}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5"
            >
              <FileType className="w-3.5 h-3.5" />
              <span>Word Document (.docx)</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Text (.txt)</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
