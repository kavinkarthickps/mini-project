import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { Field, ScanReport, GrowthStage, SeverityLevel, PestAnalysisResult } from '../types';
import { StorageService } from '../lib/storage';
import { 
  Camera, 
  Video, 
  Pause, 
  Play, 
  RotateCw, 
  Zap, 
  ZapOff, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Upload, 
  ArrowLeft, 
  Clock, 
  Activity, 
  Save, 
  Eye, 
  FileText,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface LiveCameraInspectionProps {
  fields: Field[];
  onBack: () => void;
  onScanSaved: (scan: ScanReport) => void;
}

interface LiveFrameAnalysis {
  pestPresent: boolean;
  pestName: string;
  scientificName: string;
  confidenceScore: number;
  severity: SeverityLevel;
  guidancePrompt: string;
  visibleEvidenceSummary: string;
  analyzedAt: string;
  thumbnailUrl: string;
}

export const LiveCameraInspection: React.FC<LiveCameraInspectionProps> = ({
  fields,
  onBack,
  onScanSaved
}) => {
  const { user, language } = useAuth();
  const t = translations[language];

  // Video and Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);

  // Field & Crop context
  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || '');

  // Mode: 'continuous' | 'capture'
  const [inspectionMode, setInspectionMode] = useState<'continuous' | 'capture'>('continuous');
  const [isPaused, setIsPaused] = useState(false);
  const [inspectionIntervalSeconds, setInspectionIntervalSeconds] = useState(3);

  // Live Analysis State
  const [isInspectingFrame, setIsInspectingFrame] = useState(false);
  const [lastFrameAnalysis, setLastFrameAnalysis] = useState<LiveFrameAnalysis | null>(null);
  const [capturedGallery, setCapturedGallery] = useState<Array<{ url: string; time: string; pest?: string }>>([]);

  // Session Statistics
  const [sessionStartTime] = useState<number>(Date.now());
  const [sessionDurationSec, setSessionDurationSec] = useState(0);
  const [framesInspectedCount, setFramesInspectedCount] = useState(0);
  const [detectedPestsSet, setDetectedPestsSet] = useState<Set<string>>(new Set());
  const [highestObservedSeverity, setHighestObservedSeverity] = useState<SeverityLevel>('low');

  // Freeze-Frame Captured Detail Modal (Mode 2)
  const [frozenImage, setFrozenImage] = useState<string | null>(null);
  const [frozenAnalysis, setFrozenAnalysis] = useState<PestAnalysisResult | null>(null);
  const [isAnalyzingFrozen, setIsAnalyzingFrozen] = useState(false);
  const [isSavedFrozen, setIsSavedFrozen] = useState(false);

  // Session End Summary Modal
  const [showSessionReport, setShowSessionReport] = useState(false);

  // Timer for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDurationSec(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Clean stop all camera tracks
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  }, []);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser. Please use standard photo upload.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);

      // Check capabilities for torch and zoom
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = typeof videoTrack.getCapabilities === 'function' ? videoTrack.getCapabilities() : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
        if (capabilities.zoom) {
          setMaxZoom(capabilities.zoom.max || 1);
        }
      }
    } catch (err: any) {
      console.error('Camera init error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device. Please connect a webcam or switch to image upload.');
      } else {
        setCameraError(`Camera could not be started: ${err.message || 'Unknown error'}`);
      }
      setCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Mount / Unmount lifecycle
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.warn('Torch apply error:', e);
      }
    }
  };

  // Switch Facing Mode
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Apply Zoom
  const handleZoom = async (newZoom: number) => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ zoom: newZoom }]
        });
        setZoomLevel(newZoom);
      } catch (e) {
        console.warn('Zoom error:', e);
      }
    }
  };

  // Helper to grab current frame as base64
  const captureFrameBase64 = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Mode 1: Continuous Frame Inspection Loop
  useEffect(() => {
    if (!cameraActive || isPaused || inspectionMode !== 'continuous') return;

    const interval = setInterval(async () => {
      // Prevent overlapping requests
      if (isInspectingFrame) return;

      const frameBase64 = captureFrameBase64();
      if (!frameBase64) return;

      setIsInspectingFrame(true);
      try {
        const response = await fetch('/api/live-inspect-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: frameBase64,
            mimeType: 'image/jpeg',
            cropType: selectedCrop
          })
        });

        const resData = await response.json();
        if (resData.success && resData.data) {
          const result = resData.data;
          const analyzedTime = new Date().toLocaleTimeString();

          setLastFrameAnalysis({
            pestPresent: result.pestPresent,
            pestName: result.pestName,
            scientificName: result.scientificName,
            confidenceScore: result.confidenceScore,
            severity: result.severity,
            guidancePrompt: result.guidancePrompt,
            visibleEvidenceSummary: result.visibleEvidenceSummary,
            analyzedAt: analyzedTime,
            thumbnailUrl: frameBase64
          });

          setFramesInspectedCount(prev => prev + 1);

          if (result.pestPresent && result.pestName && result.pestName !== 'None') {
            setDetectedPestsSet(prev => new Set(prev).add(result.pestName));
            if (result.severity === 'critical') setHighestObservedSeverity('critical');
            else if (result.severity === 'high' && highestObservedSeverity !== 'critical') setHighestObservedSeverity('high');
            else if (result.severity === 'moderate' && (highestObservedSeverity === 'low')) setHighestObservedSeverity('moderate');
          }
        }
      } catch (err) {
        console.warn('Frame inspection interval failed:', err);
      } finally {
        setIsInspectingFrame(false);
      }
    }, inspectionIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [cameraActive, isPaused, inspectionMode, isInspectingFrame, inspectionIntervalSeconds, selectedCrop, highestObservedSeverity]);

  // Mode 2: Freeze Frame and Capture Still
  const handleCaptureStill = async () => {
    const frame = captureFrameBase64();
    if (!frame) return;

    setFrozenImage(frame);
    setCapturedGallery(prev => [{ url: frame, time: new Date().toLocaleTimeString(), pest: lastFrameAnalysis?.pestName }, ...prev.slice(0, 9)]);
    setFrozenAnalysis(null);
    setIsSavedFrozen(false);
    setIsAnalyzingFrozen(true);

    try {
      const fieldObj = fields.find(f => f.id === selectedFieldId);
      const effectiveFieldName = fieldObj ? fieldObj.fieldName : `${selectedCrop} Field`;

      const res = await fetch('/api/analyze-pest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frame,
          mimeType: 'image/jpeg',
          cropType: selectedCrop,
          growthStage: fieldObj?.growthStage || 'Vegetative',
          fieldName: effectiveFieldName,
          symptoms: 'Live camera field inspection capture',
          weatherConditions: 'In-field live inspection'
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setFrozenAnalysis(data.data);
      }
    } catch (e) {
      console.error('Frozen analysis failed:', e);
    } finally {
      setIsAnalyzingFrozen(false);
    }
  };

  // Save Still Report
  const handleSaveFrozenReport = async () => {
    if (!frozenAnalysis || !frozenImage) return;

    const fieldObj = fields.find(f => f.id === selectedFieldId);
    const effectiveFieldName = fieldObj ? fieldObj.fieldName : `${selectedCrop} Field`;

    const scanRecord: ScanReport = {
      ...frozenAnalysis,
      id: `live-scan-${Date.now()}`,
      userId: user?.uid || 'default_user',
      fieldId: selectedFieldId || undefined,
      fieldName: effectiveFieldName,
      cropType: selectedCrop,
      growthStage: fieldObj?.growthStage || 'Vegetative',
      scanDate: new Date().toISOString(),
      imageUrl: frozenImage,
      weatherConditions: 'Live camera capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await StorageService.saveScan(scanRecord);
    setIsSavedFrozen(true);
    onScanSaved(scanRecord);
  };

  // End Session & Show Summary
  const handleEndSession = () => {
    stopCamera();
    setShowSessionReport(true);
  };

  const formatSec = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#111A15] text-white flex flex-col font-sans">
      
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Bar */}
      <div className="bg-[#174D35] px-4 py-3 border-b border-[#216143] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              stopCamera();
              onBack();
            }}
            className="p-1.5 rounded-lg bg-[#103726] hover:bg-[#1f5e42] text-[#A3C9A8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#63A66A]" />
              <span>PestGuard Live Vision</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-black animate-pulse">
                LIVE
              </span>
            </h1>
            <p className="text-[11px] text-[#A3C9A8]">Real-Time In-Field Crop Pest Diagnostics</p>
          </div>
        </div>

        {/* Crop & Field selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#103726] text-white border border-[#216143] focus:outline-hidden"
          >
            <option value="Maize">Maize</option>
            <option value="Rice">Rice</option>
            <option value="Tomato">Tomato</option>
            <option value="Cotton">Cotton</option>
            <option value="Chilli">Chilli</option>
            <option value="Brinjal">Brinjal</option>
          </select>

          <button
            onClick={handleEndSession}
            className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-bold text-white transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main Split Layout: Camera Viewport (Left/Center) + Right Intelligence Panel */}
      <div className="grow grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        
        {/* Camera Viewport (Left 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-black relative flex flex-col items-center justify-center min-h-[460px] lg:min-h-full overflow-hidden">
          
          {/* Real Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover max-h-[80vh] lg:max-h-full"
          />

          {/* Camera Error / Fallback State */}
          {cameraError && (
            <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Camera Access Notice</h3>
              <p className="text-xs text-gray-300 max-w-md leading-relaxed">
                {cameraError}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-[#63A66A] text-[#174D35] font-bold text-xs"
                >
                  Retry Camera
                </button>
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-white font-bold text-xs"
                >
                  Use Upload Mode
                </button>
              </div>
            </div>
          )}

          {/* Animated Scanning Beam & Reticle Overlay */}
          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              {/* Green Scanning Frame */}
              <div className="w-full max-w-sm aspect-square border-2 border-[#63A66A]/70 rounded-3xl relative overflow-hidden shadow-2xl">
                
                {/* Corner reticle markers */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-4 border-r-4 border-emerald-400" />

                {/* Sweeping laser scan bar */}
                {inspectionMode === 'continuous' && !isPaused && (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#63A66A] to-transparent shadow-[0_0_12px_#63A66A] animate-scan-beam" />
                )}

                {/* Center target reticle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>

                {/* Live Status Tag */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs">
                    {isInspectingFrame ? 'Analyzing frame with AI Vision...' : 'Target leaf in reticle'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Inspection Guidance Prompt Overlay */}
          {lastFrameAnalysis?.guidancePrompt && (
            <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none z-10">
              <div className="bg-[#174D35]/90 border border-[#63A66A] px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#63A66A]" />
                <span>{lastFrameAnalysis.guidancePrompt}</span>
              </div>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
            
            {/* Left Tools: Facing Toggle, Flashlight */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={toggleFacingMode}
                className="p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors"
                title="Switch Camera (Front/Rear)"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              {hasTorch && (
                <button
                  onClick={toggleTorch}
                  className={`p-2.5 rounded-xl transition-colors ${torchOn ? 'text-amber-400 bg-white/20' : 'text-white hover:bg-white/20'}`}
                  title="Flashlight Torch"
                >
                  {torchOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
                </button>
              )}
            </div>

            {/* Center Main Capture Button */}
            <div className="flex items-center gap-3">
              {inspectionMode === 'continuous' ? (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all ${
                    isPaused 
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                      : 'bg-black/60 border border-white/20 text-white'
                  }`}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span>{isPaused ? 'Resume Scan' : 'Pause Scan'}</span>
                </button>
              ) : null}

              {/* High-Res Snapshot Capture */}
              <button
                onClick={handleCaptureStill}
                className="w-16 h-16 rounded-full border-4 border-white bg-[#63A66A] hover:bg-[#72b579] active:scale-95 transition-transform flex items-center justify-center shadow-xl cursor-pointer"
                title="Capture & Inspect Still Photo"
              >
                <Camera className="w-7 h-7 text-[#174D35]" />
              </button>
            </div>

            {/* Right Tools: Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setInspectionMode('continuous')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  inspectionMode === 'continuous' ? 'bg-[#174D35] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Auto 3s
              </button>
              <button
                onClick={() => setInspectionMode('capture')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  inspectionMode === 'capture' ? 'bg-[#174D35] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Freeze Still
              </button>
            </div>

          </div>

        </div>

        {/* Right Intelligence Panel (Desktop 4 cols, or collapsible drawer on mobile) */}
        <div className="lg:col-span-4 bg-[#14221A] border-l border-[#216143] p-5 flex flex-col justify-between overflow-y-auto max-h-[85vh] lg:max-h-full space-y-6">
          
          <div className="space-y-5">
            
            {/* Session Stats Banner */}
            <div className="bg-[#1B2F24] p-4 rounded-2xl border border-[#274B37] flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Session Timer</span>
                <span className="font-mono text-base font-bold text-white">{formatSec(sessionDurationSec)}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Frames Analyzed</span>
                <span className="font-mono text-base font-bold text-emerald-400">{framesInspectedCount}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Peak Risk</span>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                  highestObservedSeverity === 'critical' ? 'bg-red-500 text-white' :
                  highestObservedSeverity === 'high' ? 'bg-amber-500 text-white' :
                  highestObservedSeverity === 'moderate' ? 'bg-yellow-500 text-black' :
                  'bg-emerald-500 text-white'
                }`}>
                  {highestObservedSeverity}
                </span>
              </div>
            </div>

            {/* Last Analyzed Result Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3C9A8] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#63A66A]" />
                  <span>Latest Analyzed Snapshot</span>
                </h3>
                {lastFrameAnalysis && (
                  <span className="text-[10px] text-gray-400">
                    {lastFrameAnalysis.analyzedAt}
                  </span>
                )}
              </div>

              {lastFrameAnalysis ? (
                <div className="bg-[#1B2F24] p-4 rounded-2xl border border-[#274B37] space-y-3">
                  
                  {/* Distinction notice */}
                  <div className="text-[10px] text-gray-400 bg-black/30 p-2 rounded-lg flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>Displaying result from last analyzed snapshot (3s ago), not live optical stream.</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {lastFrameAnalysis.pestName}
                      </h4>
                      <p className="text-xs text-[#A3C9A8] italic">
                        {lastFrameAnalysis.scientificName}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      lastFrameAnalysis.severity === 'critical' ? 'bg-red-500 text-white' :
                      lastFrameAnalysis.severity === 'high' ? 'bg-amber-500 text-white' :
                      lastFrameAnalysis.severity === 'moderate' ? 'bg-yellow-500 text-black' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {lastFrameAnalysis.severity}
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Illustrative Confidence</span>
                      <span className="font-bold text-white">{lastFrameAnalysis.confidenceScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                      <div 
                        className="h-full bg-[#63A66A] rounded-full" 
                        style={{ width: `${lastFrameAnalysis.confidenceScore}%` }} 
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-snug">
                    {lastFrameAnalysis.visibleEvidenceSummary}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Pest Detected:</span>
                    <span className="font-bold text-emerald-400">
                      {lastFrameAnalysis.pestPresent ? 'Yes' : 'None / Clean Foliage'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1B2F24] p-6 rounded-2xl border border-dashed border-[#274B37] text-center space-y-2">
                  <Activity className="w-6 h-6 text-gray-500 mx-auto animate-pulse" />
                  <p className="text-xs text-gray-400">
                    Continuous inspection active. Point camera at a crop leaf to generate live diagnostic reads.
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery of Captured Stills */}
            {capturedGallery.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A3C9A8] block">
                  Captured Session Stills ({capturedGallery.length})
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {capturedGallery.map((snap, i) => (
                    <div 
                      key={i} 
                      onClick={() => setFrozenImage(snap.url)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20 cursor-pointer hover:border-[#63A66A]"
                    >
                      <img src={snap.url} alt="Snap" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Bottom Complete Session CTA */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleEndSession}
              className="w-full py-3 rounded-xl bg-[#63A66A] hover:bg-[#72b579] text-[#174D35] font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Session & View Summary</span>
            </button>
          </div>

        </div>

      </div>

      {/* Captured Still Detail Modal (Mode 2) */}
      {frozenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#174D35] text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#216143] space-y-5 relative">
            <button
              onClick={() => {
                setFrozenImage(null);
                setFrozenAnalysis(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#63A66A]">
                High-Resolution Still Inspection
              </span>
              <h3 className="text-xl font-bold">Captured Crop Specimen</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-black border border-white/10">
                <img src={frozenImage} alt="Frozen Still" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 text-xs">
                {isAnalyzingFrozen ? (
                  <div className="p-6 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-[#63A66A] mx-auto animate-spin" />
                    <p className="font-bold">Analyzing with AI Vision...</p>
                  </div>
                ) : frozenAnalysis ? (
                  <div className="space-y-2 bg-[#103726] p-4 rounded-xl border border-[#216143]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base text-white">{frozenAnalysis.pestName}</h4>
                        <p className="text-[11px] text-[#A3C9A8] italic">{frozenAnalysis.scientificName}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-black">
                        {frozenAnalysis.severity}
                      </span>
                    </div>

                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {frozenAnalysis.confidenceExplanation}
                    </p>

                    <div className="pt-2 border-t border-white/10">
                      <span className="font-semibold block text-[#A3C9A8]">Observable Clues:</span>
                      <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                        {frozenAnalysis.observableEvidence?.slice(0, 3).map((e, idx) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setFrozenImage(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
              >
                Retake Photo
              </button>
              {frozenAnalysis && (
                <button
                  onClick={handleSaveFrozenReport}
                  disabled={isSavedFrozen}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    isSavedFrozen ? 'bg-emerald-600 text-white' : 'bg-[#63A66A] text-[#174D35] hover:bg-[#72b579]'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavedFrozen ? 'Saved to Field Scans' : 'Save Report to Field'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Session Summary Report Dialog */}
      {showSessionReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white text-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#E5F0E7] text-[#174D35] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-[#63A66A]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#174D35]">Inspection Session Summary</h3>
              <p className="text-xs text-gray-500">Live Camera Field Audit Completed</p>
            </div>

            <div className="bg-[#F7F9F4] p-4 rounded-xl border border-[#E1E8D9] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-bold text-gray-800">{formatSec(sessionDurationSec)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Crop:</span>
                <span className="font-bold text-gray-800">{selectedCrop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frames Processed:</span>
                <span className="font-bold text-gray-800">{framesInspectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stills Captured:</span>
                <span className="font-bold text-gray-800">{capturedGallery.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Peak Severity Detected:</span>
                <span className="font-bold uppercase text-amber-700">{highestObservedSeverity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pests Identified:</span>
                <span className="font-bold text-gray-800">
                  {detectedPestsSet.size > 0 ? Array.from(detectedPestsSet).join(', ') : 'None / Clean Foliage'}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <span className="font-bold text-gray-800 block">Recommended Next Steps:</span>
              <p>• Schedule next field scouting in <strong>3 to 5 days</strong>.</p>
              <p>• Review IPM biological options in the Treatment Planner.</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowSessionReport(false);
                  onBack();
                }}
                className="w-full py-3 rounded-xl bg-[#174D35] hover:bg-[#1f5e42] text-white font-bold text-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
