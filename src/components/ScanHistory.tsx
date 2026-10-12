import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { ScanReport } from '../types';
import { StorageService } from '../lib/storage';
import { 
  Search, 
  History, 
  Trash2, 
  Eye, 
  ArrowLeftRight, 
  Download, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';

interface ScanHistoryProps {
  scans: ScanReport[];
  onViewReport: (scan: ScanReport) => void;
  onRefreshScans: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  scans,
  onViewReport,
  onRefreshScans
}) => {
  const { language } = useAuth();
  const t = translations[language];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  // Compare mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareScan1, setCompareScan1] = useState<ScanReport | null>(null);
  const [compareScan2, setCompareScan2] = useState<ScanReport | null>(null);

  const cropList = ['All', ...Array.from(new Set(scans.map(s => s.cropType)))];
  const severityList = ['All', 'critical', 'high', 'moderate', 'low'];

  const filteredScans = scans.filter((s) => {
    const matchesSearch = 
      s.pestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cropType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop = selectedCrop === 'All' || s.cropType === selectedCrop;
    const matchesSeverity = selectedSeverity === 'All' || s.severity === selectedSeverity;

    return matchesSearch && matchesCrop && matchesSeverity;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this pest scan record from history?')) {
      await StorageService.deleteScan(id);
      onRefreshScans();
    }
  };

  const handleSelectForCompare = (scan: ScanReport, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!compareScan1) {
      setCompareScan1(scan);
    } else if (!compareScan2 && scan.id !== compareScan1.id) {
      setCompareScan2(scan);
      setIsCompareMode(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE6D5] pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#63A66A]">
            Archived Diagnostic Records
          </span>
          <h1 className="text-3xl font-extrabold text-[#174D35] mt-1">
            {t.navHistory} & Field Scans
          </h1>
          <p className="text-sm text-gray-600">
            Search previous crop inspections, evaluate damage deltas, and export field reports.
          </p>
        </div>

        {compareScan1 && !isCompareMode && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center gap-3">
            <span>Selected 1 scan for comparison. Click another scan:</span>
            <button
              onClick={() => { setCompareScan1(null); setCompareScan2(null); }}
              className="text-red-600 font-bold hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by pest name, field plot, or crop type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
            />
          </div>

          <div className="sm:w-44">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white"
            >
              {cropList.map(c => (
                <option key={c} value={c}>Crop: {c}</option>
              ))}
            </select>
          </div>

          <div className="sm:w-44">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white"
            >
              {severityList.map(s => (
                <option key={s} value={s}>Severity: {s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scan Records Table / Cards */}
      {filteredScans.length > 0 ? (
        <div className="space-y-3">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onViewReport(scan)}
              className={`p-4 rounded-2xl border bg-white shadow-xs hover:border-[#63A66A] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                compareScan1?.id === scan.id ? 'ring-2 ring-[#63A66A] bg-[#F7F9F4]' : 'border-[#DDE6D5]'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={scan.imageUrl}
                  alt={scan.pestName}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#174D35] group-hover:text-[#216143]">
                      {scan.pestName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E5F0E7] text-[#174D35]">
                      {scan.cropType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Plot: <strong>{scan.fieldName}</strong> · Stage: <strong>{scan.growthStage}</strong> · {new Date(scan.scanDate).toLocaleDateString()}
                  </p>
                  <p className="text-[11px] text-gray-600 line-clamp-1">
                    {scan.damageSymptoms?.[0] || scan.observableEvidence?.[0] || 'Visual foliage damage'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    scan.severity === 'critical' ? 'bg-red-100 text-red-900 border border-red-200' :
                    scan.severity === 'high' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                    scan.severity === 'moderate' ? 'bg-yellow-100 text-yellow-900 border border-yellow-200' :
                    'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {scan.severity} ({scan.confidenceScore}%)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleSelectForCompare(scan, e)}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#174D35] hover:bg-[#EEF2E6] transition-colors"
                    title="Compare with another scan"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(scan.id, e)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
          <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-gray-700">No Historical Scan Reports Found</h3>
          <p className="text-xs text-gray-500 mt-1">Adjust filters or upload new field photos.</p>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareMode && compareScan1 && compareScan2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            
            <button
              onClick={() => {
                setIsCompareMode(false);
                setCompareScan1(null);
                setCompareScan2(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                Side-by-Side Diagnostic Evaluation
              </span>
              <h2 className="text-2xl font-black text-[#174D35]">Compare Crop Pest Observations</h2>
              <p className="text-xs text-gray-500">
                Evaluating progression between two observation dates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Scan 1 */}
              <div className="bg-[#F7F9F4] p-5 rounded-2xl border border-[#DDE6D5] space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Observation A</span>
                <img
                  src={compareScan1.imageUrl}
                  alt={compareScan1.pestName}
                  className="w-full aspect-4/3 rounded-xl object-cover bg-gray-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#174D35]">{compareScan1.pestName}</h3>
                  <p className="text-xs text-gray-500">{new Date(compareScan1.scanDate).toLocaleDateString()} · {compareScan1.growthStage}</p>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong>Severity:</strong> {compareScan1.severity} ({compareScan1.confidenceScore}%)</p>
                  <p><strong>Area:</strong> {compareScan1.approximateAffectedArea || 'Foliar'}</p>
                  <p><strong>Key Visual:</strong> {compareScan1.observableEvidence?.[0]}</p>
                </div>
              </div>

              {/* Scan 2 */}
              <div className="bg-[#F7F9F4] p-5 rounded-2xl border border-[#DDE6D5] space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase">Observation B</span>
                <img
                  src={compareScan2.imageUrl}
                  alt={compareScan2.pestName}
                  className="w-full aspect-4/3 rounded-xl object-cover bg-gray-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#174D35]">{compareScan2.pestName}</h3>
                  <p className="text-xs text-gray-500">{new Date(compareScan2.scanDate).toLocaleDateString()} · {compareScan2.growthStage}</p>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong>Severity:</strong> {compareScan2.severity} ({compareScan2.confidenceScore}%)</p>
                  <p><strong>Area:</strong> {compareScan2.approximateAffectedArea || 'Foliar'}</p>
                  <p><strong>Key Visual:</strong> {compareScan2.observableEvidence?.[0]}</p>
                </div>
              </div>

            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => {
                  setIsCompareMode(false);
                  setCompareScan1(null);
                  setCompareScan2(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#1f5e42]"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
