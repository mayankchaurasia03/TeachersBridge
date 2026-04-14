import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { formatApiError } from '../lib/api';
import Header from '../components/Header';
import { Plus, Clock, IndianRupee, Loader2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ subject: '', description: '', budget: '', preferred_time: '', preferred_language: 'Hindi' });

  const fetchRequirements = useCallback(async () => {
    try {
      const { data } = await api.get('/requirements/my');
      setRequirements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRequirements(); }, [fetchRequirements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/requirements', { ...form, budget: parseFloat(form.budget) });
      setShowForm(false);
      setForm({ subject: '', description: '', budget: '', preferred_time: '', preferred_language: 'Hindi' });
      fetchRequirements();
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 data-testid="student-dashboard-heading" className="font-['Outfit'] text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              My Requirements
            </h1>
            <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            data-testid="post-requirement-btn"
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Post Requirement
          </button>
        </div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-['Outfit'] text-xl font-semibold">Post a New Requirement</DialogTitle>
              <DialogDescription>Fill in the details about what you need help with.</DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <input data-testid="req-subject-input" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics, Physics" required className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea data-testid="req-description-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what help you need..." required rows={3} className={inputCls + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget (Rs.)</label>
                  <input data-testid="req-budget-input" type="number" min="0" step="any" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="500" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Time</label>
                  <input data-testid="req-time-input" type="text" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} placeholder="Evenings 6-8 PM" required className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Language</label>
                <select
                  data-testid="req-language-select"
                  value={form.preferred_language}
                  onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
                  className={inputCls}
                >
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Urdu">Urdu</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium rounded-lg px-5 py-2.5 text-sm transition-colors">Cancel</button>
                <button data-testid="submit-requirement-btn" type="submit" disabled={submitting} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-5 py-2.5 text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-2">No requirements yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Post your first learning requirement and let qualified teachers find you.</p>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-all active:scale-[0.98] text-sm">
              Post Your First Requirement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req, idx) => (
              <div key={req.id} data-testid={`requirement-card-${idx}`} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-['Outfit'] text-lg font-semibold text-slate-900">{req.subject}</h3>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ml-2">
                      {req.connections?.length || 0} {req.connections?.length === 1 ? 'response' : 'responses'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{req.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" />Rs.{req.budget}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{req.preferred_time}</span>
                    {req.preferred_language && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{req.preferred_language}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
