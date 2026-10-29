import { UnitId } from './syllabus';

export type GameDifficulty = 'Novice' | 'Apprentice' | 'Master' | 'Boss';

export type GameMechanic = 
  | 'prediction' 
  | 'stepper' 
  | 'memory_grid' 
  | 'drag_drop' 
  | 'algorithm_race' 
  | 'code_debug'
  | 'stack_tracer'
  | 'flowchart';

export interface GameDefinition {
  id: string;
  unitId: UnitId;
  title: string;
  badge: string;
  description: string;
  difficulty: GameDifficulty;
  mechanic: GameMechanic;
  notesId: string;
  estimatedMinutes: number;
  maxScore: number;
  xpReward: number;
  officialTopicRef: string;
}

export interface PlayerGameResult {
  gameId: string;
  unitId: UnitId;
  score: number;
  maxScore: number;
  percentage: number;
  xpEarned: number;
  starsEarned: 1 | 2 | 3;
  timeSpentSeconds: number;
  completedAt: string;
  mistakes: {
    questionOrContext: string;
    studentAnswer: string;
    correctAnswer: string;
    explanation: string;
    conceptRef: string;
  }[];
}

