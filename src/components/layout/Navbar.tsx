import React, { useState, useEffect } from 'react';
import { UserProgress } from '../../types/progress';
import { soundManager } from '../../utils/sound';
import { 
  Home,
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

export type NavViewMode = 'home' | 'syllabus' | 'lab' | 'notes' | 'coverage';

interface NavbarProps {
  currentView: NavViewMode;
  onNavigate: (view: NavViewMode) => void;
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
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));
        setScrollProgress(pct);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'syllabus', label: 'Syllabus World', icon: Gamepad2 },
    { id: 'lab', label: 'CS107ES Lab Arena', icon: FlaskConical },
    { id: 'notes', label: 'Revision Notes Library', icon: BookOpen },
    { id: 'coverage', label: 'Coverage Matrix', icon: ShieldCheck },
  ] as const;

  const handleNavClick = (view: NavViewMode) => {
    soundManager.playClick();
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-[10px] bg-[rgba(8,13,27,0.82)] border-b border-slate-800/60 shadow-md shadow-black/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group transition-transform active:scale-98 shrink-0"
          title="Return to RevPlay Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-900/40 glow-cyan shrink-0">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          </div>
          <div>
            <div className="text-base sm:text-lg font-black tracking-wider text-white font-display uppercase group-hover:text-cyan-400 transition-colors leading-tight">
              REV<span className="text-cyan-400">PLAY</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono -mt-0.5 hidden sm:block">
              JNTUH R25 C Syllabus Game
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm glow-cyan'
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Level & XP Capsule (compact on small mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-800 px-2 sm:px-3 py-1.5 rounded-xl font-mono text-xs">
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>LVL {progress.level}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1 text-amber-400 font-semibold">
              <Zap className="w-3 h-3" />
              <span>{progress.totalXp} XP</span>
            </div>
          </div>

          {/* Sound Toggle (minimum 40x40px touch target) */}
          <button
            onClick={onSoundToggle}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 active:scale-95"
            title={progress.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            aria-label={progress.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile Menu Toggle (minimum 40x40px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white shrink-0 active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Website-Wide 2px Scroll Progress Bar pinned beneath sticky navbar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 space-y-1 animate-in slide-in-from-top-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  active
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
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

