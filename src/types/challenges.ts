export type ChallengeProvenance = 
  | 'VERIFIED_PYQ'
  | 'PYQ_VARIANT'
  | 'SOURCE_MATCH_PENDING_PRIMARY_PDF'
  | 'SUPPLEMENTAL_CHALLENGE';

export type PrimaryVerificationStatus = 
  | 'CONFIRMED_PRIMARY_PDF'
  | 'SECONDARY_SOURCE_TRANSCRIPT'
  | 'PLATFORM_ADAPTATION'
  | 'NO_UNIVERSITY_PAPER_CLAIMED';

export interface ProvenanceRecord {
  status: ChallengeProvenance;
  institution: string; // e.g. "JNTUH"
  regulation?: 'R25' | 'R22' | 'R18' | 'R16';
  paperCode?: string; // e.g. "181AP", "132AD"
  examinationSession?: string; // e.g. "July/August 2024", "January/February 2024"
  questionNumber?: string; // e.g. "2(b)", "4(a)"
  primaryVerificationStatus: PrimaryVerificationStatus;
  notes: string;
}

export interface ChallengeTestCasePlanItem {
  caseId: string;
  category: 'Normal' | 'Boundary' | 'Edge' | 'Stress';
  description: string;
  expectedBehavior: string;
}

export interface ChallengeSampleIO {
  input: string;
  output: string;
  explanation?: string;
}

export interface ChallengeSpecification {
  id: string; // e.g. 'CHAL-01'
  title: string;
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5' | 'lab';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTag: string;
  
  // Normalized platform problem statement
  normalizedStatement: string;
  
  // Kept strictly separate from normalized statement
  originalExamWording?: string;
  
  // Normalization notes explaining differences
  normalizationNotes?: string;
  
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleIO: ChallengeSampleIO[];
  edgeCases: string[];
  
  // Test-case plan (never exposing hidden inputs/solutions)
  testCasePlan: ChallengeTestCasePlanItem[];
  
  // Academic Provenance
  provenance: ProvenanceRecord;
  
  linkedProgrammeId?: string;
}
