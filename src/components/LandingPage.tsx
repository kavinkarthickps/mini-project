import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { 
  Scan, 
  Sprout, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Clock, 
  Compass, 
  Search, 
  Activity, 
  Leaf, 
  TrendingUp, 
  FileText,
  Smartphone,
  Eye,
  Check,
  Camera
} from 'lucide-react';

interface LandingPageProps {
  onStartScan: () => void;
  onStartLiveCamera?: () => void;
  onExploreLibrary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartScan, onStartLiveCamera, onExploreLibrary }) => {
  const { language } = useAuth();
  const t = translations[language];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const supportedCrops = [
    { name: 'Rice / Paddy', category: 'Cereal', icon: '🌾', description: 'Brown planthopper, stem borer, leaf folder, blast' },
    { name: 'Tomato', category: 'Vegetable', icon: '🍅', description: 'Tuta absoluta leafminer, whitefly, fruit borer' },
    { name: 'Cotton', category: 'Fiber', icon: '🌱', description: 'Pink bollworm, American bollworm, whitefly, aphids' },
    { name: 'Maize / Corn', category: 'Cereal', icon: '🌽', description: 'Fall armyworm, shoot fly, stem borer' },
    { name: 'Wheat', category: 'Cereal', icon: '🌾', description: 'Aphids, armyworm, rust, shoot borer' },
    { name: 'Chilli & Pepper', category: 'Vegetable', icon: '🌶️', description: 'Chilli thrips, yellow mite, fruit borer, anthracnose' },
    { name: 'Brinjal / Eggplant', category: 'Vegetable', icon: '🍆', description: 'Shoot & fruit borer, jassids, epilachna beetle' },
    { name: 'Mango', category: 'Fruit', icon: '🥭', description: 'Mango leaf hopper, fruit fly, shoot gall psylla' },
  ];

  const faqs = [
    {
      q: 'How does PestGuard AI distinguish between pests and general crop diseases?',
      a: 'PestGuard AI uses advanced multi-modal vision models trained to recognize morphological pest characteristics (larval markings, head capsules, wing venation, honeydew frass) as well as characteristic feeding damage patterns (shot-holes, windowing, blotch mines) rather than solely relying on leaf discoloration.'
    },
    {
      q: 'What should I do if the AI analysis result is marked "Inconclusive"?',
      a: 'Inconclusive results are transparently declared when an image is blurred, taken from excessive distance, or lacks definitive visual evidence. In such cases, capture a sharp close-up photo in indirect daylight focusing on the central whorl, leaf underside, or insect directly.'
    },
    {
      q: 'Does the application recommend chemical pesticides?',
      a: 'PestGuard AI adheres to the Integrated Pest Management (IPM) hierarchy. Mechanical, cultural, and biological solutions are prioritized first. When chemical measures are mentioned for severe outbreaks exceeding economic thresholds, generic active ingredient classes are highlighted alongside safety warnings, pre-harvest intervals (PHI), and requirements to comply with local agricultural regulations.'
    },
    {
      q: 'Can field technicians use this offline in remote rural fields?',
      a: 'Yes. PestGuard AI features offline-first local persistence and background syncing. Technicians can record field observations and save images locally, which will automatically sync to Cloud Firestore when an internet connection is re-established.'
    },
    {
      q: 'What is the Pest Risk Intelligence Engine?',
      a: 'Unlike standard single-image classifiers, our Risk Intelligence Engine correlates four critical factors: the identified pest, crop growth stage vulnerability, local weather conditions (humidity/temperature), and historical field scan trends to compute actionable field risk tiers and suggested scouting intervals.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1F2923]">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E1E8D9]">
        {/* Soft decorative background accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E3EFE5] blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#EBF4DC] blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline and Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5F0E7] text-[#174D35] text-xs font-semibold border border-[#C5DEC8]">
                <Sparkles className="w-3.5 h-3.5 text-[#63A66A]" />
                <span>Precision AI Vision Agronomic Diagnostic</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#174D35] leading-[1.12]">
                {t.heroHeadline}
              </h1>

              <p className="text-lg sm:text-xl text-[#3D4F44] max-w-2xl font-normal leading-relaxed">
                {t.heroSubtext}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onStartScan}
                  className="px-6 py-3.5 rounded-xl font-semibold text-white bg-[#174D35] hover:bg-[#1f5e42] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <Scan className="w-5 h-5 text-[#63A66A]" />
                  <span>{t.scanCropBtn}</span>
                </button>
                {onStartLiveCamera && (
                  <button
                    onClick={onStartLiveCamera}
                    className="px-6 py-3.5 rounded-xl font-semibold text-[#174D35] bg-[#E5F0E7] hover:bg-[#d8ebd9] border border-[#A3C9A8] shadow-xs transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-[#174D35]" />
                    <span>Live Camera Scan</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-black">Live</span>
                  </button>
                )}
                <a
                  href="#how-it-works"
                  className="px-5 py-3.5 rounded-xl font-semibold text-gray-700 bg-white hover:bg-[#EEF2E6] border border-[#CADBCB] shadow-xs transition-all flex items-center justify-center gap-1.5 text-base text-center"
                >
                  <span>{t.exploreBtn}</span>
                  <ChevronRight className="w-4 h-4 text-[#63A66A]" />
                </a>
              </div>

              {/* Three Value Propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#DDE6D5]">
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#E1E8D9]">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#174D35] mb-1">
                    <Scan className="w-4 h-4 text-[#63A66A]" />
                    <span>{t.valueProp1Title}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-snug">{t.valueProp1Desc}</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#E1E8D9]">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#174D35] mb-1">
                    <TrendingUp className="w-4 h-4 text-[#63A66A]" />
                    <span>{t.valueProp2Title}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-snug">{t.valueProp2Desc}</p>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#E1E8D9]">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#174D35] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#63A66A]" />
                    <span>{t.valueProp3Title}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-snug">{t.valueProp3Desc}</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual with Floating Pest Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Photograph */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 group">
                  <img
                    src="https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=1000&q=80"
                    alt="Agricultural crop inspection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle scanning target reticle */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                      Maize Whorl · Visual Feature Extraction
                    </span>
                  </div>
                </div>

                {/* Floating Analysis Card */}
                <div className="absolute -bottom-8 -left-4 sm:-left-6 right-4 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-[#DDE6D5] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
                          Identified Pest
                        </span>
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-[#174D35]">
                        Fall Armyworm
                      </h4>
                      <p className="text-[11px] text-gray-500 italic">Spodoptera frugiperda</p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        High Severity
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1">25-35% foliar loss</p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">Illustrative Confidence</span>
                      <span className="text-[#174D35] font-bold">94%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-[#174D35] rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  {/* Evidence tag */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#63A66A]" /> Inverted "Y" head suture verified
                    </span>
                    <span className="text-[#174D35] font-semibold hover:underline cursor-pointer" onClick={onStartScan}>
                      Run Test →
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#E1E8D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#174D35] mt-2">
              From Field Photo to Actionable Protection Plan
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              Engineered for swift diagnostics in the field, eliminating uncertainty with clear visual evidence and targeted recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-[#F7F9F4] p-8 rounded-2xl border border-[#E1E8D9] relative flex flex-col justify-between hover:border-[#63A66A] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#174D35] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-xs">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#174D35] mb-2">
                  Capture or Upload Photo
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Take a photo of the affected leaf, stem, or visible insect directly from your mobile camera or upload an existing JPEG/PNG.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E1E8D9] text-xs font-semibold text-[#63A66A] flex items-center gap-1">
                <span>JPEG, PNG, WebP supported</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F7F9F4] p-8 rounded-2xl border border-[#E1E8D9] relative flex flex-col justify-between hover:border-[#63A66A] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#63A66A] text-[#174D35] flex items-center justify-center font-bold text-lg mb-6 shadow-xs">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#174D35] mb-2">
                  AI Vision Analysis
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The deep vision model examines insect anatomy, feeding perforations, frass, and crop vulnerability to deliver structured findings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E1E8D9] text-xs font-semibold text-[#63A66A] flex items-center gap-1">
                <span>Taxonomic classification & severity</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F7F9F4] p-8 rounded-2xl border border-[#E1E8D9] relative flex flex-col justify-between hover:border-[#63A66A] transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#174D35] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-xs">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#174D35] mb-2">
                  Execute IPM & Monitor Field
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Review 5-pillar Integrated Pest Management options, schedule follow-up scouting, and track progression over time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E1E8D9] text-xs font-semibold text-[#63A66A] flex items-center gap-1">
                <span>Preserve harvest & cut pesticide costs</span>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onStartScan}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#174D35] hover:bg-[#1f5e42] shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Scan className="w-5 h-5 text-[#63A66A]" />
              <span>Start Diagnostic Scan Now</span>
            </button>
          </div>

        </div>
      </section>

      {/* THREE UNIQUE NOVELTY INNOVATIONS SECTION */}
      <section className="py-20 bg-[#F7F9F4] border-b border-[#E1E8D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
              Distinctive Innovations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#174D35] mt-2">
              Beyond Basic Image Classification
            </h2>
            <p className="text-gray-600 mt-3 text-base">
              PestGuard AI provides multi-variable context modeling, historical progression tracking, and transparent explainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Novelty 1 */}
            <div className="bg-white p-7 rounded-2xl border border-[#DDE6D5] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center mb-5">
                <Activity className="w-6 h-6 text-[#174D35]" />
              </div>
              <h3 className="text-xl font-bold text-[#174D35] mb-2">
                Pest Risk Intelligence Engine
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Synthesizes 4 distinct inputs: image pest findings, crop growth stage vulnerability, local weather, and previous field history to generate actionable field risk scores and scouting intervals.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Dynamic inspection frequencies
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Crop stage vulnerability weighting
                </li>
              </ul>
            </div>

            {/* Novelty 2 */}
            <div className="bg-white p-7 rounded-2xl border border-[#DDE6D5] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-[#174D35]" />
              </div>
              <h3 className="text-xl font-bold text-[#174D35] mb-2">
                Pest Progression Timeline
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect multiple scans across dates for individual farm plots. Track changes in visible defoliation, verify whether interventions are working, and correlate symptom changes across stages.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Chronological severity delta
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Transparent optical disclaimer
                </li>
              </ul>
            </div>

            {/* Novelty 3 */}
            <div className="bg-white p-7 rounded-2xl border border-[#DDE6D5] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-[#174D35]" />
              </div>
              <h3 className="text-xl font-bold text-[#174D35] mb-2">
                Explainable Pest Evidence
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rather than generating ungrounded detection boxes, PestGuard provides an honest, transparent breakdown of verifiable visual features: head sutures, frass grain size, and mining geometry.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Concrete observable evidence items
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#63A66A]" /> Clear differential possibilities
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SUPPORTED CROPS GRID */}
      <section className="py-20 bg-white border-b border-[#E1E8D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
                Comprehensive Botanical Coverage
              </span>
              <h2 className="text-3xl font-extrabold text-[#174D35] mt-1">
                Supported Agricultural Crops
              </h2>
            </div>
            <button
              onClick={onExploreLibrary}
              className="mt-4 md:mt-0 text-sm font-semibold text-[#174D35] hover:text-[#63A66A] flex items-center gap-1.5"
            >
              <span>Explore Full Pest Knowledge Library</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {supportedCrops.map((crop, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] hover:border-[#63A66A] hover:bg-[#f0f5eb] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{crop.icon}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200">
                    {crop.category}
                  </span>
                </div>
                <h4 className="font-bold text-[#174D35] text-base mb-1">{crop.name}</h4>
                <p className="text-xs text-gray-600">{crop.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#F7F9F4] border-b border-[#E1E8D9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
              Clear Information
            </span>
            <h2 className="text-3xl font-extrabold text-[#174D35] mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-[#DDE6D5] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-[#174D35] flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#63A66A] shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#174D35] text-white py-12 border-t border-[#216143]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#63A66A] flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-white">{t.brandName}</span>
              </div>
              <p className="text-xs text-[#A3C9A8] max-w-sm">
                Intelligent agricultural pest diagnostic and precision farming risk intelligence platform powered by deep vision intelligence and Cloud Firestore.
              </p>
              <p className="text-[11px] text-[#8BB891]">
                Educational agritech guidance. Always consult registered local agricultural extension agents for official regulatory pesticide recommendations.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3E4D6] mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-[#A3C9A8]">
                <li><button onClick={onStartScan} className="hover:text-white transition-colors">Detect Pest</button></li>
                <li><button onClick={onExploreLibrary} className="hover:text-white transition-colors">Pest Library</button></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3E4D6] mb-3">Compliance & Security</h4>
              <ul className="space-y-2 text-xs text-[#A3C9A8]">
                <li><span>Zero-Trust Firestore Security</span></li>
                <li><span>Offline Synchronization</span></li>
                <li><span>IPM Regulatory Notice</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#216143] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3C9A8]">
            <p>© {new Date().getFullYear()} PestGuard AI. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Precision Crop Protection · Sustainable IPM</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
