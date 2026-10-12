import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Sprout, 
  FileText, 
  Info,
  Shield,
  HelpCircle,
  Eye
} from 'lucide-react';

export const TreatmentPlanner: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language];

  const [selectedCrop, setSelectedCrop] = useState('Maize');
  const [selectedSeverity, setSelectedSeverity] = useState('high');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DDE6D5] pb-6 space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
          Integrated Pest Management Hierarchy
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D35]">
          IPM Precision Treatment Planner
        </h1>
        <p className="text-sm text-gray-600">
          Sustainable, multi-tactic agronomic management hierarchy prioritized to minimize environmental impact and maximize natural control.
        </p>
      </div>

      {/* Regulatory Notice Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold">Important Pesticide Regulatory & Safety Notice</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            The guidance provided here represents generalized educational agronomic protocols. Chemical recommendations must comply with locally registered pesticide labels and state agricultural extension mandates. Never spray without proper Personal Protective Equipment (PPE) including chemical respirators, face shields, and chemical-resistant gloves. Always observe Pre-Harvest Intervals (PHI).
          </p>
        </div>
      </div>

      {/* 5-Pillar Strategy Cards */}
      <div className="space-y-6">
        
        {/* Pillar 1: Immediate Observation & Isolation */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center font-bold text-base">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#174D35]">Immediate Observation & Isolation</h3>
              <p className="text-xs text-gray-500">First 24-48 hours after detection</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Identify the spatial distribution of the infestation. Determine if the pest is isolated to field borders, windward hedgerows, or uniformly distributed. Mark affected perimeter flags and quarantine harvested equipment.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#F7F9F4]">
              <CheckCircle2 className="w-4 h-4 text-[#63A66A]" /> Flag infested hotspots to track boundary creep
            </li>
            <li className="flex items-center gap-2 p-2 rounded-lg bg-[#F7F9F4]">
              <CheckCircle2 className="w-4 h-4 text-[#63A66A]" /> Inspect adjacent host crops and wild weed reservoirs
            </li>
          </ul>
        </div>

        {/* Pillar 2: Mechanical & Physical Controls */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center font-bold text-base">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#174D35]">Mechanical & Physical Controls</h3>
              <p className="text-xs text-gray-500">Physical eradication without chemical residues</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
            <div className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] space-y-1">
              <span className="font-bold text-[#174D35] block">Hand-Picking & Pruning</span>
              <p className="text-gray-600">Manual destruction of conspicuous egg clusters and early instar gregarious caterpillars on small acreages.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] space-y-1">
              <span className="font-bold text-[#174D35] block">Pheromone & Light Trapping</span>
              <p className="text-gray-600">Deploy delta sticky traps baited with species-specific lures (Qlure, Gossyplure) for mass trapping and flight timing.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] space-y-1">
              <span className="font-bold text-[#174D35] block">Exclusion Netting</span>
              <p className="text-gray-600">Install 40-mesh insect-proof netting over nurseries and polyhouse ventilators to prevent adult entry.</p>
            </div>
          </div>
        </div>

        {/* Pillar 3: Cultural Practices */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center font-bold text-base">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#174D35]">Cultural & Agronomic Practices</h3>
              <p className="text-xs text-gray-500">Modifying habitat to disadvantage pest reproduction</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-start gap-2 bg-[#F7F9F4] p-3 rounded-xl border border-[#E1E8D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
              <span><strong>Synchronous Early Sowing:</strong> Plant concurrently with surrounding farms at rain onset to escape late-season pest multiplier generations.</span>
            </li>
            <li className="flex items-start gap-2 bg-[#F7F9F4] p-3 rounded-xl border border-[#E1E8D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
              <span><strong>Intercropping & Push-Pull:</strong> Companion planting with repellent crops (Desmodium, coriander) and attractant trap borders (Napier grass, marigold).</span>
            </li>
            <li className="flex items-start gap-2 bg-[#F7F9F4] p-3 rounded-xl border border-[#E1E8D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] shrink-0 mt-1.5" />
              <span><strong>Balanced Nutrition:</strong> Avoid excessive urea/nitrogen which produces soft succulent foliage highly favored by aphids, hoppers, and moths.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Biological Controls */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center font-bold text-base">
              4
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#174D35]">Biological Control Strategies</h3>
              <p className="text-xs text-gray-500">Natural enemies, parasitoids, and entomopathogens</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
            <div className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] space-y-1">
              <span className="font-bold text-[#174D35] block">Trichogramma Egg Parasitoids</span>
              <p className="text-gray-600">Release Tricho-cards (50,000 parasitoids/acre) at onset of moth flight to parasitize pest eggs before larval hatch.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] space-y-1">
              <span className="font-bold text-[#174D35] block">Entomopathogenic Fungi</span>
              <p className="text-gray-600">Apply Beauveria bassiana or Metarhizium anisopliae during high relative humidity or evening hours.</p>
            </div>
          </div>
        </div>

        {/* Pillar 5: Responsible Chemical Considerations */}
        <div className="bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base">
              5
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900">Responsible Chemical Considerations</h3>
              <p className="text-xs text-amber-700">Strictly when Economic Injury Threshold (ETL) is exceeded</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-2">
            <p className="font-semibold">Essential Chemical Guidelines & Safety Requirements:</p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Only deploy targeted, selective insect growth regulators (IGRs) or biorationals before synthetic broad-spectrum products.</li>
              <li>Always rotate insecticide IRAC mode-of-action groups to avoid pest resistance development.</li>
              <li>Strictly avoid spraying during active honeybee foraging periods (morning/mid-day bloom).</li>
              <li>Respect Pre-Harvest Intervals (PHI) to prevent export reject and consumer residue harm.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
