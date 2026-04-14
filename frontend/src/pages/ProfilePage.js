import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { formatApiError } from '../lib/api';
import Header from '../components/Header';
import { Loader2, Link2, BookOpen, Award, Calendar, ArrowLeft, Save, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', expertise: '', bio: '' });

  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetId = userId || currentUser?.id;

  const fetchProfile = useCallback(async () => {
    if (!targetId) return;
    try {
      const { data } = await api.get(`/profile/${targetId}`);
      setProfile(data);
      setForm({
        name: data.name || '',
        phone: currentUser?.phone || '',
        expertise: data.expertise || '',
        bio: data.bio || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [targetId, currentUser?.phone]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/profile', form);
      setProfile(prev => ({ ...prev, ...data }));
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-['Outfit'] text-2xl font-semibold text-slate-900 mb-2">Profile not found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 font-medium text-sm mt-4">Go back</button>
        </div>
      </div>
    );
  }

  const expertiseList = profile.expertise ? profile.expertise.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <span className="font-['Outfit'] text-2xl font-bold text-blue-600">
                  {profile.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                {editing ? (
                  <input
                    data-testid="profile-name-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls + ' mb-2 max-w-xs font-semibold'}
                    placeholder="Your name"
                  />
                ) : (
                  <h1 data-testid="profile-name" className="font-['Outfit'] text-2xl font-semibold text-slate-900">{profile.name}</h1>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    profile.role === 'teacher' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{profile.role}</span>
                  {profile.total_connections !== undefined && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Link2 className="w-3.5 h-3.5" /> {profile.total_connections} connections
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" /> Joined {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              {isOwnProfile && !editing && (
                <button
                  data-testid="edit-profile-btn"
                  onClick={() => setEditing(true)}
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium rounded-lg px-4 py-2 text-sm shadow-sm transition-all"
                >
                  Edit Profile
                </button>
              )}
              {isOwnProfile && editing && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium rounded-lg px-4 py-2 text-sm shadow-sm transition-all">Cancel</button>
                  <button
                    data-testid="save-profile-btn"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-4 py-2 text-sm shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                </div>
              )}
            </div>

            {/* Phone */}
            {isOwnProfile && editing && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  data-testid="profile-phone-input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className={inputCls}
                />
              </div>
            )}

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">About</h3>
              {editing ? (
                <textarea
                  data-testid="profile-bio-input"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Write a short bio about yourself..."
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              ) : (
                <p className="text-slate-600 leading-relaxed text-sm">
                  {profile.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Expertise */}
            {(profile.role === 'teacher' || editing) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" /> Expertise Areas
                </h3>
                {editing ? (
                  <div>
                    <input
                      data-testid="profile-expertise-input"
                      type="text"
                      value={form.expertise}
                      onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                      placeholder="Mathematics, Physics, Chemistry (comma-separated)"
                      className={inputCls}
                    />
                    <p className="text-xs text-slate-400 mt-1">Separate subjects with commas</p>
                  </div>
                ) : expertiseList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {expertiseList.map((exp) => (
                      <span key={exp} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {exp}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No expertise areas added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
