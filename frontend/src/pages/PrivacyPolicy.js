import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
        <h1 data-testid="privacy-policy-heading" className="font-['Outfit'] text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">TeacherBridge ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at teacherbridge.com (the "Service"). Please read this policy carefully. By using the Service, you consent to the data practices described in this policy.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and role (student/teacher) provided during registration.</li>
              <li><strong>Profile Information:</strong> Expertise areas, bio, and other details you choose to add to your profile.</li>
              <li><strong>Requirement Data:</strong> Subject, description, budget, preferred time, and preferred language for tutoring requirements posted by students.</li>
              <li><strong>Transaction Data:</strong> Credit purchase history, payment information processed through Razorpay, and connection records.</li>
              <li><strong>Usage Data:</strong> Log data, device information, IP addresses, browser type, and pages visited.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>To provide and maintain the Service, including facilitating connections between students and teachers.</li>
              <li>To process transactions and manage your credit wallet.</li>
              <li>To communicate with you about your account, transactions, and updates to the Service.</li>
              <li>To improve our Service and develop new features.</li>
              <li>To detect, prevent, and address technical issues and fraudulent activity.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">4. Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-3">We share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Teacher-Student Connections:</strong> When a teacher uses credits to connect with a student, the student's contact details (email and phone) are shared with the teacher.</li>
              <li><strong>Payment Processing:</strong> We share necessary payment information with Razorpay to process credit purchases.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
              <li>We do not sell your personal information to third parties.</li>
            </ul>
          </section>

          {/* <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">5. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">We implement appropriate technical and organizational measures to protect your personal information. Passwords are hashed using industry-standard encryption. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section> */}

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">5. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us at support@teacherbridge.com.</p>
          </section>

          {/* <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">7. Your Rights</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Access, update, or delete your personal information through your profile settings.</li>
              <li>Request a copy of your personal data.</li>
              <li>Withdraw consent for data processing where applicable.</li>
              <li>Lodge a complaint with a data protection authority.</li>
            </ul>
          </section> */}

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">6. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">We use essential cookies and local storage to maintain your session and authentication state. We do not use third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">7. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">8. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@teacherbridge.com" className="text-blue-600 hover:text-blue-700 font-medium">support@teacherbridge.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
