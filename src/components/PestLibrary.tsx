import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { PEST_LIBRARY_DATA } from '../data/pestLibraryData';
import { PestLibraryItem } from '../types';
import { 
  Search, 
  Filter, 
  BookOpen, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Bug, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Leaf, 
  ExternalLink 
} from 'lucide-react';

export const PestLibrary: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPest, setSelectedPest] = useState<PestLibraryItem | null>(null);

  const cropsFilterList = ['All', 'Rice', 'Tomato', 'Cotton', 'Maize', 'Chilli', 'Brinjal'];
  const categoriesFilterList = ['All', 'Caterpillar / Borer', 'Piercing-Sucking', 'Fly / Miner'];

  const filteredPests = PEST_LIBRARY_DATA.filter((pest) => {
    const matchesSearch = 
      pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.affectedCrops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCrop = selectedCrop === 'All' || pest.affectedCrops.includes(selectedCrop);
    const matchesCategory = selectedCategory === 'All' || pest.category.includes(selectedCategory);

    return matchesSearch && matchesCrop && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#DDE6D5] pb-6 space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
          Agronomic Reference Database
        </span>
        <h1 className="text-3xl font-extrabold text-[#174D35]">
          Agricultural Pest Knowledge Library
        </h1>
        <p className="text-sm text-gray-600">
          Curated entomological reference profiles, identification keys, life cycles, and IPM protocols.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by common pest name, scientific taxon, or crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
            />
          </div>

          {/* Crop Filter */}
          <div className="shrink-0 sm:w-44">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white"
            >
              {cropsFilterList.map(c => (
                <option key={c} value={c}>Crop: {c}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="shrink-0 sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white"
            >
              {categoriesFilterList.map(cat => (
                <option key={cat} value={cat}>Pest Class: {cat}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Results counter */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
          <span>Showing <strong>{filteredPests.length}</strong> validated agricultural pest references</span>
          {(searchTerm || selectedCrop !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCrop('All');
                setSelectedCategory('All');
              }}
              className="text-[#174D35] font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Pest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPests.map((pest) => (
          <div
            key={pest.id}
            onClick={() => setSelectedPest(pest)}
            className="bg-white rounded-2xl border border-[#DDE6D5] overflow-hidden shadow-xs hover:border-[#63A66A] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-16/10 bg-gray-100 overflow-hidden relative">
                <img
                  src={pest.imageUrl}
                  alt={pest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-800 backdrop-blur-xs border border-white/50">
                    {pest.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-[#174D35] group-hover:text-[#216143]">
                    {pest.name}
                  </h3>
                  <p className="text-xs text-gray-500 italic font-medium">{pest.scientificName}</p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {pest.affectedCrops.map((crop, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E5F0E7] text-[#174D35]">
                      {crop}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
                  {pest.damageType} · {pest.typicalDamageSymptoms[0]}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#174D35] font-bold">
              <span>View Full IPM Profile</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pest Detail Modal */}
      {selectedPest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            
            <button
              onClick={() => setSelectedPest(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                {selectedPest.category}
              </span>
              <h2 className="text-2xl font-black text-[#174D35]">{selectedPest.name}</h2>
              <p className="text-sm text-gray-500 italic font-medium">{selectedPest.scientificName}</p>
            </div>

            {/* Affected Crops */}
            <div>
              <span className="text-xs font-bold text-gray-700 block mb-1">Host Crops:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPest.affectedCrops.map((c, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#E5F0E7] text-[#174D35] text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Identification Features */}
            <div className="bg-[#F7F9F4] p-4 rounded-xl border border-[#E1E8D9] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#174D35]">
                Key Morphological Identification Markers
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {selectedPest.keyIdentificationFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#63A66A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Life Cycle & Favorable Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-700 block">Life Cycle Summary</span>
                <p className="text-gray-600 leading-relaxed">{selectedPest.lifeCycleSummary}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="font-bold text-gray-700 block">Favorable Environmental Conditions</span>
                <p className="text-gray-600 leading-relaxed">{selectedPest.favorableConditions}</p>
              </div>
            </div>

            {/* 4-Pillar IPM Strategy */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#63A66A]" />
                <span>Integrated Pest Management (IPM) Protocols</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="font-bold text-[#174D35]">1. Cultural Practices:</span>
                  <p className="text-gray-600">{selectedPest.ipmOptions.cultural.join(' · ')}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="font-bold text-[#174D35]">2. Mechanical & Physical:</span>
                  <p className="text-gray-600">{selectedPest.ipmOptions.mechanical.join(' · ')}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="font-bold text-[#174D35]">3. Biological Controls:</span>
                  <p className="text-gray-600">{selectedPest.ipmOptions.biological.join(' · ')}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900">4. Responsible Chemical Considerations:</span>
                  <p className="text-amber-950">{selectedPest.ipmOptions.chemical.join(' · ')}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedPest(null)}
                className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#1f5e42]"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
