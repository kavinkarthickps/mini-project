import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { Field, ScanReport, GrowthStage } from '../types';
import { StorageService } from '../lib/storage';
import { 
  Activity, 
  MapPin, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Eye, 
  Layers, 
  Info,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  X
} from 'lucide-react';

interface FieldIntelligenceProps {
  fields: Field[];
  scans: ScanReport[];
  selectedField: Field | null;
  onSelectField: (field: Field) => void;
  onRefreshFields: () => void;
  onNewScanForField: (field: Field) => void;
}

export const FieldIntelligence: React.FC<FieldIntelligenceProps> = ({
  fields,
  scans,
  selectedField,
  onSelectField,
  onRefreshFields,
  onNewScanForField
}) => {
  const { user, language } = useAuth();
  const t = translations[language];

  const [activeField, setActiveField] = useState<Field>(selectedField || fields[0] || {} as Field);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New field modal state
  const [newFieldName, setNewFieldName] = useState('');
  const [newCrop, setNewCrop] = useState('Maize');
  const [newVariety, setNewVariety] = useState('');
  const [newGrowthStage, setNewGrowthStage] = useState<GrowthStage>('Vegetative');
  const [newAcreage, setNewAcreage] = useState('2.5');
  const [newLocation, setNewLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Scans for the active field
  const fieldScans = scans.filter(s => s.fieldId === activeField.id || s.fieldName === activeField.fieldName);
  const sortedFieldScans = [...fieldScans].sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime());

  // Compute Novelty 1: Pest Risk Intelligence
  const riskIntel = activeField.id 
    ? StorageService.calculateRiskIntelligence(activeField, fieldScans)
    : null;

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    const newField: Field = {
      id: `field-${Date.now()}`,
      userId: user?.uid || 'default_user',
      fieldName: newFieldName.trim(),
      crop: newCrop,
      cropVariety: newVariety.trim() || undefined,
      growthStage: newGrowthStage,
      acreage: parseFloat(newAcreage) || 1,
      location: newLocation.trim() || undefined,
      plantingDate: new Date().toISOString().split('T')[0],
      notes: newNotes.trim() || undefined,
      riskScore: 25,
      riskTier: 'low',
      lastInspected: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveField(newField);
    setIsAddModalOpen(false);
    onRefreshFields();
    setActiveField(newField);
  };

  const handleDeleteField = async (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field plot?')) {
      await StorageService.deleteField(fieldId);
      onRefreshFields();
      if (activeField.id === fieldId && fields.length > 1) {
        setActiveField(fields.find(f => f.id !== fieldId)!);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE6D5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
            Precision Farming Analytics
          </span>
          <h1 className="text-3xl font-extrabold text-[#174D35] mt-1">
            {t.navIntelligence} & Field Progression
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Correlate crop vulnerability, growth stages, environmental stress, and multi-scan timelines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#174D35] hover:bg-[#1f5e42] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#63A66A]" />
          <span>Add New Field Plot</span>
        </button>
      </div>

      {/* Field Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {fields.map((field) => (
          <button
            key={field.id}
            onClick={() => {
              setActiveField(field);
              onSelectField(field);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
              activeField.id === field.id
                ? 'bg-[#174D35] text-white border-[#174D35] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#63A66A]" />
            <span>{field.fieldName}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
              field.riskTier === 'severe' ? 'bg-red-500 text-white' :
              field.riskTier === 'elevated' ? 'bg-amber-500 text-white' :
              field.riskTier === 'moderate' ? 'bg-yellow-500 text-black' :
              'bg-[#63A66A] text-white'
            }`}>
              {field.riskTier}
            </span>
          </button>
        ))}
      </div>

      {activeField.id && riskIntel && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Active Field Details Bar */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#174D35]">{activeField.fieldName}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#E5F0E7] text-[#174D35]">
                  {activeField.crop} {activeField.cropVariety ? `(${activeField.cropVariety})` : ''}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Growth Stage: <strong>{activeField.growthStage}</strong> · Area: <strong>{activeField.acreage || 1} Acres</strong> · Location: <strong>{activeField.location || 'Standard Plot'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNewScanForField(activeField)}
                className="px-3.5 py-2 rounded-xl bg-[#63A66A] hover:bg-[#72b579] text-[#174D35] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Scan This Field</span>
              </button>
              <button
                onClick={() => handleDeleteField(activeField.id)}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                title="Delete Field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* NOVELTY 1: PEST RISK INTELLIGENCE ENGINE DASHBOARD */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                  Novelty Innovation 1
                </span>
                <h3 className="text-xl font-extrabold text-[#174D35] flex items-center gap-2 mt-0.5">
                  <Activity className="w-5 h-5 text-[#63A66A]" />
                  <span>Pest Risk Intelligence Engine</span>
                </h3>
              </div>
              <div className="text-xs text-gray-500">
                Four-parameter synthesis: Pest Visuals + Growth Stage + Weather + History
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Risk Gauge & Tier */}
              <div className="lg:col-span-4 bg-[#F7F9F4] p-6 rounded-2xl border border-[#E1E8D9] text-center space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {t.riskScore}
                </p>

                <div className="relative inline-flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${
                    riskIntel.riskTier === 'severe' ? 'border-red-500 bg-red-50 text-red-900' :
                    riskIntel.riskTier === 'elevated' ? 'border-amber-500 bg-amber-50 text-amber-900' :
                    riskIntel.riskTier === 'moderate' ? 'border-yellow-500 bg-yellow-50 text-yellow-900' :
                    'border-emerald-500 bg-emerald-50 text-emerald-900'
                  }`}>
                    <span className="text-3xl font-black">{riskIntel.overallRiskScore}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Index / 100</span>
                  </div>
                </div>

                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    riskIntel.riskTier === 'severe' ? 'bg-red-600 text-white' :
                    riskIntel.riskTier === 'elevated' ? 'bg-amber-600 text-white' :
                    riskIntel.riskTier === 'moderate' ? 'bg-yellow-500 text-black' :
                    'bg-[#174D35] text-white'
                  }`}>
                    {riskIntel.riskTier} Risk Level
                  </span>
                  <p className="text-[11px] text-gray-500 mt-2 font-medium">
                    Inspection Schedule: <strong>{riskIntel.inspectionFrequency}</strong>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Next Scouting Date: <strong>{riskIntel.nextInspectionDate}</strong>
                  </p>
                </div>
              </div>

              {/* Factors Contributing to Risk */}
              <div className="lg:col-span-8 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {t.contributingFactors}
                </h4>

                <div className="space-y-2.5">
                  {riskIntel.contributingFactors.map((factor, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-[#174D35] block">
                          {factor.factor}
                        </span>
                        <p className="text-xs text-gray-600 leading-snug">
                          {factor.description}
                        </p>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                        factor.impact === 'high' ? 'bg-red-100 text-red-800' :
                        factor.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {factor.impact} impact
                      </span>
                    </div>
                  ))}
                </div>

                {/* Prioritized Actions */}
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Prioritized Field Recommendations
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {riskIntel.prioritizedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#63A66A] shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* NOVELTY 2: PEST PROGRESSION TIMELINE */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                  Novelty Innovation 2
                </span>
                <h3 className="text-xl font-extrabold text-[#174D35] flex items-center gap-2 mt-0.5">
                  <Clock className="w-5 h-5 text-[#63A66A]" />
                  <span>Pest Progression Timeline</span>
                </h3>
              </div>
              <div className="text-xs text-gray-500">
                {sortedFieldScans.length} dated observations for {activeField.fieldName}
              </div>
            </div>

            {/* Optical Condition Transparency Notice */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Optical Comparison Notice:</strong> Crop observations are captured in open field conditions. Variation in ambient sunlight, camera angle, leaf moisture, and focal distance may influence visual damage comparisons between dates.
              </p>
            </div>

            {/* Historical delta indicator */}
            <div className="p-4 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#174D35] block">Historical Field Trend:</span>
                <p className="text-xs text-gray-600 mt-0.5">{riskIntel.historicalComparison}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                riskIntel.historicalTrend === 'improving' ? 'bg-emerald-100 text-emerald-800' :
                riskIntel.historicalTrend === 'deteriorating' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {riskIntel.historicalTrend}
              </span>
            </div>

            {/* Chronological Timeline Cards */}
            {sortedFieldScans.length > 0 ? (
              <div className="relative pl-6 space-y-6 border-l-2 border-[#DDE6D5]">
                {sortedFieldScans.map((scan, idx) => (
                  <div key={scan.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-[#174D35] border-4 border-white shadow-xs" />

                    <div className="bg-[#F7F9F4] p-5 rounded-2xl border border-[#E1E8D9] hover:border-[#63A66A] transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      
                      <div className="md:col-span-3">
                        <img 
                          src={scan.imageUrl} 
                          alt={scan.pestName} 
                          className="w-full aspect-4/3 rounded-xl object-cover bg-gray-100" 
                        />
                      </div>

                      <div className="md:col-span-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-semibold">
                            {new Date(scan.scanDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-gray-600 border border-gray-200">
                            {scan.growthStage}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#174D35]">{scan.pestName}</h4>
                        <p className="text-xs text-gray-600 leading-snug">
                          {scan.observableEvidence?.[0] || 'Visual foliage damage observed.'}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Affected Area: {scan.approximateAffectedArea || 'Foliar canopy'}
                        </p>
                      </div>

                      <div className="md:col-span-3 text-right space-y-2">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          scan.severity === 'critical' ? 'bg-red-100 text-red-900 border border-red-200' :
                          scan.severity === 'high' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          scan.severity === 'moderate' ? 'bg-yellow-100 text-yellow-900 border border-yellow-200' :
                          'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          {scan.severity} Severity
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Confidence: <strong>{scan.confidenceScore}%</strong>
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#F7F9F4] rounded-2xl border border-dashed border-gray-300">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No Historical Scans For This Plot Yet</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Scan recurring images of this plot across subsequent growth stages to populate the progression timeline.
                </p>
                <button
                  onClick={() => onNewScanForField(activeField)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#1f5e42] cursor-pointer"
                >
                  Create First Field Scan
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Add Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#174D35]">Create New Agricultural Field</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Field / Plot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Canal Plot #4"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Crop Type *</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Rice">Rice</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Brinjal">Brinjal</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Mango">Mango</option>
                    <option value="Potato">Potato</option>
                    <option value="Sugarcane">Sugarcane</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Growth Stage</label>
                  <select
                    value={newGrowthStage}
                    onChange={(e) => setNewGrowthStage(e.target.value as GrowthStage)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Maturation / Harvest">Maturation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Crop Variety (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pioneer 3396"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Acreage</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAcreage}
                    onChange={(e) => setNewAcreage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Location Coordinates or Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. North Sector, Grid 4A"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  placeholder="Soil type, irrigation method, previous crop rotation..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#174D35] text-white font-bold hover:bg-[#1f5e42]"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
