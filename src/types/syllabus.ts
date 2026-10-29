export type UnitId = 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5' | 'lab';

export interface SyllabusTopic {
  id: string;
  unitId: UnitId;
  title: string;
  description: string;
  officialJntuhRef: string;
  gameId: string;
  notesId: string;
  isSupplemental?: boolean;
}

export interface SyllabusUnit {
  id: UnitId;
  unitNumber: number | 'LAB';
  title: string;
  codename: string;
  shortDescription: string;
  officialCourseCode: string;
  courseTitle: string;
  topics: SyllabusTopic[];
  bossGameId?: string;
  accentColor: string;
  bgGradient: string;
}

export interface LabPracticeGroup {
  groupNumber: number;
  title: string;
  officialObjective: string;
  experiments: {
    id: string;
    title: string;
    codeTemplate?: string;
    expectedBehavior: string;
    notesId: string;
    gameId: string;
    verified: boolean;
  }[];
}

export interface CoverageItem {
  syllabusRef: string;
  courseCode: 'CS103ES' | 'CS107ES';
  category: 'Theory' | 'Lab Objective' | 'Lab Experiment';
  topicName: string;
  gameId: string;
  gameTitle: string;
  notesId: string;
  notesTitle: string;
  status: 'Complete' | 'Interactive' | 'Verified';
  supplementalNotice?: string;
}

