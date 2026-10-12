import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { SAMPLE_FIELD_IMAGES, SampleFieldImage } from '../data/sampleImages';
import { PestAnalysisResult, ScanReport, Field, GrowthStage, SeverityLevel } from '../types';
import { StorageService } from '../lib/storage';
import { 
  Upload, 
  Camera, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Download, 
  Save, 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Calendar, 
  Eye, 
  FileText,
  HelpCircle,
  X
} from 'lucide-react';

interface ScanWorkflowProps {
  fields: Field[];
  onScanSaved: (scan: ScanReport) => void;
  onGoToFields: () => void;
}

export const ScanWorkflow: React.FC<ScanWorkflowProps> = ({ fields, onScanSaved, onGoToFields }) => {
  const { user, language } = useAuth();
  const t = translations[language];

  // Form State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [cropType, setCropType] = useState<string>('Maize');
  const [cropVariety, setCropVariety] = useState<string>('');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || '');
  const [customFieldName, setCustomFieldName] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [weatherConditions, setWeatherConditions] = useState<string>('');

  // Processing & Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('Initializing vision pipeline...');
  const [analysisResult, setAnalysisResult] = useState<PestAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeIpmTab, setActiveIpmTab] = useState<'cultural' | 'mechanical' | 'biological' | 'chemical' | 'monitoring'>('cultural');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common crops list
  const cropOptions = [
    'Maize', 'Rice', 'Tomato', 'Cotton', 'Chilli', 'Brinjal', 
    'Wheat', 'Mango', 'Potato', 'Sugarcane', 'Soybean', 'Onion', 'Other'
  ];

  // Growth stages
  const growthStages: GrowthStage[] = [
    'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturation / Harvest'
  ];

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)/)) {
      setError('Please select a valid JPEG, PNG, or WebP image file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image exceeds 15MB size limit. Please upload a compressed photo.');
      return;
    }

    setError(null);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Quick load sample image
  const handleSelectSample = (sample: SampleFieldImage) => {
    setSelectedImage(sample.url);
    setImageMimeType('image/jpeg');
    setCropType(sample.crop);
    setCropVariety(sample.cropVariety);
    setGrowthStage(sample.growthStage);
    setSymptoms(sample.symptoms);
    setWeatherConditions(sample.weather);
    setError(null);
  };

  // Trigger AI Vision Analysis
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload or select a crop image before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setIsSaved(false);

    // Simulate progress updates for a reassuring UX
    setAnalysisProgress('Preprocessing image resolution & foliage color channels...');
    const timer1 = setTimeout(() => {
      setAnalysisProgress('Examining visible pest morphology & chewing patterns...');
    }, 1200);
    const timer2 = setTimeout(() => {
      setAnalysisProgress('Correlating growth stage vulnerability & IPM strategies...');
    }, 2800);

    try {
      const fieldObj = fields.find(f => f.id === selectedFieldId);
      const effectiveFieldName = fieldObj ? fieldObj.fieldName : (customFieldName || `${cropType} Plot`);

      const response = await fetch('/api/analyze-pest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          cropType,
          cropVariety,
          growthStage,
          fieldName: effectiveFieldName,
          symptoms,
          weatherConditions
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to complete vision analysis.');
      }

      setAnalysisResult(result.data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(err?.message || 'Vision analysis could not be completed. Please check your network connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save report to StorageService
  const handleSaveReport = async () => {
    if (!analysisResult || !selectedImage) return;

    const fieldObj = fields.find(f => f.id === selectedFieldId);
    const effectiveFieldName = fieldObj ? fieldObj.fieldName : (customFieldName || `${cropType} Plot`);

    const scanRecord: ScanReport = {
      ...analysisResult,
      id: `scan-${Date.now()}`,
      userId: user?.uid || 'default_user',
      fieldId: selectedFieldId || undefined,
      fieldName: effectiveFieldName,
      cropType,
      cropVariety,
      growthStage,
      scanDate: new Date().toISOString(),
      imageUrl: selectedImage,
      weatherConditions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveScan(scanRecord);
    setIsSaved(true);
    onScanSaved(scanRecord);
  };

  // Reset for new scan
  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsSaved(false);
    setSymptoms('');
  };

  // Print / Download report
  const handlePrint = () => {
    window.print();
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-900 border border-red-300">Critical Severity</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">High Severity</span>;
      case 'moderate':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">Moderate Severity</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Low Severity</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* If Result Available, Render Diagnostic Report */}
      {analysisResult ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DDE6D5] shadow-xs no-print">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#174D35] bg-[#F7F9F4] hover:bg-[#EEF2E6] border border-[#CADBCB] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.scanAnotherBtn}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>{t.downloadReportBtn}</span>
              </button>

              <button
                onClick={handleSaveReport}
                disabled={isSaved}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isSaved 
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#174D35] hover:bg-[#1f5e42] text-white shadow-xs'
                }`}
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Report Saved to Field' : t.saveReportBtn}</span>
              </button>
            </div>
          </div>

          {/* Expert Alert Banner if needed */}
          {analysisResult.expertVerificationNeeded && (
            <div className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">{t.expertRequired}</h4>
                <p className="text-xs text-amber-800">
                  Infestation levels or symptoms warrant physical confirmation by your local agricultural extension officer.
                </p>
                {analysisResult.expertVerificationTriggers?.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5 pt-1">
                    {analysisResult.expertVerificationTriggers.map((trig, i) => (
                      <li key={i}>{trig}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Inconclusive Warning if needed */}
          {analysisResult.isInconclusive && (
            <div className="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-500 text-blue-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Inconclusive Visual Evidence</h4>
                <p className="text-xs text-blue-800 mt-0.5">
                  {analysisResult.inconclusiveReason || 'The submitted image does not exhibit definitive pest morphological markers. Please capture a sharper close-up of the plant whorl or leaf underside.'}
                </p>
              </div>
            </div>
          )}

          {/* Main Two-Column Report Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Image and Pest Identity */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Image Preview */}
              <div className="bg-white rounded-2xl border border-[#DDE6D5] p-3 shadow-xs overflow-hidden">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-100 relative">
                  <img 
                    src={selectedImage!} 
                    alt="Analyzed crop specimen" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs">
                    {cropType} ({growthStage})
                  </div>
                </div>
              </div>

              {/* Identification Summary Card */}
              <div className="bg-white rounded-2xl border border-[#DDE6D5] p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#63A66A]">
                      {t.pestIdentified}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#174D35] mt-0.5">
                      {analysisResult.pestName}
                    </h3>
                    {analysisResult.scientificName && analysisResult.scientificName !== 'N/A' && (
                      <p className="text-xs text-gray-500 italic font-medium">
                        {analysisResult.scientificName}
                      </p>
                    )}
                  </div>
                  {getSeverityBadge(analysisResult.severity)}
                </div>

                {/* Confidence Bar */}
                <div className="bg-[#F7F9F4] p-3 rounded-xl border border-[#E1E8D9]">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-gray-700">{t.confidenceScore}</span>
                    <span className="font-bold text-[#174D35]">{analysisResult.confidenceScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className="h-full bg-[#174D35] rounded-full transition-all duration-500" 
                      style={{ width: `${analysisResult.confidenceScore}%` }} 
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                    {analysisResult.confidenceExplanation}
                  </p>
                </div>

                {/* Affected Plant Parts & Area */}
                <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-700">Affected Crop Parts: </span>
                    <span className="text-gray-600">
                      {analysisResult.affectedCropParts?.join(', ') || 'Foliage'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Approximate Damage Area: </span>
                    <span className="text-gray-600">
                      {analysisResult.approximateAffectedArea || 'Localized'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Differential Diagnoses / Alternatives */}
              {analysisResult.alternativePossibilities?.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#DDE6D5] p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#63A66A]" />
                    <span>{t.alternativePests}</span>
                  </h4>
                  <div className="space-y-2.5">
                    {analysisResult.alternativePossibilities.map((alt, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#F7F9F4] border border-[#E1E8D9] text-xs">
                        <div className="flex justify-between items-start font-semibold text-[#174D35]">
                          <span>{alt.name}</span>
                          <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                            {alt.likelihood} likelihood
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 italic">{alt.scientificName}</p>
                        <p className="text-[11px] text-gray-600 mt-1">
                          <strong className="text-gray-700">Distinction:</strong> {alt.distinguishingFeature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Evidence, Actions & IPM Planner */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Novelty 3: Explainable Visual Evidence */}
              <div className="bg-white rounded-2xl border border-[#DDE6D5] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#E5F0E7] text-[#174D35]">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#174D35]">{t.observableEvidence}</h4>
                    <p className="text-[11px] text-gray-500">Transparent visual features detected in the specimen photo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {analysisResult.observableEvidence?.map((ev, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#63A66A] shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700 leading-snug">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Actions (24-48h) */}
              <div className="bg-white rounded-2xl border border-[#DDE6D5] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#174D35]">{t.immediateActions}</h4>
                    <p className="text-[11px] text-gray-500">Priority intervention steps to arrest immediate damage</p>
                  </div>
                </div>

                <ul className="space-y-2 pt-1">
                  {analysisResult.immediateActions?.map((act, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950 font-medium">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Integrated Pest Management (IPM) 5-Pillar Tabs */}
              <div className="bg-white rounded-2xl border border-[#DDE6D5] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#174D35]">{t.ipmPlanner}</h4>
                    <p className="text-[11px] text-gray-500">Sustainable multi-tactic agronomic management hierarchy</p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#63A66A]" />
                </div>

                {/* Tab selector */}
                <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setActiveIpmTab('cultural')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeIpmTab === 'cultural' ? 'bg-[#174D35] text-white' : 'bg-[#F7F9F4] text-gray-600 hover:bg-[#EEF2E6]'
                    }`}
                  >
                    Cultural
                  </button>
                  <button
                    onClick={() => setActiveIpmTab('mechanical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeIpmTab === 'mechanical' ? 'bg-[#174D35] text-white' : 'bg-[#F7F9F4] text-gray-600 hover:bg-[#EEF2E6]'
                    }`}
                  >
                    Mechanical
                  </button>
                  <button
                    onClick={() => setActiveIpmTab('biological')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeIpmTab === 'biological' ? 'bg-[#174D35] text-white' : 'bg-[#F7F9F4] text-gray-600 hover:bg-[#EEF2E6]'
                    }`}
                  >
                    Biological
                  </button>
                  <button
                    onClick={() => setActiveIpmTab('chemical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeIpmTab === 'chemical' ? 'bg-[#174D35] text-white' : 'bg-[#F7F9F4] text-gray-600 hover:bg-[#EEF2E6]'
                    }`}
                  >
                    Chemical
                  </button>
                  <button
                    onClick={() => setActiveIpmTab('monitoring')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      activeIpmTab === 'monitoring' ? 'bg-[#174D35] text-white' : 'bg-[#F7F9F4] text-gray-600 hover:bg-[#EEF2E6]'
                    }`}
                  >
                    Scouting
                  </button>
                </div>

                {/* Tab content */}
                <div className="pt-1">
                  {activeIpmTab === 'cultural' && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 italic">Adjusting agronomic practices, planting dates, and crop nutrition.</p>
                      <ul className="space-y-1.5">
                        {analysisResult.ipmRecommendations?.cultural?.map((c, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeIpmTab === 'mechanical' && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 italic">Physical traps, hand picking, barriers, and soil solarization.</p>
                      <ul className="space-y-1.5">
                        {analysisResult.ipmRecommendations?.mechanical?.map((m, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeIpmTab === 'biological' && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 italic">Conserving and introducing beneficial parasitoids, predators, and bio-fungi.</p>
                      <ul className="space-y-1.5">
                        {analysisResult.ipmRecommendations?.biological?.map((b, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeIpmTab === 'chemical' && (
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                        <strong>Regulatory Notice:</strong> Chemical applications are recommended strictly when population exceeds Economic Threshold Levels (ETL). Always verify local approved pesticide registrations, wear personal protective equipment (PPE), and respect Pre-Harvest Intervals (PHI).
                      </div>
                      <ul className="space-y-1.5">
                        {analysisResult.ipmRecommendations?.chemical?.map((ch, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E68A19] shrink-0 mt-1.5" />
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeIpmTab === 'monitoring' && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 italic">Scheduled scouting patterns and trap catch assessment criteria.</p>
                      <ul className="space-y-1.5">
                        {analysisResult.ipmRecommendations?.monitoring?.map((mo, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
                            <span>{mo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Preventive Measures for Next Cycle */}
              {analysisResult.preventiveMeasures?.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#DDE6D5] p-6 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    {t.preventiveMeasures}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {analysisResult.preventiveMeasures.map((prev, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#63A66A] shrink-0 mt-0.5" />
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* SCAN INPUT FORM */
        <div className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-[#174D35]">{t.scanTitle}</h2>
            <p className="text-sm text-gray-600">{t.scanSubtitle}</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Samples Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#63A66A]" />
                <span>{t.sampleImagesTitle}</span>
              </h3>
              <span className="text-[11px] text-gray-500">Click any card to preload</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {SAMPLE_FIELD_IMAGES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all hover:border-[#63A66A] hover:shadow-xs group ${
                    selectedImage === sample.url ? 'border-[#174D35] bg-[#EBF4ED] ring-2 ring-[#63A66A]' : 'border-gray-200 bg-[#F7F9F4]'
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img 
                      src={sample.url} 
                      alt={sample.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <p className="text-[11px] font-bold text-[#174D35] truncate">{sample.crop}</p>
                  <p className="text-[10px] text-gray-500 truncate">{sample.expectedPest.split('(')[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Upload & Crop Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Image Upload Box */}
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#174D35]">
                Crop Specimen Image *
              </label>

              {!selectedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#CADBCB] hover:border-[#63A66A] rounded-2xl p-8 bg-white text-center cursor-pointer transition-all hover:bg-[#FAFBF8] flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E5F0E7] flex items-center justify-center text-[#174D35] mb-4">
                    <Upload className="w-8 h-8 text-[#63A66A]" />
                  </div>
                  <h4 className="text-base font-bold text-[#174D35] mb-1">
                    {t.dragDropText}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">{t.supportedFormats}</p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-semibold shadow-xs">
                    <Camera className="w-4 h-4 text-[#63A66A]" />
                    <span>Upload or Take Photo</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#DDE6D5] p-4 shadow-xs space-y-3">
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-100 relative group">
                    <img 
                      src={selectedImage} 
                      alt="Selected crop specimen" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#174D35] text-xs font-semibold shadow-sm flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t.changeImage}</span>
                      </button>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.removeImage}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Photo attached & ready for analysis</span>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Right: Crop Details & Agronomic Context Form */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] border-b border-gray-100 pb-2">
                Field Context & Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Crop Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t.selectCrop} *
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A] bg-white"
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                {/* Growth Stage */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t.growthStage} *
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A] bg-white"
                  >
                    {growthStages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Crop Variety (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.cropVariety}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pioneer 3396, Arka Rakshak, BPT 5204"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                />
              </div>

              {/* Assign to Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Assign to Field Plot
                </label>
                {fields.length > 0 ? (
                  <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A] bg-white"
                  >
                    <option value="">-- Enter Custom Field Name Below --</option>
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>{f.fieldName} ({f.crop})</option>
                    ))}
                  </select>
                ) : null}

                {!selectedFieldId && (
                  <input
                    type="text"
                    placeholder="Enter new field name (e.g. Sector 3 South Plot)"
                    value={customFieldName}
                    onChange={(e) => setCustomFieldName(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                  />
                )}
              </div>

              {/* Visible Symptoms */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.symptomsObserved}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.symptomsPlaceholder}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                />
              </div>

              {/* Weather Conditions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.weatherConditions}
                </label>
                <input
                  type="text"
                  placeholder={t.weatherPlaceholder}
                  value={weatherConditions}
                  onChange={(e) => setWeatherConditions(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                />
              </div>

              {/* Submit Analysis Button */}
              <div className="pt-2">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-[#174D35] hover:bg-[#1f5e42] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5 text-[#63A66A]" />
                  <span>{isAnalyzing ? 'Running AI Vision Analysis...' : t.analyzeBtn}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Analysis Modal / Progress Overlay */}
          {isAnalyzing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center mx-auto relative animate-pulse">
                  <Sparkles className="w-8 h-8 text-[#63A66A]" />
                </div>
                <h3 className="text-lg font-bold text-[#174D35]">{t.analyzingText}</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {analysisProgress}
                </p>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#174D35] rounded-full animate-indeterminate" style={{ width: '75%' }} />
                </div>
                <p className="text-[11px] text-gray-400">
                  Secure server-side diagnostic · Neural Vision Engine
                </p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
