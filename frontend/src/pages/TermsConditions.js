import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
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

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        <h1 data-testid="terms-heading" className="font-['Outfit'] text-4xl font-bold text-slate-900 mb-2">Terms & Conditions</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">By accessing or using TeacherBridge ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including students, teachers, and visitors.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed">TeacherBridge is an online platform that connects students seeking tutoring with qualified teachers. Students can post their learning requirements, and teachers can use credits to connect with students and access their contact information. The platform facilitates the connection but does not directly provide tutoring services.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You must provide accurate and complete information during registration, including your name, email, and phone number.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must be at least 18 years of age or have parental consent to use the Service.</li>
              <li>Each user may create only one account. Duplicate accounts may be terminated.</li>
              <li>You agree not to impersonate another person or provide false information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">4. Student Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Students may post legitimate tutoring requirements with accurate subject, budget, and timing details.</li>
              <li>Students must not post misleading, offensive, or inappropriate content.</li>
              <li>Students agree that their contact information (email and phone) will be shared with teachers who use credits to connect.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">5. Teacher Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Teachers must provide accurate information about their qualifications and expertise.</li>
              <li>Teachers use credits to connect with students. The credit cost depends on the student's budget: 1 credit for budgets below Rs.2,000, 2 credits for Rs.2,000-3,499, and 3 credits for Rs.3,500 and above.</li>
              <li>Teachers must not misuse student contact information obtained through the platform.</li>
              <li>Teachers are solely responsible for the quality of tutoring they provide.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">6. Credits & Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Credits can be purchased through the platform using Razorpay payment gateway.</li>
              <li>Available plans: Starter (3 credits - Rs.49), Growth (7 credits - Rs.99), Pro (11 credits - Rs.149).</li>
              <li>Credits have no expiry date once purchased.</li>
              <li>Credits are non-transferable between accounts.</li>
              <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">7. Prohibited Activities</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Using the Service for any illegal or unauthorized purpose.</li>
              <li>Spamming, phishing, or sending unsolicited communications.</li>
              <li>Attempting to gain unauthorized access to other accounts or systems.</li>
              <li>Scraping, data mining, or automated collection of information from the Service.</li>
              <li>Posting false, misleading, or defamatory content.</li>
              <li>Circumventing the credit system to access student contact information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">8. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">TeacherBridge acts as a platform to facilitate connections between students and teachers. We do not guarantee the quality, safety, or legality of tutoring services provided by teachers. We are not liable for any disputes, damages, or losses arising from interactions between students and teachers.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">9. Termination</h2>
            <p className="text-slate-600 leading-relaxed">We reserve the right to suspend or terminate your account at any time for violation of these terms, without prior notice. Upon termination, your right to use the Service ceases immediately. Unused credits may be forfeited upon termination for cause.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">10. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">11. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the Service constitutes acceptance of the modified terms.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">12. Contact</h2>
            <p className="text-slate-600 leading-relaxed">For questions about these Terms & Conditions, please contact us at <a href="mailto:support@teacherbridge.com" className="text-blue-600 hover:text-blue-700 font-medium">support@teacherbridge.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
