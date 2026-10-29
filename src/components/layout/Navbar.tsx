import React, { useState } from 'react';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { 
  Gamepad2, 
  BookOpen, 
  ShieldCheck, 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Zap, 
  Trophy, 
  Menu, 
  X 
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'notes' | 'coverage' | 'lab';
  onNavigate: (view: 'dashboard' | 'notes' | 'coverage' | 'lab') => void;
  progress: UserProgress;
  onSoundToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  progress,
  onSoundToggle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Syllabus World', icon: Gamepad2 },
    { id: 'lab', label: 'CS107ES Lab Arena', icon: FlaskConical },
    { id: 'notes', label: 'Revision Notes Library', icon: BookOpen },
    { id: 'coverage', label: 'Coverage Matrix', icon: ShieldCheck },
  ] as const;

  const handleNavClick = (view: 'dashboard' | 'notes' | 'coverage' | 'lab') => {
    soundManager.playClick();
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-900/40 glow-cyan">
            <Gamepad2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="text-lg font-black tracking-wider text-white font-display uppercase group-hover:text-cyan-400 transition-colors">
              REV<span className="text-cyan-400">PLAY</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:block">
              JNTUH R25 C Syllabus Game
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-3">
          {/* Level & XP Capsule */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>LVL {progress.level}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Zap className="w-3 h-3" />
              <span>{progress.totalXp} XP</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onSoundToggle}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title={progress.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1 animate-in slide-in-from-top-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  active
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

