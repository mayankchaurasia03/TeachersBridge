import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatApiError } from '../lib/api';
import { GraduationCap, Eye, EyeOff, Loader2, BookOpen, Star } from 'lucide-react';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup } = useAuth();
  const isLogin = mode === 'login';
  const defaultRole = searchParams.get('role') || 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        user = await signup(name, email, password, phone, role);
      }
      navigate(user.role === 'student' ? '/dashboard' : '/teach');
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1604177091072-b7b677a077f6?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80"
          alt="Education"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-slate-900/80" />
        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Outfit'] text-2xl font-bold text-white">TeacherBridge</span>
          </div>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">
            {isLogin ? 'Welcome back to your learning journey' : 'Start your learning journey today'}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Connect with the best tutors and students on our platform. Simple, fast, and effective.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 lg:hidden mb-8" data-testid="auth-logo">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Outfit'] text-xl font-bold text-slate-900">TeacherBridge</span>
          </Link>

          <h1 className="font-['Outfit'] text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="text-slate-500 mb-8">
            {isLogin ? 'Enter your credentials to continue.' : 'Join as a student or teacher to get started.'}
          </p>

          {error && (
            <div data-testid="auth-error" className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    data-testid="signup-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    data-testid="signup-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                    className="w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'student', label: 'Student', desc: 'I need a tutor', icon: BookOpen },
                      { value: 'teacher', label: 'Teacher', desc: 'I want to teach', icon: Star },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        data-testid={`role-${r.value}-btn`}
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                          role === r.value
                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <r.icon className={`w-6 h-6 ${role === r.value ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className={`font-semibold text-sm ${role === r.value ? 'text-blue-700' : 'text-slate-700'}`}>{r.label}</span>
                        <span className={`text-xs ${role === r.value ? 'text-blue-500' : 'text-slate-400'}`}>{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                data-testid="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  data-testid="auth-password-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full border border-slate-200 bg-white rounded-lg px-4 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              data-testid="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-6 py-3 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              data-testid="auth-switch-link"
              to={isLogin ? '/signup' : '/login'}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
