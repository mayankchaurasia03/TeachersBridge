import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function ShippingPolicy() {
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
        <h1 data-testid="shipping-policy-heading" className="font-['Outfit'] text-4xl font-bold text-slate-900 mb-2">Shipping & Delivery Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">1. Nature of Service</h2>
            <p className="text-slate-600 leading-relaxed">TeacherBridge is a digital platform that provides online services. We do not sell or ship any physical goods. All products and services offered through TeacherBridge are delivered digitally.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">2. Digital Delivery</h2>
            <p className="text-slate-600 leading-relaxed mb-3">The following digital products/services are delivered electronically:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Credits:</strong> Upon successful payment through Razorpay, credits are instantly added to your TeacherBridge wallet. Delivery is immediate and automatic.</li>
              <li><strong>Student Contact Information:</strong> When a teacher uses credits to connect with a student, the student's contact details (email and phone number) are instantly displayed on the platform.</li>
              <li><strong>Account Access:</strong> Upon registration, you receive immediate access to all features available for your role (student or teacher).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">3. Delivery Timeline</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Service</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Credit Purchase</td><td className="px-6 py-3 text-sm text-slate-700">Instant (upon payment confirmation)</td></tr>
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Student Connection</td><td className="px-6 py-3 text-sm text-slate-700">Instant (upon credit deduction)</td></tr>
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Account Creation</td><td className="px-6 py-3 text-sm text-slate-700">Instant (upon registration)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">4. Delivery Issues</h2>
            <p className="text-slate-600 leading-relaxed mb-3">In rare cases, you may experience delivery issues:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Credits Not Received:</strong> If credits are not added to your wallet after a successful payment, please wait 5 minutes and refresh the page. If the issue persists, contact us with your transaction ID.</li>
              <li><strong>Payment Pending:</strong> Sometimes payments may take a few minutes to be confirmed by Razorpay. If the transaction shows as "pending", please wait up to 30 minutes before contacting support.</li>
              <li><strong>Technical Errors:</strong> If you experience any technical issues preventing delivery of digital services, please contact our support team immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">5. No Physical Shipping</h2>
            <p className="text-slate-600 leading-relaxed">As TeacherBridge is a purely digital service, there are no physical products to ship. No shipping charges, delivery addresses, or logistics are involved in any transaction on our platform.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">6. Service Availability</h2>
            <p className="text-slate-600 leading-relaxed">TeacherBridge is available 24/7 across India. Our digital services can be accessed from any location with an internet connection. We strive to maintain 99.9% uptime, though occasional maintenance windows may occur.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">For any delivery-related queries, please contact us at <a href="mailto:support@teacherbridge.com" className="text-blue-600 hover:text-blue-700 font-medium">support@teacherbridge.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
