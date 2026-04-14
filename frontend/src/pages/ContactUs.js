import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Outfit'] text-xl font-bold text-slate-900">TeacherBridge</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 data-testid="contact-us-heading" className="font-['Outfit'] text-4xl font-bold text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Have a question, feedback, or need help? We'd love to hear from you. Reach out to us via email and we'll get back to you as soon as possible.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 sm:p-10 max-w-lg mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
              <a
                data-testid="contact-email-link"
                href="mailto:contactus@gmai.com"
                className="text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
              >
                contactus@gmai.com
              </a>
              <p className="text-slate-500 text-sm mt-1">We typically respond within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Support Hours</h3>
              <p className="text-slate-600">Monday - Saturday</p>
              <p className="text-slate-600">9:00 AM - 6:00 PM IST</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
              <p className="text-slate-600">India</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
