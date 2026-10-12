export type Language = 'en' | 'ta';

export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation / Harvest';

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export type RiskTier = 'low' | 'moderate' | 'elevated' | 'severe';

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  preferredLanguage: Language;
  defaultCrop: string;
  createdAt: string;
  updatedAt: string;
}

export interface Field {
  id: string;
  userId: string;
  fieldName: string;
  crop: string;
  cropVariety?: string;
  growthStage: GrowthStage;
  acreage?: number;
  location?: string;
  plantingDate?: string;
  notes?: string;
  riskScore: number;
  riskTier: RiskTier;
  lastInspected?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlternativePest {
  name: string;
  scientificName: string;
  likelihood: string;
  distinguishingFeature: string;
}

export interface IpmRecommendations {
  cultural: string[];
  mechanical: string[];
  biological: string[];
  chemical: string[];
  monitoring: string[];
}

export interface PestAnalysisResult {
  pestPresent: boolean;
  isInconclusive: boolean;
  inconclusiveReason?: string;
  pestName: string;
  scientificName: string;
  confidenceScore: number;
  confidenceExplanation: string;
  severity: SeverityLevel;
  approximateAffectedArea: string;
  affectedCropParts: string[];
  observableEvidence: string[];
  damageSymptoms: string[];
  alternativePossibilities: AlternativePest[];
  immediateActions: string[];
  ipmRecommendations: IpmRecommendations;
  preventiveMeasures: string[];
  expertVerificationNeeded: boolean;
  expertVerificationTriggers: string[];
}

export interface ScanReport extends PestAnalysisResult {
  id: string;
  userId: string;
  fieldId?: string;
  fieldName: string;
  cropType: string;
  cropVariety?: string;
  growthStage: string;
  scanDate: string;
  imageUrl: string;
  weatherConditions?: string;
  notes?: string;
  syncStatus?: 'synced' | 'pending_sync';
  createdAt: string;
  updatedAt: string;
}

export interface RiskIntelligence {
  overallRiskScore: number; // 0-100
  riskTier: RiskTier;
  contributingFactors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }>;
  inspectionFrequency: string;
  nextInspectionDate: string;
  prioritizedActions: string[];
  historicalTrend: 'improving' | 'stable' | 'deteriorating' | 'baseline';
  historicalComparison: string;
}

export interface MonitoringTask {
  id: string;
  userId: string;
  fieldId?: string;
  fieldName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  category: 'inspection' | 'cultural' | 'biocontrol' | 'treatment';
  createdAt: string;
}

export interface PestLibraryItem {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  affectedCrops: string[];
  damageType: string;
  keyIdentificationFeatures: string[];
  typicalDamageSymptoms: string[];
  lifeCycleSummary: string;
  favorableConditions: string;
  preventionStrategies: string[];
  ipmOptions: {
    cultural: string[];
    mechanical: string[];
    biological: string[];
    chemical: string[];
  };
  imageUrl: string;
  isSampleData?: boolean;
}
