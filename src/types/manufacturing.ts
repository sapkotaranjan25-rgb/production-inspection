export interface ManufacturingEntry {
  // Sample Time
  sampleStart: string;
  sampleEnd: string;
  
  // OD Measurements
  odAverage: number | '';
  odMaximum: number | '';
  odMinimum: number | '';
  outOfRound: number | '';
  
  // Quality Measurements
  qualityPercent: number | '';
  oilPercent: number | '';
  
  // Wall Measurements
  wallThickness: number | '';
  targetWall: number | '';
  wallMaximum: number | '';
  wallMinimum: number | '';
  
  // Technical Measurements
  eccentricity: number | '';
  estimatedWtPerFt: number | '';
  
  // Production Data
  unitsProduced: number | '';
  totalFootage: number | '';
  scrapLbs: number | '';
  scrapCode: string;
  disposition: string;
  
  // Quality Control
  visualInspection: string;
  printQuality: string;
  odAtSaw: number | '';
  odAtVacTank: number | '';
  meltPressure: number | '';
  dieHead: string;
  actualPph: number | '';
  
  // Line Reading (Hourly)
  lineReading: string;
  
  // Additional Notes
  notes: string;
}

export interface ManufacturingFormData {
  date: Date;
  shift: string;
  operator: string;
  productLine: string;
  materialType: string;
  targetSpecs: {
    targetOD: number;
    targetWall: number;
    targetWeight: number;
  };
  entries: ManufacturingEntry[];
}

export const QUALITY_OPTIONS = ['Pass', 'Fail', 'Marginal'] as const;
export const DISPOSITION_OPTIONS = ['Accept', 'Rework', 'Scrap'] as const;
export const SCRAP_CODES = ['S', 'F', 'M', 'D', 'O'] as const;