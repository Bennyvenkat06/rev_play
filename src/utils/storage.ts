import { UserProgress } from '../types/progress';
import { PlayerGameResult } from '../types/games';
import { UnitId } from '../types/syllabus';

const STORAGE_KEY = 'revplay_v1_user_progress';

const DEFAULT_PROGRESS: UserProgress = {
  totalXp: 0,
  level: 1,
  streakDays: 1,
  completedGames: {},
  recentResults: [],
  mistakeReviewQueue: [],
  soundEnabled: true,
  unlockedUnits: ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'lab'],
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlockedUnits: parsed.unlockedUnits || DEFAULT_PROGRESS.unlockedUnits,
    };
  } catch (err) {
    console.error('Failed to load user progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

export function recordGameCompletion(result: PlayerGameResult): UserProgress {
  const current = loadUserProgress();
  
  const existingGame = current.completedGames[result.gameId];
  const isFirstTime = !existingGame;
  const higherScore = existingGame ? Math.max(existingGame.highScore, result.score) : result.score;
  const bestStars = existingGame ? Math.max(existingGame.stars, result.starsEarned) as 1 | 2 | 3 : result.starsEarned;

  const newXpEarned = isFirstTime ? result.xpEarned : Math.round(result.xpEarned * 0.3); // replay bonus
  const updatedXp = current.totalXp + newXpEarned;
  const updatedLevel = Math.floor(updatedXp / 300) + 1;

  const updatedCompletedGames = {
    ...current.completedGames,
    [result.gameId]: {
      stars: bestStars,
      highScore: higherScore,
      maxScore: result.maxScore,
      completedAt: result.completedAt,
      attempts: (existingGame?.attempts || 0) + 1,
    }
  };

  // Add mistakes to review queue if any
  const newMistakes = result.mistakes.map(m => ({
    id: `${result.gameId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    gameId: result.gameId,
    unitId: result.unitId,
    question: m.questionOrContext,
    studentAnswer: m.studentAnswer,
    correctAnswer: m.correctAnswer,
    explanation: m.explanation,
    conceptRef: m.conceptRef,
    recordedAt: new Date().toISOString(),
  }));

  const updatedQueue = [...newMistakes, ...current.mistakeReviewQueue].slice(0, 25); // retain last 25

  const updatedProgress: UserProgress = {
    ...current,
    totalXp: updatedXp,
    level: updatedLevel,
    completedGames: updatedCompletedGames,
    recentResults: [result, ...current.recentResults].slice(0, 15),
    mistakeReviewQueue: updatedQueue,
  };

  saveUserProgress(updatedProgress);
  return updatedProgress;
}

