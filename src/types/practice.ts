export type ProgrammeStatus = 
  | 'PRESCRIBED_LAB' 
  | 'SUPPLEMENTAL_PRACTICE' 
  | 'UNRESOLVED_IN_SPECIFICATION';

export interface CollegeLocalCourseMapping {
  localCourseCode: string;
  localCourseTitle: string;
  institutionLocalNote: string;
}

export interface TechnicalVerification {
  supportedInputs: string;
  complexityAnalysis?: string;
  edgeCases: string[];
  implementationNotes: string;
  overflowSafeguards?: string;
  memorySafety?: string;
}

export interface PracticeProgramme {
  id: string; // e.g. 'P-U1-01', 'P-U3-03', 'P-V-03'
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5' | 'lab';
  groupNumber?: number; // 1 to 6 for JNTUH CS107ES lab groups
  title: string;
  category: 'Prescribed Lab Exercise' | 'Supplementary Practice' | 'Unresolved Specification';
  status: ProgrammeStatus;
  officialSyllabusMapping?: {
    courseCode: 'CS103ES' | 'CS107ES';
    labGroup?: number;
    syllabusRef: string;
    isMandatedByJntuh: boolean;
  };
  collegeLocalMapping?: CollegeLocalCourseMapping;
  technicalVerification: TechnicalVerification;
  codeTemplate?: string;
  isUnresolved?: boolean;
  unresolvedReason?: string;
}
