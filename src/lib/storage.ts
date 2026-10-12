import { Field, ScanReport, MonitoringTask, RiskIntelligence, RiskTier, GrowthStage } from '../types';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, orderBy } from 'firebase/firestore';

const STORAGE_KEYS = {
  FIELDS: 'pestguard_fields',
  SCANS: 'pestguard_scans',
  TASKS: 'pestguard_tasks',
  PENDING_SYNC: 'pestguard_pending_sync'
};

// Initial starter fields so users can immediately experience the platform
const DEFAULT_INITIAL_FIELDS: Field[] = [
  {
    id: 'field-north-maize',
    userId: 'default_user',
    fieldName: 'North Plot — Hybrid Maize',
    crop: 'Maize',
    cropVariety: 'Pioneer 3396',
    growthStage: 'Vegetative',
    acreage: 4.5,
    location: 'North Sector, Grid 4A',
    plantingDate: '2026-08-15',
    notes: 'V4 to V6 vegetative stage. Drip irrigated. High organic mulch bed.',
    riskScore: 78,
    riskTier: 'severe',
    lastInspected: '2026-10-10',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'field-south-tomato',
    userId: 'default_user',
    fieldName: 'South Greenhouse — Table Tomato',
    crop: 'Tomato',
    cropVariety: 'Arka Rakshak',
    growthStage: 'Flowering',
    acreage: 2.0,
    location: 'Polyhouse Block 2',
    plantingDate: '2026-08-28',
    notes: 'Indeterminate trellis tomatoes. First fruit set visible. Weekly delta pheromone monitoring.',
    riskScore: 54,
    riskTier: 'moderate',
    lastInspected: '2026-10-11',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'field-east-rice',
    userId: 'default_user',
    fieldName: 'East Wetland — Paddy Field',
    crop: 'Rice',
    cropVariety: 'BPT 5204 (Samba Mahsuri)',
    growthStage: 'Vegetative',
    acreage: 6.0,
    location: 'East Basin, Lowland Canal',
    plantingDate: '2026-09-02',
    notes: 'Active tillering stage. Alternate Wetting and Drying (AWD) practiced. Water drained recently.',
    riskScore: 32,
    riskTier: 'low',
    lastInspected: '2026-10-08',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

// Initial starter scans to showcase Pest Progression Timeline
const DEFAULT_INITIAL_SCANS: ScanReport[] = [
  {
    id: 'scan-maize-oct10',
    userId: 'default_user',
    fieldId: 'field-north-maize',
    fieldName: 'North Plot — Hybrid Maize',
    cropType: 'Maize',
    cropVariety: 'Pioneer 3396',
    growthStage: 'Vegetative',
    scanDate: '2026-10-10T14:30:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800&q=80',
    pestPresent: true,
    isInconclusive: false,
    pestName: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    confidenceScore: 94,
    confidenceExplanation: 'High confidence based on distinct inverted white "Y" marking on head capsule and heavy whorl frass.',
    severity: 'high',
    approximateAffectedArea: '30% foliar canopy',
    affectedCropParts: ['Central whorl', 'Young leaves'],
    observableEvidence: [
      'Inverted white "Y" visible on dark head capsule',
      'Extensive yellow-brown sawdust-like frass in central funnel',
      'Windowing and ragged shot-holes in unfurled leaves'
    ],
    damageSymptoms: ['Whorl damage', 'Stunted emergence'],
    alternativePossibilities: [
      { name: 'African Armyworm', scientificName: 'Spodoptera exempta', likelihood: 'Low', distinguishingFeature: 'Lacks distinct square pinacula' }
    ],
    immediateActions: [
      'Apply wood-ash / fine sand into central whorls of infested plants',
      'Deploy 5 pheromone traps per acre at crop height'
    ],
    ipmRecommendations: {
      cultural: ['Balanced N-P-K fertilizer', 'Intercropping with cowpea'],
      mechanical: ['Hand-pick egg masses with scales', 'Wood ash in whorl'],
      biological: ['Release Trichogramma egg parasitoids', 'Spray Bacillus thuringiensis (Bt)'],
      chemical: ['If damage exceeds 20% in V4-V8: Apply Chlorantraniliprole 18.5% SC adhering to PPE labels'],
      monitoring: ['Scout 20 consecutive plants in W pattern twice weekly']
    },
    preventiveMeasures: ['Early synchronous planting', 'Deep summer plowing'],
    expertVerificationNeeded: true,
    expertVerificationTriggers: ['Whorl destruction crosses 25% threshold'],
    weatherConditions: 'Warm (30°C, 75% RH), light drizzle 2 days prior',
    createdAt: '2026-10-10T14:30:00.000Z',
    updatedAt: '2026-10-10T14:30:00.000Z'
  },
  {
    id: 'scan-maize-oct03',
    userId: 'default_user',
    fieldId: 'field-north-maize',
    fieldName: 'North Plot — Hybrid Maize',
    cropType: 'Maize',
    cropVariety: 'Pioneer 3396',
    growthStage: 'Seedling',
    scanDate: '2026-10-03T09:15:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800&q=80',
    pestPresent: true,
    isInconclusive: false,
    pestName: 'Fall Armyworm (Early Instar)',
    scientificName: 'Spodoptera frugiperda',
    confidenceScore: 82,
    confidenceExplanation: 'Early instar pinhole feeding detected on seedling leaves with minor frass particles.',
    severity: 'moderate',
    approximateAffectedArea: '12% leaf surface',
    affectedCropParts: ['Seedling upper leaves'],
    observableEvidence: [
      'Early pinhole leaf scraping on 2nd and 3rd true leaves',
      'Small early instar caterpillars (<8mm) feeding on leaf undersides'
    ],
    damageSymptoms: ['Early leaf scraping', 'Minor windowing'],
    alternativePossibilities: [
      { name: 'Grasshopper nymph', scientificName: 'Melanoplus spp.', likelihood: 'Low', distinguishingFeature: 'Chews leaf edges from margin inward' }
    ],
    immediateActions: ['Hand-crush observed egg clusters', 'Spray neem seed kernel extract (NSKE 5%)'],
    ipmRecommendations: {
      cultural: ['Maintain clean field margins', 'Avoid excess nitrogen'],
      mechanical: ['Yellow sticky traps'],
      biological: ['Neem oil botanical spray'],
      chemical: ['No synthetic chemicals required at this early threshold'],
      monitoring: ['Inspect seedlings every 3 days']
    },
    preventiveMeasures: ['Trap crops on field borders'],
    expertVerificationNeeded: false,
    expertVerificationTriggers: ['Rapid spread to neighboring blocks'],
    weatherConditions: 'Warm and dry (29°C, 60% RH)',
    createdAt: '2026-10-03T09:15:00.000Z',
    updatedAt: '2026-10-03T09:15:00.000Z'
  },
  {
    id: 'scan-tomato-oct11',
    userId: 'default_user',
    fieldId: 'field-south-tomato',
    fieldName: 'South Greenhouse — Table Tomato',
    cropType: 'Tomato',
    cropVariety: 'Arka Rakshak',
    growthStage: 'Flowering',
    scanDate: '2026-10-11T11:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    pestPresent: true,
    isInconclusive: false,
    pestName: 'Tomato Leafminer',
    scientificName: 'Tuta absoluta',
    confidenceScore: 91,
    confidenceExplanation: 'Characteristic blotch mines with translucent mesophyll blisters and granular dark frass.',
    severity: 'moderate',
    approximateAffectedArea: '18% foliage',
    affectedCropParts: ['Middle canopy leaves', 'Flowering shoots'],
    observableEvidence: [
      'Silvery translucent blotch galleries across leaf blades',
      'Black frass granules inside leaf mines',
      'Initial leaf necrosis around older mine galleries'
    ],
    damageSymptoms: ['Blotch mining', 'Reduced photosynthetic area'],
    alternativePossibilities: [
      { name: 'Serpentine Leafminer', scientificName: 'Liriomyza trifolii', likelihood: 'Moderate', distinguishingFeature: 'Produces winding thread-like tunnels' }
    ],
    immediateActions: [
      'Prune and destroy heavily mined lower leaves in sealed bags',
      'Check delta pheromone traps for adult moth count'
    ],
    ipmRecommendations: {
      cultural: ['Remove Solanum weeds around polyhouse', 'Netting at vents'],
      mechanical: ['Delta traps baited with Qlure'],
      biological: ['Release Trichogramma achaeae parasitoids', 'Spinosad bio-spray'],
      chemical: ['If leaf infestation exceeds 5%: Apply Cyantraniliprole rotating with bio-rationals'],
      monitoring: ['Weekly inspection of 10 sample plants']
    },
    preventiveMeasures: ['40-mesh insect screens', 'Crop rotation'],
    expertVerificationNeeded: false,
    expertVerificationTriggers: ['Fruit boring observed on green tomatoes'],
    weatherConditions: 'Polyhouse (27°C, 65% RH), sunny exterior',
    createdAt: '2026-10-11T11:00:00.000Z',
    updatedAt: '2026-10-11T11:00:00.000Z'
  }
];

const DEFAULT_INITIAL_TASKS: MonitoringTask[] = [
  {
    id: 'task-1',
    userId: 'default_user',
    fieldId: 'field-north-maize',
    fieldName: 'North Plot — Hybrid Maize',
    title: 'Scout 20 central whorls for Fall Armyworm frass',
    description: 'Check W-pattern transect across North Plot to assess if defoliation exceeds 20% economic injury threshold.',
    dueDate: '2026-10-14T17:00:00.000Z',
    priority: 'high',
    completed: false,
    category: 'inspection',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    userId: 'default_user',
    fieldId: 'field-south-tomato',
    fieldName: 'South Greenhouse — Table Tomato',
    title: 'Service Delta pheromone traps & record moth catch',
    description: 'Replace sticky liners and count adult Tuta absoluta moths trapped in Polyhouse Block 2.',
    dueDate: '2026-10-13T12:00:00.000Z',
    priority: 'medium',
    completed: false,
    category: 'biocontrol',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    userId: 'default_user',
    fieldId: 'field-east-rice',
    fieldName: 'East Wetland — Paddy Field',
    title: 'Monitor basal water line for Brown Planthopper nymphs',
    description: 'Part rice hills at 15 random locations to confirm absence of BPH hopperburn clustering.',
    dueDate: '2026-10-15T09:00:00.000Z',
    priority: 'low',
    completed: true,
    category: 'inspection',
    createdAt: new Date().toISOString()
  }
];

// Helper to safely read from localStorage
function readLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

// Helper to write to localStorage
function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Fields
  async getFields(userId: string = 'default_user'): Promise<Field[]> {
    const local = readLocal<Field[]>(STORAGE_KEYS.FIELDS, DEFAULT_INITIAL_FIELDS);
    
    // If online and authenticated with Firestore
    if (auth?.currentUser && db?.type) {
      try {
        const q = query(collection(db, 'fields'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteFields: Field[] = [];
          snapshot.forEach(docSnap => {
            remoteFields.push(docSnap.data() as Field);
          });
          // Update local cache
          writeLocal(STORAGE_KEYS.FIELDS, remoteFields);
          return remoteFields;
        }
      } catch (err) {
        console.warn('Firestore fetch fields fallback to local:', err);
      }
    }
    
    return local;
  },

  async saveField(field: Field): Promise<void> {
    const fields = await this.getFields(field.userId);
    const existingIndex = fields.findIndex(f => f.id === field.id);
    if (existingIndex >= 0) {
      fields[existingIndex] = { ...field, updatedAt: new Date().toISOString() };
    } else {
      fields.unshift(field);
    }
    writeLocal(STORAGE_KEYS.FIELDS, fields);

    // Sync to Firestore if authenticated
    if (auth?.currentUser && db?.type) {
      try {
        await setDoc(doc(db, 'fields', field.id), {
          ...field,
          userId: auth.currentUser.uid,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed to sync field to Firestore, stored locally:', err);
      }
    }
  },

  async deleteField(fieldId: string): Promise<void> {
    const fields = readLocal<Field[]>(STORAGE_KEYS.FIELDS, DEFAULT_INITIAL_FIELDS);
    const filtered = fields.filter(f => f.id !== fieldId);
    writeLocal(STORAGE_KEYS.FIELDS, filtered);

    if (auth?.currentUser && db?.type) {
      try {
        await deleteDoc(doc(db, 'fields', fieldId));
      } catch (err) {
        console.warn('Failed to delete field from Firestore:', err);
      }
    }
  },

  // Scans
  async getScans(userId: string = 'default_user'): Promise<ScanReport[]> {
    const local = readLocal<ScanReport[]>(STORAGE_KEYS.SCANS, DEFAULT_INITIAL_SCANS);

    if (auth?.currentUser && db?.type) {
      try {
        const q = query(collection(db, 'scans'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteScans: ScanReport[] = [];
          snapshot.forEach(docSnap => {
            remoteScans.push(docSnap.data() as ScanReport);
          });
          writeLocal(STORAGE_KEYS.SCANS, remoteScans);
          return remoteScans;
        }
      } catch (err) {
        console.warn('Firestore fetch scans fallback to local:', err);
      }
    }

    return local;
  },

  async saveScan(scan: ScanReport): Promise<void> {
    const scans = await this.getScans(scan.userId);
    const existingIndex = scans.findIndex(s => s.id === scan.id);
    if (existingIndex >= 0) {
      scans[existingIndex] = { ...scan, updatedAt: new Date().toISOString() };
    } else {
      scans.unshift(scan);
    }
    writeLocal(STORAGE_KEYS.SCANS, scans);

    // Also update parent field's last inspected date and recalculated risk score!
    if (scan.fieldId) {
      const fields = await this.getFields(scan.userId);
      const targetField = fields.find(f => f.id === scan.fieldId);
      if (targetField) {
        const fieldScans = scans.filter(s => s.fieldId === targetField.id);
        const risk = this.calculateRiskIntelligence(targetField, fieldScans);
        targetField.riskScore = risk.overallRiskScore;
        targetField.riskTier = risk.riskTier;
        targetField.lastInspected = new Date().toISOString().split('T')[0];
        targetField.updatedAt = new Date().toISOString();
        await this.saveField(targetField);
      }
    }

    // Sync to Firestore if authenticated
    if (auth?.currentUser && db?.type) {
      try {
        // Strip large base64 image from firestore doc if necessary, store metadata safely
        const payloadToSave = { ...scan, userId: auth.currentUser.uid };
        await setDoc(doc(db, 'scans', scan.id), payloadToSave);
      } catch (err) {
        console.warn('Failed to sync scan to Firestore, stored locally:', err);
      }
    }
  },

  async deleteScan(scanId: string): Promise<void> {
    const scans = readLocal<ScanReport[]>(STORAGE_KEYS.SCANS, DEFAULT_INITIAL_SCANS);
    const filtered = scans.filter(s => s.id !== scanId);
    writeLocal(STORAGE_KEYS.SCANS, filtered);

    if (auth?.currentUser && db?.type) {
      try {
        await deleteDoc(doc(db, 'scans', scanId));
      } catch (err) {
        console.warn('Failed to delete scan from Firestore:', err);
      }
    }
  },

  // Tasks
  async getTasks(userId: string = 'default_user'): Promise<MonitoringTask[]> {
    const local = readLocal<MonitoringTask[]>(STORAGE_KEYS.TASKS, DEFAULT_INITIAL_TASKS);
    return local;
  },

  async saveTask(task: MonitoringTask): Promise<void> {
    const tasks = await this.getTasks(task.userId);
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.unshift(task);
    }
    writeLocal(STORAGE_KEYS.TASKS, tasks);
  },

  async toggleTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      writeLocal(STORAGE_KEYS.TASKS, tasks);
    }
  },

  // NOVELTY 1: Pest Risk Intelligence Engine
  calculateRiskIntelligence(field: Field, fieldScans: ScanReport[]): RiskIntelligence {
    let score = 20; // baseline
    const contributingFactors: RiskIntelligence['contributingFactors'] = [];

    // 1. Image-based pest identification & latest severity
    const latestScan = fieldScans.length > 0
      ? [...fieldScans].sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime())[0]
      : null;

    if (latestScan && latestScan.pestPresent) {
      if (latestScan.severity === 'critical') {
        score += 45;
        contributingFactors.push({
          factor: 'Active Critical Pest Infestation',
          impact: 'high',
          description: `Latest scan detected ${latestScan.pestName} with critical defoliation/damage.`
        });
      } else if (latestScan.severity === 'high') {
        score += 35;
        contributingFactors.push({
          factor: 'High Severity Pest Observed',
          impact: 'high',
          description: `Observed high severity of ${latestScan.pestName} on ${latestScan.cropType}.`
        });
      } else if (latestScan.severity === 'moderate') {
        score += 20;
        contributingFactors.push({
          factor: 'Moderate Pest Feeding Detected',
          impact: 'medium',
          description: `Pest activity (${latestScan.pestName}) established; requires containment.`
        });
      } else {
        score += 8;
        contributingFactors.push({
          factor: 'Low Pest Activity Observed',
          impact: 'low',
          description: `Early trace of ${latestScan.pestName}; below economic threshold.`
        });
      }
    } else {
      contributingFactors.push({
        factor: 'No Active Severe Pest Detected',
        impact: 'low',
        description: 'Recent observations show low pest pressure.'
      });
    }

    // 2. Crop vulnerability based on Growth Stage
    if (field.growthStage === 'Flowering' || field.growthStage === 'Fruiting') {
      score += 18;
      contributingFactors.push({
        factor: 'High Stage Vulnerability',
        impact: 'high',
        description: `${field.growthStage} stage is highly sensitive to reproductive damage and yield loss.`
      });
    } else if (field.growthStage === 'Vegetative') {
      score += 12;
      contributingFactors.push({
        factor: 'Vegetative Canopy Growth',
        impact: 'medium',
        description: 'Tender succulent whorls and foliage attract early egg-laying moths and sucking pests.'
      });
    } else if (field.growthStage === 'Seedling') {
      score += 14;
      contributingFactors.push({
        factor: 'Seedling Vulnerability',
        impact: 'high',
        description: 'Seedlings have limited photosynthetic reserve to compensate for foliage loss.'
      });
    }

    // 3. Environmental conditions (weather from scans or notes)
    const weatherString = (latestScan?.weatherConditions || field.notes || '').toLowerCase();
    if (weatherString.includes('humid') || weatherString.includes('rain') || weatherString.includes('wet') || weatherString.includes('stagnant')) {
      score += 15;
      contributingFactors.push({
        factor: 'Moisture & Humidity Pressure',
        impact: 'medium',
        description: 'Warm humid conditions (>75% RH) accelerate insect fecundity and fungal co-infections.'
      });
    } else if (weatherString.includes('dry') || weatherString.includes('hot')) {
      score += 10;
      contributingFactors.push({
        factor: 'Thermal Stress & Sap Pests',
        impact: 'low',
        description: 'Warm dry conditions favor rapid multiplication of thrips and spider mites.'
      });
    }

    // 4. Historical Trend over multiple scans
    let trend: RiskIntelligence['historicalTrend'] = 'baseline';
    let comparisonText = 'Single scan on record for this field. Establishing baseline monitoring.';

    if (fieldScans.length >= 2) {
      const sorted = [...fieldScans].sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime());
      const severityWeights: Record<string, number> = { low: 1, moderate: 2, high: 3, critical: 4 };
      const currentWeight = severityWeights[sorted[0].severity] || 1;
      const prevWeight = severityWeights[sorted[1].severity] || 1;

      if (currentWeight > prevWeight) {
        trend = 'deteriorating';
        score += 12;
        comparisonText = `Severity escalated from ${sorted[1].severity} to ${sorted[0].severity} over the past observation period. Increased surveillance required.`;
      } else if (currentWeight < prevWeight) {
        trend = 'improving';
        score = Math.max(10, score - 15);
        comparisonText = `Severity decreased from ${sorted[1].severity} to ${sorted[0].severity}, indicating positive response to intervention.`;
      } else {
        trend = 'stable';
        comparisonText = `Pest pressure remains consistent at ${sorted[0].severity} severity across consecutive field scans.`;
      }
    }

    // Clamp score
    const clampedScore = Math.min(98, Math.max(5, score));

    // Determine Tier
    let riskTier: RiskTier = 'low';
    let inspectionFreq = 'Every 7-10 days';
    let nextDays = 7;

    if (clampedScore >= 75) {
      riskTier = 'severe';
      inspectionFreq = 'Every 24-48 hours (Daily Scouting)';
      nextDays = 2;
    } else if (clampedScore >= 50) {
      riskTier = 'elevated';
      inspectionFreq = 'Every 3-4 days';
      nextDays = 3;
    } else if (clampedScore >= 30) {
      riskTier = 'moderate';
      inspectionFreq = 'Every 5 days';
      nextDays = 5;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextDays);

    const prioritizedActions = [
      latestScan?.immediateActions?.[0] || 'Scout field diagonal to confirm pest distribution',
      clampedScore > 50
        ? 'Deploy pheromone / sticky monitoring traps at crop canopy height'
        : 'Maintain routine field hygiene and weed clearance',
      clampedScore > 70
        ? 'Contact local agricultural extension officer for on-site verification before economic threshold is exceeded'
        : 'Continue routine scheduled scouting'
    ];

    return {
      overallRiskScore: clampedScore,
      riskTier,
      contributingFactors,
      inspectionFrequency: inspectionFreq,
      nextInspectionDate: nextDate.toISOString().split('T')[0],
      prioritizedActions,
      historicalTrend: trend,
      historicalComparison: comparisonText
    };
  }
};
