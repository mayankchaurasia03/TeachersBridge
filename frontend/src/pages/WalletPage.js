import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api, { formatApiError } from '../lib/api';
import Header from '../components/Header';
import { Wallet as WalletIcon, CreditCard, ArrowUpRight, ArrowDownRight, Loader2, Zap, Star, Crown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [walletRes, plansRes] = await Promise.all([api.get('/wallet'), api.get('/credit-plans')]);
      setWallet(walletRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) { resolve(true); return; }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (planId) => {
    setPurchasing(planId);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Failed to load payment gateway'); setPurchasing(null); return; }
      const { data: orderData } = await api.post('/create-order', { plan_id: planId });
      const options = {
        key: orderData.key_id || RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TeacherBridge',
        description: 'Credit Purchase',
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const { data } = await api.post('/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              transaction_id: orderData.transaction_id,
            });
            toast.success(`${data.credits_added} credits added! New balance: ${data.new_balance}`);
            fetchData();
          } catch (err) {
            toast.error(formatApiError(err.response?.data?.detail));
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#2563eb' },
        modal: { ondismiss: () => setPurchasing(null) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (res) => { toast.error('Payment failed: ' + res.error.description); setPurchasing(null); });
      rzp.open();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setPurchasing(null);
    }
  };

  const planMeta = [
    { name: 'Starter', icon: Zap, accent: 'bg-blue-50 text-blue-600' },
    { name: 'Growth', icon: Star, accent: 'bg-amber-50 text-amber-600', popular: true },
    { name: 'Pro', icon: Crown, accent: 'bg-emerald-50 text-emerald-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Balance Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-10 mb-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative flex items-center gap-5">
            <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
              <WalletIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Credit Balance</p>
              <h2 data-testid="wallet-balance" className="font-['Outfit'] text-5xl font-bold text-white">{wallet?.balance ?? 0}</h2>
            </div>
          </div>
          <p className="relative text-blue-200 text-sm mt-4">Each connection costs 1 credit. Purchase credits below to connect with students.</p>
        </div>

        {/* Plans */}
        <div className="mb-12">
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">Purchase Credits</h2>
          <p className="text-slate-500 mb-8">Choose a plan that fits your needs.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const meta = planMeta[idx] || planMeta[0];
              const Icon = meta.icon;
              return (
                <div
                  key={plan.plan_id}
                  data-testid={`credit-plan-${plan.plan_id}`}
                  className={`rounded-xl p-8 transition-all duration-200 ${
                    meta.popular
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-2 ring-blue-600 ring-offset-2'
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {meta.popular && (
                    <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Best Value</span>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${meta.popular ? 'bg-white/15' : meta.accent}`}>
                    <Icon className={`w-6 h-6 ${meta.popular ? 'text-white' : ''}`} />
                  </div>
                  <h3 className={`font-['Outfit'] text-lg font-semibold mb-1 ${meta.popular ? 'text-white' : 'text-slate-900'}`}>{meta.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`font-['Outfit'] text-4xl font-bold ${meta.popular ? 'text-white' : 'text-slate-900'}`}>{plan.credits}</span>
                    <span className={`text-sm font-medium ${meta.popular ? 'text-blue-200' : 'text-slate-500'}`}>credits</span>
                  </div>
                  <p className={`text-2xl font-bold mb-6 ${meta.popular ? 'text-white' : 'text-slate-900'}`}>
                    <span className="text-sm font-normal">Rs.</span>{plan.price_inr}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {[`${plan.credits} teacher connections`, 'Instant delivery', 'No expiry'].map((f) => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${meta.popular ? 'text-blue-100' : 'text-slate-600'}`}>
                        <CheckCircle className={`w-4 h-4 shrink-0 ${meta.popular ? 'text-blue-300' : 'text-green-500'}`} />{f}
                      </li>
                    ))}
                  </ul>
                  <button
                    data-testid={`buy-plan-${plan.plan_id}-btn`}
                    onClick={() => handlePurchase(plan.plan_id)}
                    disabled={purchasing === plan.plan_id}
                    className={`w-full font-semibold rounded-lg px-6 py-3 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${
                      meta.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {purchasing === plan.plan_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    Buy Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">Transaction History</h2>
          <p className="text-slate-500 mb-6">Your recent credit transactions.</p>
          {wallet?.transactions?.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {wallet.transactions.map((txn) => (
                    <tr key={txn.id} data-testid={`txn-${txn.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${txn.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            {txn.type === 'credit' ? <ArrowDownRight className="w-5 h-5 text-emerald-600" /> : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{txn.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(txn.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          txn.status === 'success' ? 'bg-emerald-50 text-emerald-700' : txn.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>{txn.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No transactions yet. Purchase credits to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
