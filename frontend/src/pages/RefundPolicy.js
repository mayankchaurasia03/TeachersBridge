import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function RefundPolicy() {
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
        <h1 data-testid="refund-policy-heading" className="font-['Outfit'] text-4xl font-bold text-slate-900 mb-2">Refund & Cancellation Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: April 13, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">1. Overview</h2>
            <p className="text-slate-600 leading-relaxed">This Refund & Cancellation Policy outlines the terms under which refunds and cancellations are handled for credit purchases made on TeacherBridge. We strive to ensure fair and transparent policies for all our users.</p>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">2. Credit Purchases</h2>
            <p className="text-slate-600 leading-relaxed mb-3">TeacherBridge offers the following credit plans:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Plan</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Starter</td><td className="px-6 py-3 text-sm text-slate-700">Rs.49</td><td className="px-6 py-3 text-sm text-slate-700">3 Credits</td></tr>
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Growth</td><td className="px-6 py-3 text-sm text-slate-700">Rs.99</td><td className="px-6 py-3 text-sm text-slate-700">7 Credits</td></tr>
                  <tr><td className="px-6 py-3 text-sm text-slate-700">Pro</td><td className="px-6 py-3 text-sm text-slate-700">Rs.149</td><td className="px-6 py-3 text-sm text-slate-700">11 Credits</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">3. Refund Eligibility</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Refunds may be requested under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Payment Error:</strong> If you were charged multiple times for the same purchase due to a technical error, we will refund the duplicate charges in full.</li>
              <li><strong>Credits Not Delivered:</strong> If credits were not added to your wallet after a successful payment, we will either add the credits or issue a full refund.</li>
              <li><strong>Unused Credits:</strong> Refund requests for unused credits may be considered within 7 days of purchase on a case-by-case basis.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">4. Non-Refundable Scenarios</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Used Credits:</strong> Credits that have already been used to connect with students are non-refundable.</li>
              <li><strong>Dissatisfaction with Tutoring:</strong> Since TeacherBridge only facilitates connections and does not provide tutoring directly, we cannot issue refunds for dissatisfaction with a teacher's services.</li>
              <li><strong>Account Termination:</strong> Credits remaining in accounts terminated for violation of Terms & Conditions are non-refundable.</li>
              <li><strong>After 7 Days:</strong> Refund requests made more than 7 days after purchase will not be considered.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">5. Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Before Payment:</strong> You may cancel a credit purchase at any time before completing the payment through Razorpay.</li>
              <li><strong>After Payment:</strong> Once payment is completed and credits are added to your wallet, the purchase cannot be cancelled. However, you may request a refund as per the eligibility criteria above.</li>
              <li><strong>Account Cancellation:</strong> You may deactivate or delete your account at any time by contacting us. Unused credits should be used or a refund requested before account deletion.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">6. Refund Process</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>To request a refund, email us at <a href="mailto:support@teacherbridge.com" className="text-blue-600 hover:text-blue-700 font-medium">support@teacherbridge.com</a> with your registered email, transaction ID, and reason for the refund.</li>
              <li>Refund requests will be reviewed within 3-5 business days.</li>
              <li>Approved refunds will be processed to the original payment method within 7-10 business days.</li>
              <li>You will receive an email confirmation once the refund is processed.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Outfit'] text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">For refund or cancellation inquiries, please contact us at <a href="mailto:support@teacherbridge.com" className="text-blue-600 hover:text-blue-700 font-medium">support@teacherbridge.com</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
