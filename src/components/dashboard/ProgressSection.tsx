import React from 'react';
import { UserProgress } from '../../types/progress';
import { StatsHeader } from './StatsHeader';
import { CoverageMatrix } from '../coverage/CoverageMatrix';
import { Trophy, Star, Zap, Award, Flame, AlertCircle, ShieldCheck } from 'lucide-react';

interface ProgressSectionProps {
  progress: UserProgress;
  onOpenMistakesReview: () => void;
  onPlayGame: (gameId: string) => void;
  onOpenNotes: (notesId: string) => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  onOpenMistakesReview,
  onPlayGame,
  onOpenNotes
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* HUD Stats Header */}
      <StatsHeader
        progress={progress}
        onOpenMistakesReview={onOpenMistakesReview}
      />

      {/* Curriculum Coverage Matrix */}
      <CoverageMatrix
        onPlayGame={onPlayGame}
        onOpenNotes={onOpenNotes}
      />
    </div>
  );
};

