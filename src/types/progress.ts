import { UnitId } from './syllabus';
import { PlayerGameResult } from './games';

export interface UserProgress {
  totalXp: number;
  level: number;
  streakDays: number;
  completedGames: Record<string, {
    stars: 1 | 2 | 3;
    highScore: number;
    maxScore: number;
    completedAt: string;
    attempts: number;
  }>;
  recentResults: PlayerGameResult[];
  mistakeReviewQueue: {
    id: string;
    gameId: string;
    unitId: UnitId;
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    conceptRef: string;
    recordedAt: string;
  }[];
  soundEnabled: boolean;
  unlockedUnits: UnitId[];
}

