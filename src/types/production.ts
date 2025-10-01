export interface ProductionEntry {
  // Sample Time
  start: string;
  end: string;
  
  // OD Measurements
  odAverage: number | '';
  odMaximum: number | '';
  odMinimum: number | '';
  outOfRound: number; // Calculated: OD Maximum - OD Minimum
  ovality: number; // Calculated: ((OD Maximum - OD Minimum)/(OD Maximum + OD Minimum))*200
  odEnd: number | '';
  toeIn: number; // Calculated: ((OD End - OD Average)/(OD Average))*100
  
  // Wall Measurements
  wallMinimum: number | '';
  wallMaximum: number | '';
  eccentricity: number; // Calculated: ((Wall Maximum - Wall Minimum)/(Wall Maximum))*100
  
  // Quality Checks
  visual: string; // Pass/Fail
  print: string; // Pass/Fail
  
  // Technical Measurements
  odAtSaw: number | '';
  odAtVacTank: number | '';
  meltPress: number | '';
  dieHeadClean: string; // Yes/No
  
  // Production Data
  unitStart: number | '';
  unitEnd: number | '';
  actualPPH: number | '';
  actualWtPerFt: number | '';
  gain: number | '';
  loss: number | '';
  
  // Accepted/Scrap Data
  acceptedFt: number | '';
  acceptedLbs: number | '';
  scrapFts: number | '';
  scrapLbs: number | '';
  scrapCode: string; // A,B,C,D
  regrindConsumed: number | ''; // 1 decimal place
}

export interface TargetSpecifications {
  odAverage: number | '';
  odMax: number | '';
  odMin: number | '';
  caliperMaximum: number | '';
  caliperMinimum: number | '';
  outOfRound: number | '';
  ovality: number | '';
  toeIn: number | '';
  wallMin: number | '';
  wallMax: number | '';
  targetMin: number | '';
  targetMax: number | '';
  eccentricity: number | '';
  goalPPH: number | '';
  theoWtPerFt: number | '';
  targetGain: number | '';
}

export interface ProductionFormData {
  id: string;
  productionSite: string;
  date: Date;
  shift: string;
  operatorName: string;
  productionLine: string;
  workOrderNumber: string;
  resinCode: string;
  colorCode: string;
  targetSpecs: TargetSpecifications;
  entries: ProductionEntry[];
}

export interface ProductionTotals {
  acceptedLbs: number;
  acceptedFts: number;
  scrapLbs: number;
  scrapFts: number;
}

export const VISUAL_OPTIONS = ['-', 'Pass', 'Fail'] as const;
export const PRINT_OPTIONS = ['-', 'Pass', 'Fail'] as const;
export const DIE_HEAD_OPTIONS = ['-', 'Yes', 'No'] as const;
export const SCRAP_CODES = ['A', 'B', 'C', 'D'] as const;