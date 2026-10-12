import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ScanWorkflow } from './components/ScanWorkflow';
import { FieldIntelligence } from './components/FieldIntelligence';
import { PestLibrary } from './components/PestLibrary';
import { ScanHistory } from './components/ScanHistory';
import { TreatmentPlanner } from './components/TreatmentPlanner';
import { Settings } from './components/Settings';
import { SignInModal } from './components/SignInModal';
import { LoginPage } from './components/LoginPage';
import { LiveCameraInspection } from './components/LiveCameraInspection';
import { AgronomistCopilot } from './components/AgronomistCopilot';
import { Field, ScanReport, MonitoringTask } from './types';
import { StorageService } from './lib/storage';
import { testConnection } from './lib/firebase';
import { ArrowLeft, Download, CheckCircle2, AlertTriangle, Eye, ShieldCheck, X } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();

  // Tab State: 'home' | 'dashboard' | 'detect' | 'intelligence' | 'fields' | 'library' | 'history' | 'planner' | 'settings'
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // App Data State
  const [fields, setFields] = useState<Field[]>([]);
  const [scans, setScans] = useState<ScanReport[]>([]);
  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [viewingScanModal, setViewingScanModal] = useState<ScanReport | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      const loadedFields = await StorageService.getFields(user?.uid || 'default_user');
      const loadedScans = await StorageService.getScans(user?.uid || 'default_user');
      const loadedTasks = await StorageService.getTasks(user?.uid || 'default_user');

      setFields(loadedFields);
      setScans(loadedScans);
      setTasks(loadedTasks);
      if (loadedFields.length > 0 && !selectedField) {
        setSelectedField(loadedFields[0]);
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
    }
  };

  useEffect(() => {
    loadData();
    testConnection();

    // Listen to network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Handle when a new scan is saved from ScanWorkflow
  const handleScanSaved = (newScan: ScanReport) => {
    setScans(prev => [newScan, ...prev.filter(s => s.id !== newScan.id)]);
    loadData();
  };

  // Toggle monitoring task
  const handleToggleTask = async (taskId: string) => {
    await StorageService.toggleTask(taskId);
    loadData();
  };

  // Switch to ScanWorkflow preloaded with specific field
  const handleNewScanForField = (field: Field) => {
    setSelectedField(field);
    setCurrentTab('detect');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] text-[#1F2923] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSignInModal={() => setIsSignInModalOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Body Routing */}
      <main className="grow">
        {currentTab === 'home' && (
          <LandingPage
            onStartScan={() => setCurrentTab('detect')}
            onStartLiveCamera={() => setCurrentTab('camera')}
            onExploreLibrary={() => setCurrentTab('library')}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentTab('dashboard')}
            onGoHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            fields={fields}
            scans={scans}
            tasks={tasks}
            onNewScan={() => setCurrentTab('detect')}
            onOpenLiveCamera={() => setCurrentTab('camera')}
            onSelectField={(field) => {
              setSelectedField(field);
              setCurrentTab('intelligence');
            }}
            onViewScan={(scan) => setViewingScanModal(scan)}
            onToggleTask={handleToggleTask}
            onGoToFields={() => setCurrentTab('intelligence')}
            onGoToHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'camera' && (
          <LiveCameraInspection
            fields={fields}
            onBack={() => setCurrentTab('dashboard')}
            onScanSaved={handleScanSaved}
          />
        )}

        {currentTab === 'detect' && (
          <ScanWorkflow
            fields={fields}
            onScanSaved={handleScanSaved}
            onGoToFields={() => setCurrentTab('intelligence')}
          />
        )}

        {(currentTab === 'intelligence' || currentTab === 'fields') && (
          <FieldIntelligence
            fields={fields}
            scans={scans}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onRefreshFields={loadData}
            onNewScanForField={handleNewScanForField}
          />
        )}

        {currentTab === 'library' && (
          <PestLibrary />
        )}

        {currentTab === 'history' && (
          <ScanHistory
            scans={scans}
            onViewReport={(scan) => setViewingScanModal(scan)}
            onRefreshScans={loadData}
          />
        )}

        {currentTab === 'planner' && (
          <TreatmentPlanner />
        )}

        {currentTab === 'settings' && (
          <Settings
            onRefreshScans={loadData}
            onRefreshFields={loadData}
          />
        )}
      </main>

      {/* Auth Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />

      {/* Small LLM Agronomist Copilot Assistant */}
      <AgronomistCopilot />

      {/* Scan Detail Report Modal (When clicked from Dashboard or History) */}
      {viewingScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 relative">
            <button
              onClick={() => setViewingScanModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                  Archived Field Scan
                </span>
                <h2 className="text-2xl font-black text-[#174D35]">{viewingScanModal.pestName}</h2>
                <p className="text-xs text-gray-500 italic">{viewingScanModal.scientificName}</p>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                viewingScanModal.severity === 'critical' ? 'bg-red-100 text-red-900' :
                viewingScanModal.severity === 'high' ? 'bg-amber-100 text-amber-900' :
                viewingScanModal.severity === 'moderate' ? 'bg-yellow-100 text-yellow-900' :
                'bg-emerald-100 text-emerald-900'
              }`}>
                {viewingScanModal.severity} Severity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={viewingScanModal.imageUrl}
                  alt={viewingScanModal.pestName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F7F9F4] rounded-xl border border-[#E1E8D9]">
                  <p><strong>Field Plot:</strong> {viewingScanModal.fieldName}</p>
                  <p><strong>Crop & Stage:</strong> {viewingScanModal.cropType} ({viewingScanModal.growthStage})</p>
                  <p><strong>Observed Date:</strong> {new Date(viewingScanModal.scanDate).toLocaleString()}</p>
                  <p><strong>Visual Confidence:</strong> {viewingScanModal.confidenceScore}%</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-700 block">Observable Visual Clues:</span>
                  <ul className="space-y-1 text-gray-600">
                    {viewingScanModal.observableEvidence?.map((e, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#63A66A] shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
              <span className="font-bold text-[#174D35] block">Immediate Interventions:</span>
              <ul className="space-y-1 text-gray-700">
                {viewingScanModal.immediateActions?.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F9F4] p-2.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#174D35] shrink-0 mt-1.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Export / Print Report</span>
              </button>
              <button
                onClick={() => setViewingScanModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#174D35] text-white text-xs font-bold hover:bg-[#1f5e42]"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
