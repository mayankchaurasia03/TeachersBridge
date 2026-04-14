import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { formatApiError } from '../lib/api';
import Header from '../components/Header';
import { Clock, IndianRupee, Link2, Loader2, CheckCircle, Search, BookOpen, Wallet, Filter, X, Phone, Mail, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [search, setSearch] = useState('');
  const [wallet, setWallet] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterBudgetMin, setFilterBudgetMin] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (filterSubject) params.subject = filterSubject;
      if (filterBudgetMin) params.budget_min = parseFloat(filterBudgetMin);
      if (filterBudgetMax) params.budget_max = parseFloat(filterBudgetMax);

      const [reqRes, walletRes, subjectsRes] = await Promise.all([
        api.get('/requirements', { params }),
        api.get('/wallet'),
        api.get('/subjects'),
      ]);
      setRequirements(reqRes.data);
      setWallet(walletRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterSubject, filterBudgetMin, filterBudgetMax]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConnect = async (reqId) => {
    if (!wallet || wallet.balance < 1) {
      toast.error('Insufficient credits. Purchase more to connect.');
      navigate('/wallet');
      return;
    }
    setConnecting(reqId);
    try {
      const { data } = await api.post(`/connect/${reqId}`);
      toast.success(`Connected! Contact: ${data.student_email} | ${data.student_phone}`);
      fetchData();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setConnecting(null);
    }
  };

  const clearFilters = () => {
    setFilterSubject('');
    setFilterBudgetMin('');
    setFilterBudgetMax('');
  };

  const hasActiveFilters = filterSubject || filterBudgetMin || filterBudgetMax;

  const filtered = requirements.filter(
    (r) => r.subject.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors text-sm";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 data-testid="teacher-dashboard-heading" className="font-['Outfit'] text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Student Requirements
            </h1>
            <p className="text-slate-500 mt-1">Find students who need your expertise</p>
          </div>
          <button
            data-testid="wallet-balance-header"
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Credits</p>
              <p className="font-['Outfit'] text-xl font-bold text-slate-900">{wallet?.balance ?? '...'}</p>
            </div>
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              data-testid="search-requirements-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject or description..."
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors shadow-sm text-sm"
            />
          </div>
          <button
            data-testid="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all shadow-sm ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-white" />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div data-testid="filter-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">Filter Requirements</h3>
              {hasActiveFilters && (
                <button data-testid="clear-filters-btn" onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger data-testid="filter-subject-select" className="w-full">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Min Budget (Rs.)</label>
                <input
                  data-testid="filter-budget-min"
                  type="number"
                  min="0"
                  value={filterBudgetMin}
                  onChange={(e) => setFilterBudgetMin(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Max Budget (Rs.)</label>
                <input
                  data-testid="filter-budget-max"
                  type="number"
                  min="0"
                  value={filterBudgetMax}
                  onChange={(e) => setFilterBudgetMax(e.target.value)}
                  placeholder="10000"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-2">
              {search || hasActiveFilters ? 'No matching requirements' : 'No requirements yet'}
            </h3>
            <p className="text-slate-500">
              {hasActiveFilters ? 'Try adjusting your filters.' : 'Check back later for new student requirements.'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req, idx) => (
              <div key={req.id} data-testid={`teacher-req-card-${idx}`} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {req.student_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{req.student_name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{req.total_connections} connected</span>
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-semibold text-slate-900 mb-2">{req.subject}</h3>
                  <p className="text-slate-500 text-sm mb-5 line-clamp-3 leading-relaxed">{req.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-5">
                    <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" />Rs.{req.budget}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{req.preferred_time}</span>
                    {req.preferred_language && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{req.preferred_language}</span>
                    )}
                  </div>

                  {req.already_connected ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-emerald-700">
                        <CheckCircle className="w-4 h-4" /> Connected
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900">{req.student_email}</span>
                        </div>
                        {req.student_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-900">{req.student_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      data-testid={`connect-btn-${idx}`}
                      onClick={() => handleConnect(req.id)}
                      disabled={connecting === req.id}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-6 py-3 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {connecting === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                      Connect ({req.credit_cost || 1} Credit{(req.credit_cost || 1) > 1 ? 's' : ''})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
