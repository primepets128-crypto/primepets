import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import {
  Save,
  CreditCard,
  Shield,
  Info,
  Zap,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Building2,
  Wallet,
  Package,
  FlaskConical,
  Radio,
} from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

// ─── Reusable Toggle Switch ──────────────────────────────────────────────────
function ToggleSwitch({ enabled, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#d07e20] focus:ring-offset-2 ${
        enabled ? 'bg-green-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Section Card ────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, iconColor = 'text-[#d07e20]', iconBg = 'bg-orange-50', children, badge }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        <h2 className="font-bold text-gray-800">{title}</h2>
        {badge}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Info Banner ─────────────────────────────────────────────────────────────
function InfoBanner({ icon: Icon, children, color = 'blue' }) {
  const colorMap = {
    blue:  { bg: 'bg-blue-50',  border: 'border-blue-100',  text: 'text-blue-800',  icon: 'text-blue-500'  },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', icon: 'text-amber-500' },
    green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-800', icon: 'text-green-500' },
    red:   { bg: 'bg-red-50',   border: 'border-red-100',   text: 'text-red-800',   icon: 'text-red-500'   },
  };
  const c = colorMap[color] ?? colorMap.blue;
  return (
    <div className={`flex items-start gap-3 ${c.bg} border ${c.border} rounded-xl p-4`}>
      <Icon size={18} className={`${c.icon} mt-0.5 shrink-0`} />
      <p className={`text-sm font-medium ${c.text}`}>{children}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminPayment() {
  const { frontendSettings, refreshData } = useData();

  const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [testMode, setTestMode] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState({
    upi: true,
    cards: true,
    netBanking: true,
    wallets: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Seed form from frontendSettings once available
  useEffect(() => {
    if (frontendSettings) {
      const key = frontendSettings.razorpayKeyId ?? '';
      setRazorpayKeyId(key);
      if (key) {
        setOnlinePaymentEnabled(true);
        setTestMode(!key.startsWith('rzp_live'));
      }
    }
  }, [frontendSettings]);

  const togglePaymentMethod = (method) => {
    setPaymentMethods(prev => ({ ...prev, [method]: !prev[method] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/settings', {
        ...(frontendSettings ?? {}),
        razorpayKeyId: onlinePaymentEnabled ? razorpayKeyId : '',
      });
      await refreshData();
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'Payment settings saved successfully!' } })
      );
    } catch (err) {
      console.error(err);
      window.dispatchEvent(
        new CustomEvent('toast', { detail: { message: 'Error saving payment settings' } })
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isLiveKey = razorpayKeyId.startsWith('rzp_live');
  const isTestKey = razorpayKeyId.startsWith('rzp_test');
  const keyIsValid = isLiveKey || isTestKey || razorpayKeyId === '';

  return (
    <div className="max-w-3xl animate-fade-in">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
              Payment Settings
            </h1>
            <p className="text-gray-500 font-medium">
              Configure Razorpay and cash-on-delivery options.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#a65d14] disabled:opacity-70 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Save size={18} />
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {/* ── How Razorpay Works Banner ──────────────────────────────── */}
        <ScrollReveal delay={50}>
          <div className="bg-gradient-to-r from-[#d07e20]/10 to-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4 items-start">
            <div className="p-3 bg-[#d07e20] rounded-xl shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">How Razorpay works in Prime Pets</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                When a customer places an order, the Razorpay checkout opens in a secure popup.
                After successful payment, the order is created on your server with a payment
                reference ID. Your{' '}
                <span className="font-semibold text-[#d07e20]">Key ID</span> is safe to expose on
                the frontend; your{' '}
                <span className="font-semibold text-red-600">Key Secret</span> must only live in
                your server environment.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Enable Online Payment ─────────────────────────────────── */}
        <ScrollReveal delay={100}>
          <SectionCard
            title="Online Payment (Razorpay)"
            icon={CreditCard}
            badge={
              <span
                className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                  onlinePaymentEnabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {onlinePaymentEnabled ? 'Enabled' : 'Disabled'}
              </span>
            }
          >
            <div className="space-y-6">
              {/* Master toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Enable Online Payment (Razorpay)</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Allow customers to pay online via UPI, cards, and more.
                  </p>
                </div>
                <ToggleSwitch
                  id="online-payment-toggle"
                  enabled={onlinePaymentEnabled}
                  onChange={setOnlinePaymentEnabled}
                />
              </div>

              {onlinePaymentEnabled && (
                <>
                  <hr className="border-gray-100" />

                  {/* Key ID */}
                  <div>
                    <label
                      htmlFor="razorpay-key-id"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Razorpay Key ID
                    </label>
                    <div className="relative">
                      <input
                        id="razorpay-key-id"
                        type="text"
                        value={razorpayKeyId}
                        onChange={e => setRazorpayKeyId(e.target.value)}
                        placeholder="rzp_test_..."
                        className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
                          !keyIsValid
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-[#d07e20] focus:ring-orange-100'
                        }`}
                      />
                      {razorpayKeyId && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {keyIsValid ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <AlertTriangle size={18} className="text-red-400" />
                          )}
                        </span>
                      )}
                    </div>
                    {isLiveKey && (
                      <p className="mt-1.5 text-xs font-semibold text-green-600">
                        ✓ Live key detected — real payments will be processed.
                      </p>
                    )}
                    {isTestKey && (
                      <p className="mt-1.5 text-xs font-semibold text-amber-600">
                        ✓ Test key detected — no real money will be charged.
                      </p>
                    )}
                    {!keyIsValid && razorpayKeyId && (
                      <p className="mt-1.5 text-xs font-semibold text-red-500">
                        Key must start with <code>rzp_test_</code> or <code>rzp_live_</code>.
                      </p>
                    )}
                  </div>

                  {/* Secret key info box */}
                  <InfoBanner icon={Shield} color="red">
                    Add{' '}
                    <code className="bg-red-100 px-1 py-0.5 rounded text-xs">
                      RAZORPAY_KEY_SECRET
                    </code>{' '}
                    to your{' '}
                    <code className="bg-red-100 px-1 py-0.5 rounded text-xs">server/.env</code>{' '}
                    file. Never expose the secret key here — it must stay server-side only.
                  </InfoBanner>
                </>
              )}
            </div>
          </SectionCard>
        </ScrollReveal>

        {/* ── Test / Live Mode ─────────────────────────────────────── */}
        {onlinePaymentEnabled && (
          <ScrollReveal delay={150}>
            <SectionCard
              title="Gateway Mode"
              icon={FlaskConical}
              iconColor={testMode ? 'text-amber-500' : 'text-green-600'}
              iconBg={testMode ? 'bg-amber-50' : 'bg-green-50'}
            >
              <div className="space-y-4">
                <InfoBanner icon={Info} color="blue">
                  Your mode is determined by the Key ID prefix. Selecting a mode here is a reminder
                  — make sure your Key ID matches the chosen mode.
                </InfoBanner>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  {/* Test Mode */}
                  <label
                    className={`flex-1 flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      testMode
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway-mode"
                      checked={testMode}
                      onChange={() => setTestMode(true)}
                      className="accent-amber-500"
                    />
                    <div>
                      <p className="font-bold text-gray-800">Test Mode</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Use test cards — no real charges.
                      </p>
                    </div>
                    {testMode && (
                      <Radio size={16} className="ml-auto text-amber-500 shrink-0" />
                    )}
                  </label>

                  {/* Live Mode */}
                  <label
                    className={`flex-1 flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      !testMode
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gateway-mode"
                      checked={!testMode}
                      onChange={() => setTestMode(false)}
                      className="accent-green-500"
                    />
                    <div>
                      <p className="font-bold text-gray-800">Live Mode</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Real payments — goes live immediately.
                      </p>
                    </div>
                    {!testMode && (
                      <CheckCircle size={16} className="ml-auto text-green-500 shrink-0" />
                    )}
                  </label>
                </div>

                {!testMode && (
                  <InfoBanner icon={AlertTriangle} color="amber">
                    You are in <strong>Live Mode</strong>. Real money will be deducted from your
                    customers. Make sure your Key ID starts with{' '}
                    <code className="bg-amber-100 px-1 rounded text-xs">rzp_live_</code>.
                  </InfoBanner>
                )}
              </div>
            </SectionCard>
          </ScrollReveal>
        )}

        {/* ── Payment Methods ───────────────────────────────────────── */}
        {onlinePaymentEnabled && (
          <ScrollReveal delay={200}>
            <SectionCard title="Payment Methods" icon={Smartphone}>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  These are displayed as notes / preferences. Razorpay automatically shows methods
                  based on your dashboard configuration.
                </p>

                {[
                  { key: 'upi',        label: 'UPI',         sub: 'Google Pay, PhonePe, Paytm…', icon: Smartphone },
                  { key: 'cards',      label: 'Cards',       sub: 'Visa, Mastercard, RuPay…',    icon: CreditCard },
                  { key: 'netBanking', label: 'Net Banking', sub: 'All major Indian banks',       icon: Building2  },
                  { key: 'wallets',    label: 'Wallets',     sub: 'Amazon Pay, Freecharge…',      icon: Wallet     },
                ].map(({ key, label, sub, icon: Icon }) => (
                  <div
                    key={key}
                    onClick={() => togglePaymentMethod(key)}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                      paymentMethods[key]
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethods[key] ? 'bg-green-100' : 'bg-gray-200'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={paymentMethods[key] ? 'text-green-600' : 'text-gray-400'}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-sm ${
                          paymentMethods[key] ? 'text-green-800' : 'text-gray-700'
                        }`}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        paymentMethods[key]
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {paymentMethods[key] && (
                        <svg
                          viewBox="0 0 10 8"
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="1 4 3.5 6.5 9 1" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </ScrollReveal>
        )}

        {/* ── Cash on Delivery ──────────────────────────────────────── */}
        <ScrollReveal delay={250}>
          <SectionCard
            title="Cash on Delivery (COD)"
            icon={Package}
            iconColor={codEnabled ? 'text-green-600' : 'text-gray-400'}
            iconBg={codEnabled ? 'bg-green-50' : 'bg-gray-100'}
            badge={
              <span
                className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                  codEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {codEnabled ? 'Available' : 'Unavailable'}
              </span>
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Allow Cash on Delivery</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Customers can pay in cash when their order is delivered.
                </p>
              </div>
              <ToggleSwitch
                id="cod-toggle"
                enabled={codEnabled}
                onChange={setCodEnabled}
              />
            </div>

            {!onlinePaymentEnabled && !codEnabled && (
              <div className="mt-4">
                <InfoBanner icon={AlertTriangle} color="red">
                  You have disabled both online payment and COD. Customers will not be able to
                  complete a purchase. Please enable at least one payment method.
                </InfoBanner>
              </div>
            )}
          </SectionCard>
        </ScrollReveal>

        {/* ── Bottom Save ───────────────────────────────────────────── */}
        <ScrollReveal delay={300}>
          <div className="flex justify-end pt-2 pb-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#a65d14] disabled:opacity-70 text-white px-7 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Save size={18} />
              {isSaving ? 'Saving…' : 'Save Payment Settings'}
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
