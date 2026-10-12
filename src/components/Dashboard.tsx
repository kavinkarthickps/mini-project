import React from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { Field, ScanReport, MonitoringTask, SeverityLevel } from '../types';
import { 
  Scan, 
  PlusCircle, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Leaf, 
  Calendar,
  Layers,
  Camera
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  fields: Field[];
  scans: ScanReport[];
  tasks: MonitoringTask[];
  onNewScan: () => void;
  onOpenLiveCamera: () => void;
  onSelectField: (field: Field) => void;
  onViewScan: (scan: ScanReport) => void;
  onToggleTask: (taskId: string) => void;
  onGoToFields: () => void;
  onGoToHistory: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  fields,
  scans,
  tasks,
  onNewScan,
  onOpenLiveCamera,
  onSelectField,
  onViewScan,
  onToggleTask,
  onGoToFields,
  onGoToHistory
}) => {
  const { user, language } = useAuth();
  const t = translations[language];

  const firstName = user?.displayName?.split(' ')[0] || 'Farmer';

  // Compute severity distribution from real user scans
  const severityCounts: Record<SeverityLevel, number> = {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0
  };

  scans.forEach(s => {
    if (s.severity && severityCounts[s.severity] !== undefined) {
      severityCounts[s.severity]++;
    }
  });

  const chartData = [
    { name: 'Critical', value: severityCounts.critical, color: '#DC2626' },
    { name: 'High', value: severityCounts.high, color: '#E68A19' },
    { name: 'Moderate', value: severityCounts.moderate, color: '#EAB308' },
    { name: 'Low', value: severityCounts.low, color: '#63A66A' }
  ].filter(d => d.value > 0);

  // Highest severity in current records
  const highestSeverity = scans.length > 0
    ? severityCounts.critical > 0 ? 'Critical'
      : severityCounts.high > 0 ? 'High'
      : severityCounts.moderate > 0 ? 'Moderate' : 'Low'
    : 'None';

  // Recent 4 scans
  const recentScans = [...scans].slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#174D35] to-[#205A40] p-6 sm:p-8 rounded-2xl text-white shadow-md">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#A3C9A8]">Field Agronomy Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-[#D3E4D6] mt-1">
            Real-time pest intelligence, field risk assessments, and monitoring alerts across your farm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenLiveCamera}
            className="px-5 py-3 rounded-xl bg-[#103726] hover:bg-[#154631] text-emerald-400 border border-[#2e825a] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-emerald-400" />
            <span>Live Inspect</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-black">Live</span>
          </button>

          <button
            onClick={onNewScan}
            className="px-5 py-3 rounded-xl bg-[#63A66A] hover:bg-[#72b579] text-[#174D35] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.scanTitle}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center shrink-0">
            <Scan className="w-6 h-6 text-[#174D35]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Scans</p>
            <h3 className="text-2xl font-black text-[#174D35] mt-0.5">{scans.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-[#174D35]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Fields</p>
            <h3 className="text-2xl font-black text-[#174D35] mt-0.5">{fields.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#E68A19]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Peak Severity</p>
            <h3 className="text-2xl font-black text-amber-800 mt-0.5">{highestSeverity}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE6D5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#63A66A]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Pending Tasks</p>
            <h3 className="text-2xl font-black text-[#174D35] mt-0.5">
              {tasks.filter(t => !t.completed).length}
            </h3>
          </div>
        </div>

      </div>

      {/* Middle Grid: Severity Distribution & Field Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Severity Distribution Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#63A66A]" />
              <span>Severity Distribution</span>
            </h3>
            <span className="text-xs text-gray-400">{scans.length} verified scans</span>
          </div>

          {scans.length > 0 ? (
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 bg-[#F7F9F4] rounded-xl text-gray-400">
              <Scan className="w-8 h-8 mb-2 text-gray-300" />
              <p className="text-xs font-medium">No scan reports recorded yet.</p>
              <button 
                onClick={onNewScan}
                className="mt-2 text-xs text-[#174D35] font-bold hover:underline"
              >
                Scan your first crop specimen →
              </button>
            </div>
          )}

          {/* Severity Legend */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-center">
            <div>
              <p className="text-xs font-bold text-red-600">{severityCounts.critical}</p>
              <p className="text-[10px] text-gray-500">Critical</p>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600">{severityCounts.high}</p>
              <p className="text-[10px] text-gray-500">High</p>
            </div>
            <div>
              <p className="text-xs font-bold text-yellow-600">{severityCounts.moderate}</p>
              <p className="text-[10px] text-gray-500">Moderate</p>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600">{severityCounts.low}</p>
              <p className="text-[10px] text-gray-500">Low</p>
            </div>
          </div>
        </div>

        {/* Field Risk Overview Widget */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#63A66A]" />
              <span>{t.riskEngineTitle}</span>
            </h3>
            <button
              onClick={onGoToFields}
              className="text-xs font-semibold text-[#174D35] hover:text-[#63A66A] flex items-center gap-1"
            >
              <span>Manage Fields</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                onClick={() => onSelectField(field)}
                className="p-3.5 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] hover:border-[#63A66A] hover:bg-[#EEF2E6] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#174D35]">{field.fieldName}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                      {field.crop} · {field.growthStage}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last inspected: {field.lastInspected || 'Recently'} · {field.location || 'Plot A'}
                  </p>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      field.riskTier === 'severe' ? 'bg-red-100 text-red-900 border border-red-200' :
                      field.riskTier === 'elevated' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      field.riskTier === 'moderate' ? 'bg-yellow-100 text-yellow-900 border border-yellow-200' :
                      'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {field.riskTier} Risk ({field.riskScore}%)
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Scans & Actionable Monitoring Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Scan Activity */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#63A66A]" />
              <span>Recent Scan Activity</span>
            </h3>
            <button
              onClick={onGoToHistory}
              className="text-xs font-semibold text-[#174D35] hover:text-[#63A66A] flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentScans.length > 0 ? (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => onViewScan(scan)}
                  className="p-3 rounded-xl bg-[#F7F9F4] border border-[#E1E8D9] hover:border-[#63A66A] hover:bg-[#EEF2E6] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={scan.imageUrl}
                      alt={scan.pestName}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#174D35]">{scan.pestName}</h4>
                      <p className="text-xs text-gray-500">
                        {scan.fieldName} · {new Date(scan.scanDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      scan.severity === 'critical' ? 'bg-red-100 text-red-900' :
                      scan.severity === 'high' ? 'bg-amber-100 text-amber-900' :
                      scan.severity === 'moderate' ? 'bg-yellow-100 text-yellow-900' :
                      'bg-emerald-100 text-emerald-900'
                    }`}>
                      {scan.severity} ({scan.confidenceScore}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">No scan records available.</p>
          )}
        </div>

        {/* Recommended Monitoring Actions */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#DDE6D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#174D35] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#63A66A]" />
              <span>Recommended Monitoring Tasks</span>
            </h3>
            <span className="text-xs text-gray-400">Field priorities</span>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  task.completed 
                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                    : 'bg-[#F7F9F4] border-[#E1E8D9] hover:border-[#63A66A]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-[#174D35] focus:ring-[#63A66A] cursor-pointer"
                />
                <div className="space-y-1">
                  <p className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {task.fieldName} · Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
