import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, BookOpen, Users, Zap, CreditCard, CheckCircle, ChevronRight, GraduationCap, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goStart = () => {
    if (user) navigate(user.role === 'student' ? '/dashboard' : '/teach');
    else navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Outfit'] text-xl font-bold text-slate-900">TeacherBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <button data-testid="header-login-btn" onClick={() => navigate('/login')} className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors px-4 py-2">Sign In</button>
            <button data-testid="header-signup-btn" onClick={() => navigate('/signup')} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm rounded-lg px-5 py-2.5 shadow-sm transition-all active:scale-[0.98]">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="max-w-3xl">
            <div className="anim-fade-up inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-600 anim-pulse-subtle" />
              <span className="text-sm font-semibold text-blue-700">Trusted by 10,000+ learners</span>
            </div>
            <h1 className="anim-fade-up anim-delay-1 font-['Outfit'] text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Connect with the right<br />
              <span className="text-blue-600">tutor</span> instantly
            </h1>
            <p className="anim-fade-up anim-delay-2 text-lg text-slate-600 leading-relaxed max-w-xl mb-10">
              Students post their learning needs. Teachers connect directly. No middlemen — just fast, meaningful educational connections.
            </p>
            <div className="anim-fade-up anim-delay-3 flex flex-wrap gap-4">
              <button data-testid="hero-get-started-btn" onClick={goStart} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg px-8 py-3.5 shadow-sm transition-all active:scale-[0.98] flex items-center gap-2 text-base">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button data-testid="hero-learn-more-btn" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-medium rounded-lg px-8 py-3.5 shadow-sm transition-all text-base">
                How It Works
              </button>
            </div>
            <div className="anim-fade-up anim-delay-4 flex items-center gap-6 mt-10 text-sm text-slate-500">
              {['Free for students', 'Verified teachers', 'Instant connections'].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Simple Process</p>
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, step: '01', title: 'Post Your Need', desc: 'Students describe subject, timing, and budget for tutoring.', accent: 'bg-blue-50 text-blue-600' },
              { icon: Users, step: '02', title: 'Teachers Connect', desc: 'Qualified teachers browse needs and unlock student contacts with credits.', accent: 'bg-emerald-50 text-emerald-600' },
              { icon: Zap, step: '03', title: 'Start Learning', desc: 'Direct communication means faster scheduling and real results.', accent: 'bg-amber-50 text-amber-600' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-xl ${item.accent} flex items-center justify-center mb-6`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {item.step}</span>
                <h3 className="font-['Outfit'] text-xl font-semibold text-slate-900 mt-2 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students & Teachers */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-10 sm:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <BookOpen className="w-10 h-10 mb-6 text-blue-200" />
                <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold mb-4">For Students</h3>
                <p className="text-blue-100 leading-relaxed mb-6 max-w-md">Post your learning requirements and let qualified tutors come to you. Completely free to use.</p>
                <ul className="space-y-3 mb-8">
                  {['Post unlimited requirements', 'See teacher responses', 'Direct contact with tutors'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-blue-100"><CheckCircle className="w-4 h-4 text-blue-300 shrink-0" />{f}</li>
                  ))}
                </ul>
                <button data-testid="student-signup-btn" onClick={() => navigate('/signup?role=student')} className="bg-white text-blue-700 font-semibold rounded-lg px-6 py-3 shadow-sm hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center gap-2">
                  Join as Student <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 sm:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <Star className="w-10 h-10 mb-6 text-amber-400" />
                <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold mb-4">For Teachers</h3>
                <p className="text-slate-300 leading-relaxed mb-6 max-w-md">Browse student needs and connect with those who match your expertise. Use credits to unlock contacts.</p>
                <ul className="space-y-3 mb-8">
                  {['Browse all student requirements', 'Use 1 credit to connect', 'Affordable credit plans from Rs.49'].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300"><CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />{f}</li>
                  ))}
                </ul>
                <button data-testid="teacher-signup-btn" onClick={() => navigate('/signup?role=teacher')} className="bg-white text-slate-900 font-semibold rounded-lg px-6 py-3 shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center gap-2">
                  Join as Teacher <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Pricing</p>
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">Simple Credit Plans</h2>
            <p className="text-slate-600 max-w-lg mx-auto">Teachers use credits to connect with students. Each connection costs 1 credit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: 49, credits: 3, popular: false },
              { name: 'Growth', price: 99, credits: 7, popular: true },
              { name: 'Pro', price: 149, credits: 11, popular: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl p-8 transition-all duration-200 ${p.popular ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.03]' : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'}`}>
                {p.popular && <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Most Popular</span>}
                <h3 className={`font-['Outfit'] text-lg font-semibold mb-1 ${p.popular ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-['Outfit'] text-4xl font-bold ${p.popular ? 'text-white' : 'text-slate-900'}`}>{p.credits}</span>
                  <span className={`text-sm font-medium ${p.popular ? 'text-blue-200' : 'text-slate-500'}`}>credits</span>
                </div>
                <p className={`text-2xl font-bold mb-6 ${p.popular ? 'text-white' : 'text-slate-900'}`}>
                  <span className="text-sm font-normal">Rs.</span>{p.price}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[`${p.credits} student connections`, 'Instant credit delivery', 'No expiry on credits'].map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                      <CheckCircle className={`w-4 h-4 shrink-0 ${p.popular ? 'text-blue-300' : 'text-green-500'}`} />{f}
                    </li>
                  ))}
                </ul>
                <button data-testid={`plan-${p.name.toLowerCase()}-btn`} onClick={goStart} className={`w-full font-semibold rounded-lg px-6 py-3 transition-all active:scale-[0.98] ${p.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-['Outfit'] text-lg font-bold text-slate-900">TeacherBridge</span>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              <Link to="/privacy-policy" data-testid="footer-privacy-link" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link to="/terms" data-testid="footer-terms-link" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Terms & Conditions</Link>
              <Link to="/refund-policy" data-testid="footer-refund-link" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Refund & Cancellation</Link>
              <Link to="/shipping-policy" data-testid="footer-shipping-link" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Shipping & Delivery</Link>
              <Link to="/contact" data-testid="footer-contact-link" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link>
            </nav>
          </div>
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-400">&copy; 2026 TeacherBridge. All rights reserved.</p>
            {/* <p className="text-sm text-slate-400">support@teacherbridge.com</p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
