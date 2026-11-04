export type TheoryQuestionType = 
  | 'MCQ'
  | 'MULTIPLE_SELECT'
  | 'OUTPUT_PREDICTION'
  | 'CODE_TRACING'
  | 'FIND_THE_ERROR'
  | 'FILL_MISSING_STEP'
  | 'CONCEPTUAL_REASONING';

export type TheoryDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface TheoryQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TheoryQuestion {
  id: string;
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitNumber: number;
  topic: string;
  type: TheoryQuestionType;
  difficulty: TheoryDifficulty;
  prompt: string;
  codeSnippet?: string;
  options: TheoryQuestionOption[];
  explanation: string;
  hint?: string;
  cStandardRef?: string;
  provenance: 'RevPlay Supplemental Conceptual Question';
}

export interface TheoryAssessmentResult {
  unitId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  answers: Record<string, string[]>; // questionId -> selectedOptionIds
  completedAt: string;
}

