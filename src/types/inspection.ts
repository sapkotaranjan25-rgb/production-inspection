export type InspectionStatus = 'pass' | 'fail' | 'na';

export interface InspectionEntry {
  hour: string;
  checkpoint1: InspectionStatus;
  checkpoint2: InspectionStatus;
  checkpoint3: InspectionStatus;
  checkpoint4: InspectionStatus;
  comments: string;
  inspectorInitials: string;
}

export interface InspectionFormData {
  facility: string;
  date: Date;
  shift: string;
  inspector: string;
  entries: InspectionEntry[];
}

export const INSPECTION_CHECKPOINTS = [
  'Security Check',
  'Equipment Status', 
  'Safety Compliance',
  'General Condition'
] as const;