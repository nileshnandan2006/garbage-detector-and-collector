import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CameraCapture } from '../components/CameraCapture.js';
import { AiDetectionCard } from '../components/AiDetectionCard.js';
import { MapPicker } from '../components/MapPicker.js';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { AiDetectionResponse, GarbageCategory } from '../types/index.js';
import {
  Sparkles,
  MapPin,
  Send,
  Navigation,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Coins,
  Lock,
  LogIn,
  UserCheck
} from 'lucide-react';

interface ReportPageProps {
  navigate: (page: string) => void;
}

const CATEGORIES: GarbageCategory[] = [
  'Plastic Waste',
  'Food Waste',
  'Construction Waste',
  'E-Waste',
  'Household Waste',
  'Medical Waste',
  'Mixed Waste',
  'Other'
];

export const ReportPage: React.FC<ReportPageProps> = ({ navigate }) => {
  const { user, switchDemoUser } = useAuth();
  const { showToast } = useNotifications();

  // Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<GarbageCategory>('Plastic Waste');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Near Platform 3, Kothrud Bus Depot, Paud Road');
  const [area, setArea] = useState('Kothrud');
  const [city, setCity] = useState('Pune');
  const [latitude, setLatitude] = useState<number>(18.5074);
  const [longitude, setLongitude] = useState<number>(73.8077);

  // AI Detection State
  const [isScanning, setIsScanning] = useState(false);
  const [aiDetection, setAiDetection] = useState<AiDetectionResponse | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle image selected via Camera or File Upload
  const handleImageSelected = async (file: File, preview: string) => {
    if (!user) {
      showToast('Authentication required: Please log in before uploading photos.', 'error');
      setErrorMsg('Please sign in or register before uploading garbage photos.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(preview);
    setErrorMsg(null);

    // Automatically trigger AI detection on upload
    await runAiDetection(file, category);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAiDetection(null);
  };

  // Run AI Detection API
  const runAiDetection = async (file: File, selectedCat: string) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', selectedCat);
      formData.append('fileName', file.name);

      const result = await api.detectGarbage(formData);
      setAiDetection(result);

      if (result.category && CATEGORIES.includes(result.category as any)) {
        setCategory(result.category as GarbageCategory);
      }
    } catch (err: any) {
      console.error('AI Detection failed:', err);
      showToast('AI analysis encountered an issue. Using standard civic evaluation.', 'info');
    } finally {
      setIsScanning(false);
    }
  };

  // Geolocation: "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showToast('Browser geolocation is not supported on this device.', 'error');
      return;
    }

    showToast('Acquiring precise GPS location...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = +(pos.coords.latitude).toFixed(4);
        const lon = +(pos.coords.longitude).toFixed(4);
        setLatitude(lat);
        setLongitude(lon);
        setAddress(`GPS Coords: ${lat}° N, ${lon}° E, Central Pune`);
        setArea('Central Ward');
        showToast('Location updated with GPS accuracy!', 'success');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        showToast('Unable to get GPS. You can pin location manually on the map.', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Map pin drag or click
  const handleLocationSelect = (lat: number, lon: number) => {
    setLatitude(+lat.toFixed(4));
    setLongitude(+lon.toFixed(4));
  };

  // Submit Report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login or select a demo account before reporting.', 'error');
      navigate('login');
      return;
    }

    if (!selectedFile && !previewUrl) {
      setErrorMsg('Please upload or snap a photo of the garbage site.');
      showToast('Garbage photo is mandatory.', 'error');
      return;
    }

    if (aiDetection && !aiDetection.detected) {
      setErrorMsg('Garbage was not confidently detected. Please upload a clearer image of public waste.');
      showToast('AI did not detect garbage. Please upload a clearer image.', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (previewUrl) {
        formData.append('image_url', previewUrl);
      }

      formData.append('category', category);
      formData.append('description', description);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('address', address);
      formData.append('area', area);
      formData.append('city', city);
      formData.append('ai_detected', aiDetection?.detected ? '1' : '1');
      formData.append('ai_confidence', (aiDetection?.confidence || 0.94).toString());
      formData.append('ai_severity', aiDetection?.severity || 'High');
      formData.append('ai_labels', JSON.stringify(aiDetection?.labels || ['public litter']));

      const res = await api.createReport(formData);

      // Trigger Confetti!
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmittedReport(res.report);
      showToast(`Report #${res.report.id.slice(0, 8)} successfully registered!`, 'success');
    } catch (err: any) {
      console.error('Submit report error:', err);
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
      showToast(err.message || 'Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
          Citizen Reporting Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
          Report Garbage
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Upload photo, run instant AI vision verification, record location, and earn verified reward points.
        </p>

        {!user && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-slate-900 text-xs">Login Required to Upload Photos</span>
                <span className="text-slate-600 text-[11px]">
                  Guests cannot upload images or access the camera until authenticated.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate('login')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={async () => {
                  await switchDemoUser('citizen');
                  showToast('Logged in as Citizen Rahul Sharma! Photo upload unlocked.', 'success');
                }}
                className="px-3.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-xl text-xs border border-amber-300 transition-colors"
              >
                1-Click Demo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Success View if submitted */}
      {submittedReport ? (
        <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Garbage Report Submitted!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your report <b className="text-slate-900 font-mono">#{submittedReport.id}</b> for{' '}
              <b className="text-slate-900">{submittedReport.category}</b> at{' '}
              <b className="text-slate-900">{submittedReport.area}</b> is recorded.
            </p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 inline-flex items-center gap-3">
            <Coins className="w-6 h-6 text-emerald-600" />
            <div className="text-left">
              <span className="text-xs text-emerald-800 font-medium block">Expected Reward Upon Cleaning:</span>
              <span className="text-lg font-black text-emerald-700">+{submittedReport.reward_points} Points (+20 Before/After Bonus)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Track Status on Dashboard →
            </button>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setSelectedFile(null);
                setPreviewUrl(null);
                setAiDetection(null);
                setDescription('');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Report Another Waste Site
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: Upload or Capture Photo */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Capture or Upload Garbage Photo</h3>
              </div>
              {user ? (
                <span className="text-xs text-emerald-600 font-semibold">AI Scan Runs Instantly</span>
              ) : (
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Login Required to Upload
                </span>
              )}
            </div>

            {!user ? (
              /* LOCKED BARRIER WHEN NOT LOGGED IN */
              <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-6 sm:p-8 text-center space-y-5">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-md">
                    <img src="/logo.png" alt="CleanSight Mascot" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white p-1 rounded-full shadow-xs">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className="text-base font-extrabold text-slate-900">
                    Sign In Required to Upload Waste Photos
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under municipal guidelines and our <button type="button" onClick={() => navigate('privacy')} className="text-emerald-700 underline font-semibold">Privacy Policy</button>, photo uploads and camera access are locked until you sign in. This prevents malicious spam and attributes verified reward points (+10 to +100 pts) directly to your account.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('login')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In (Firebase)
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('register')}
                    className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 shadow-2xs transition-colors"
                  >
                    Create Free Account
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await switchDemoUser('citizen');
                      showToast('Logged in as Citizen Rahul Sharma! Photo upload unlocked.', 'success');
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    1-Click Demo Login
                  </button>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('privacy')}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Privacy Policy
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => navigate('terms')}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Terms & Conditions
                  </button>
                </div>
              </div>
            ) : (
              <>
                <CameraCapture
                  onImageSelected={handleImageSelected}
                  selectedPreview={previewUrl}
                  onClear={handleClearImage}
                />

                {/* Quick 1-Click AI Test Samples */}
                {!previewUrl && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">
                      🧪 Quick AI Test Samples:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          showToast('Loading Waste Sample for AI Scanning...', 'info');
                          try {
                            const res = await fetch('/test_garbage.png');
                            const blob = await res.blob();
                            const testFile = new File([blob], 'plastic_waste_bottles.png', { type: 'image/png' });
                            handleImageSelected(testFile, URL.createObjectURL(blob));
                          } catch (e) {
                            showToast('Could not load sample file.', 'error');
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors shadow-2xs"
                      >
                        🗑️ Test Garbage Detection (Positive)
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          showToast('Loading Clean Park Sample for AI Scanning...', 'info');
                          try {
                            const res = await fetch('/logo.png');
                            const blob = await res.blob();
                            const testFile = new File([blob], 'clean_park_scenery.png', { type: 'image/png' });
                            handleImageSelected(testFile, URL.createObjectURL(blob));
                          } catch (e) {
                            showToast('Could not load sample file.', 'error');
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors shadow-2xs"
                      >
                        🌿 Test Clean Scene (Negative)
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Detection Card Result */}
                {(isScanning || aiDetection) && (
                  <div className="mt-4">
                    <AiDetectionCard
                      detection={aiDetection}
                      isScanning={isScanning}
                      onRescan={() => selectedFile && runAiDetection(selectedFile, category)}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* STEP 2: Category & Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-base">Garbage Category & Details</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Garbage Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (selectedFile) runAiDetection(selectedFile, cat);
                    }}
                    className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                      category === cat
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Additional Description / Landmarks
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Near public bus stop, overflowing onto pedestrian walkway, hazardous sharp glass present..."
                rows={3}
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* STEP 3: Location System */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-base">Location & Mapping</h3>
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-200"
              >
                <Navigation className="w-3.5 h-3.5" />
                Use My Location
              </button>
            </div>

            {/* Interactive Map Picker */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <MapPicker
                mode="picker"
                initialLat={latitude}
                initialLon={longitude}
                onLocationSelect={handleLocationSelect}
                height="280px"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              * Click on the map or drag the green pin to position exact waste coordinates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Area / Ward</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Kothrud"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Coordinates (Lat / Lon)</label>
                <input
                  type="text"
                  value={`${latitude}, ${longitude}`}
                  readOnly
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Opposite Metro Pillar 42, Main Road"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            {!user ? (
              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <Lock className="w-5 h-5 text-amber-400" />
                Sign In to Upload Photo & Submit Report
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isScanning || (!selectedFile && !previewUrl)}
                className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isSubmitting || isScanning || (!selectedFile && !previewUrl)
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>Registering Report...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Verified Garbage Report
                  </>
                )}
              </button>
            )}
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Protected by CleanSight Anti-Fraud Shield. Points credited upon municipal or photographic verification.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
