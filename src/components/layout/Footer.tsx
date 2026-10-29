import React from 'react';
import { OFFICIAL_SYLLABUS_SOURCE } from '../../data/syllabusData';
import { ShieldCheck, BookOpen, ExternalLink, Gamepad2 } from 'lucide-react';

interface FooterProps {
  onOpenCoverage: () => void;
  onOpenNotesLibrary: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCoverage,
  onOpenNotesLibrary
}) => {
  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-slate-950 font-bold">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-wider font-display uppercase">
              REV<span className="text-cyan-400">PLAY</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Interactive syllabus gaming and high-yield revision platform for C programming.
            Aligned strictly to {OFFICIAL_SYLLABUS_SOURCE.institution} {OFFICIAL_SYLLABUS_SOURCE.regulation}.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            Theory Course: {OFFICIAL_SYLLABUS_SOURCE.theoryCourseCode} • Lab Course: {OFFICIAL_SYLLABUS_SOURCE.labCourseCode}
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-xs font-bold uppercase text-slate-300 font-mono mb-2">Curriculum</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={onOpenCoverage} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Coverage Matrix</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenNotesLibrary} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Revision Notes (.txt)</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-slate-300 font-mono mb-2">Source Reference</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a 
                  href={OFFICIAL_SYLLABUS_SOURCE.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>Official JNTUH PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="text-[11px] text-slate-600">
                Peer Tutor workspace protected
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600">
        <span>© {new Date().getFullYear()} RevPlay Platform. Your Syllabus. Reimagined as a Game.</span>
        <span>Local plain-text download enabled. Zero external network prerequisites.</span>
      </div>
    </footer>
  );
};

