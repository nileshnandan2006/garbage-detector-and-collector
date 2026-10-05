import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';
import { api } from '../services/api.js';
import { Report } from '../types/index.js';
import { MapPicker } from '../components/MapPicker.js';
import { BeforeAfterModal } from '../components/BeforeAfterModal.js';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  Camera,
  Upload,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Scale,
  X
} from 'lucide-react';

interface CollectorDashboardProps {
  navigate: (page: string) => void;
}

export const CollectorDashboard: React.FC<CollectorDashboardProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [tasks, setTasks] = useState<Report[]>([]);
  const [selectedTask, setSelectedTask] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'in_progress' | 'completed'>('assigned');
  const [isLoading, setIsLoading] = useState(true);

  // Completion / After Photo Modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [cleaningNotes, setCleaningNotes] = useState('');
  const [wasteWeightKg, setWasteWeightKg] = useState('18.5');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  // View Before/After modal state
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTasks();
      setTasks(res.tasks || []);
      if (res.tasks && res.tasks.length > 0 && !selectedTask) {
        setSelectedTask(res.tasks[0]);
      }
    } catch (err) {
      console.error('Failed to load collector tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Status transitions
  const handleAcceptTask = async (taskId: string) => {
    try {
      await api.updateTaskStatus(taskId, 'COLLECTOR ON THE WAY');
      showToast('Task accepted! Citizen notified that collector is on the way.', 'success');
      await fetchTasks();
    } catch (err: any) {
      showToast(err.message || 'Failed to accept task', 'error');
    }
  };

  const handleStartCleaning = async (taskId: string) => {
    try {
      await api.updateTaskStatus(taskId, 'CLEANING IN PROGRESS');
      showToast('Cleaning started! GPS site presence confirmed.', 'success');
      await fetchTasks();
    } catch (err: any) {
      showToast(err.message || 'Failed to start cleaning', 'error');
    }
  };

  const handleOpenCompleteModal = (task: Report) => {
    setSelectedTask(task);
    setAfterImageFile(null);
    setAfterImagePreview(null);
    setCleaningNotes('Site completely cleared of refuse, disinfected and swept clean.');
    setShowCompleteModal(true);
  };

  const handleAfterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterImageFile(file);
      setAfterImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!afterImageFile && !afterImagePreview) {
      showToast('Mandatory requirement: Upload an "After Cleaning" photo to verify completion.', 'error');
      return;
    }

    setIsSubmittingCompletion(true);
    try {
      const formData = new FormData();
      if (afterImageFile) {
        formData.append('after_image', afterImageFile);
      } else {
        // Fallback default clean image
        formData.append('after_image_url', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800');
      }
      formData.append('notes', cleaningNotes);
      formData.append('waste_weight_kg', wasteWeightKg);

      await api.completeTask(selectedTask.id, formData);
      showToast('Cleanup verified! +20 Before/After bonus awarded to citizen.', 'success');
      setShowCompleteModal(false);
      await fetchTasks();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to complete task', 'error');
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  // Filter tasks
  const assignedTasks = tasks.filter((t) => ['VERIFIED', 'ASSIGNED'].includes(t.status));
  const inProgressTasks = tasks.filter((t) => ['COLLECTOR ON THE WAY', 'CLEANING IN PROGRESS'].includes(t.status));
  const completedTasks = tasks.filter((t) => ['CLEANED', 'CLOSED'].includes(t.status));

  const currentDisplayTasks =
    activeTab === 'assigned'
      ? assignedTasks
      : activeTab === 'in_progress'
      ? inProgressTasks
      : completedTasks;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-amber-950 text-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 text-amber-300 text-xs font-bold border border-amber-700/60 mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Municipal Sanitation Field Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Collector Dispatch: {user?.name || 'Suresh Kumar'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl">
            Assigned Ward: Pune Central Zone • Receive live priority garbage alerts, navigate to site, clean, and upload photographic verification.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'assigned' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-amber-900/60 text-amber-200 hover:bg-amber-900'
            }`}
          >
            Assigned ({assignedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'in_progress' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-amber-900/60 text-amber-200 hover:bg-amber-900'
            }`}
          >
            Active ({inProgressTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'completed' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-amber-900/60 text-amber-200 hover:bg-amber-900'
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Today's Assigned</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{assignedTasks.length}</div>
          <span className="text-[10px] text-amber-600 font-bold">Awaiting dispatch</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Cleaning In Progress</span>
          <div className="text-2xl font-black text-sky-600 font-mono">{inProgressTasks.length}</div>
          <span className="text-[10px] text-sky-600 font-bold">Field staff active</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Completed Cleanups</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{completedTasks.length}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Before/After verified</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">Est. Waste Cleared</span>
          <div className="text-2xl font-black text-teal-600 font-mono">
            {completedTasks.length * 18.5} kg
          </div>
          <span className="text-[10px] text-teal-600 font-bold">Dispatched to recycling</span>
        </div>
      </div>

      {/* Main Task List & Interactive Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Task Cards */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {activeTab === 'assigned'
              ? 'New Assigned Collection Tasks'
              : activeTab === 'in_progress'
              ? 'Active Tasks in Progress'
              : 'Completed & Verified Collections'}
          </h2>

          {currentDisplayTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-40" />
              <h4 className="font-bold text-slate-800">No tasks in this category</h4>
              <p className="text-xs text-slate-500">All current reports have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentDisplayTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-100">
                        <img
                          src={task.image_url}
                          alt={task.category}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-white backdrop-blur-xs">
                          {task.ai_severity}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{task.id.slice(0, 8)}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {task.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-base">{task.category}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{task.address}, {task.area}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            ~1.2 km away
                          </span>
                        </div>

                        {/* Action Buttons for Task */}
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {['VERIFIED', 'ASSIGNED'].includes(task.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptTask(task.id);
                              }}
                              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                            >
                              Accept Task
                            </button>
                          )}

                          {task.status === 'COLLECTOR ON THE WAY' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartCleaning(task.id);
                              }}
                              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                            >
                              Start Cleaning
                            </button>
                          )}

                          {task.status === 'CLEANING IN PROGRESS' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCompleteModal(task);
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              Upload After Photo & Complete
                            </button>
                          )}

                          {['CLEANED', 'CLOSED'].includes(task.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(task);
                                setShowEvidenceModal(true);
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                            >
                              View Cleaned Audit ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Task Details & Map */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Task Navigation & Map</h2>

            {selectedTask ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{selectedTask.area} Collection Point</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    GPS Coordinates Linked
                  </span>
                </div>

                {/* Map Display */}
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <MapPicker
                    mode="viewer"
                    reports={[selectedTask]}
                    initialLat={selectedTask.latitude}
                    initialLon={selectedTask.longitude}
                    height="240px"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                  <p className="font-bold text-slate-800">{selectedTask.address}</p>
                  <p className="text-slate-500">{selectedTask.description || 'No extra notes provided by citizen.'}</p>
                  <div className="pt-1 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>Lat: {selectedTask.latitude}</span>
                    <span>Lon: {selectedTask.longitude}</span>
                  </div>
                </div>

                {/* Quick action button depending on status */}
                {selectedTask.status === 'CLEANING IN PROGRESS' ? (
                  <button
                    onClick={() => handleOpenCompleteModal(selectedTask)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Upload "After Cleaning" Photo & Mark Completed
                  </button>
                ) : selectedTask.status === 'COLLECTOR ON THE WAY' ? (
                  <button
                    onClick={() => handleStartCleaning(selectedTask.id)}
                    className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
                  >
                    Start Cleaning
                  </button>
                ) : ['VERIFIED', 'ASSIGNED'].includes(selectedTask.status) ? (
                  <button
                    onClick={() => handleAcceptTask(selectedTask.id)}
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
                  >
                    Accept This Task
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-sm border border-slate-200">
                Select a collection task on the left to view navigation map.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Upload After Photo & Complete Task */}
      {showCompleteModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Complete Collection Task</h3>
                  <p className="text-xs text-slate-500">Report #{selectedTask.id.slice(0, 8)} • {selectedTask.area}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCompletion} className="space-y-4">
              {/* Mandatory After Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  "After Cleaning" Photo <span className="text-rose-500">* (Mandatory)</span>
                </label>

                {afterImagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 h-48">
                    <img
                      src={afterImagePreview}
                      alt="After cleaning preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAfterImageFile(null);
                        setAfterImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all block">
                    <Camera className="w-10 h-10 text-emerald-600 mb-2" />
                    <span className="text-xs font-bold text-slate-800">
                      Snap or Upload Clean Area Photo
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Show spotless, swept, or power-washed ground
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAfterImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Weight & Segregation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Collected Mass (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={wasteWeightKg}
                    onChange={(e) => setWasteWeightKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Bonus Reward
                  </label>
                  <input
                    type="text"
                    value="+20 Pts Before/After Bonus"
                    readOnly
                    className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Collector Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Collection & Disposal Notes
                </label>
                <textarea
                  value={cleaningNotes}
                  onChange={(e) => setCleaningNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCompletion}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmittingCompletion ? 'Verifying...' : 'Confirm Cleanup & Credit Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Before / After Evidence Modal */}
      {showEvidenceModal && selectedTask && (
        <BeforeAfterModal
          report={selectedTask}
          evidence={selectedTask.evidence}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}
    </div>
  );
};
