import { UnitId } from './syllabus';

export interface CodeSnippet {
  title: string;
  code: string;
  explanation: string;
}

export interface WorkedTraceStep {
  step: number;
  codeLine: string;
  variableState: Record<string, string | number>;
  explanation: string;
}

export interface CommonMistake {
  badCode: string;
  fixedCode: string;
  pitfall: string;
  consequence: string;
}

export interface RevisionNote {
  id: string; // Stable notesId
  title: string;
  subtitle: string;
  unitId: UnitId;
  unitName: string;
  courseCode: 'CS103ES' | 'CS107ES';
  courseName: string;
  associatedGameId: string;
  associatedGameTitle: string;
  officialSyllabusMapping: string;
  isSupplemental: boolean;
  supplementalNotice?: string;
  
  // 10 Mandatory Sections
  objective: string;
  conceptSummary: string[];
  syntaxAndTerminology: {
    term: string;
    definition: string;
    syntax?: string;
  }[];
  codeExamples: CodeSnippet[];
  workedTrace?: {
    description: string;
    steps: WorkedTraceStep[];
    finalOutput: string;
  };
  commonMistakes: CommonMistake[];
  quickChecklist: string[];
  examTips: string[];
}

