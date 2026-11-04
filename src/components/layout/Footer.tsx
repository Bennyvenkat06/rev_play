import React from 'react';
import { OFFICIAL_SYLLABUS_SOURCE } from '../../data/syllabusData';
import { ShieldCheck, BookOpen, ExternalLink, Gamepad2, Home, Compass, FlaskConical, FileText, Trophy } from 'lucide-react';
import { NavViewMode } from './Navbar';

interface FooterProps {
  onNavigate: (view: NavViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-slate-950 font-bold">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-wider font-display uppercase">
              REV<span className="text-cyan-400">PLAY</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Interactive academic learning and revision platform for C programming.
            Aligned strictly to {OFFICIAL_SYLLABUS_SOURCE.institution} {OFFICIAL_SYLLABUS_SOURCE.regulation}.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            Theory Course: {OFFICIAL_SYLLABUS_SOURCE.theoryCourseCode} • Lab Course: {OFFICIAL_SYLLABUS_SOURCE.labCourseCode}
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-xs font-bold uppercase text-slate-300 font-mono mb-2">Academic Sections</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('theory')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Theory (CS103ES)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('laboratory')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Laboratory (CS107ES)</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-slate-300 font-mono mb-2">Study & Progress</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('notes')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Revision Library (DOCX & TXT)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('progress')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Progress & Coverage Matrix</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase text-slate-300 font-mono mb-2">Governance & Authority</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a 
                  href={OFFICIAL_SYLLABUS_SOURCE.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>Official JNTUH Syllabus PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="text-[11px] text-slate-600">
                JNTUH R25 B.Tech Curriculum
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600">
        <span>© {new Date().getFullYear()} RevPlay Platform. Think in Code. Play the Logic.</span>
        <span>Local Microsoft Word (.docx) & Plain-Text (.txt) export enabled. Zero network dependencies.</span>
      </div>
    </footer>
  );
};
