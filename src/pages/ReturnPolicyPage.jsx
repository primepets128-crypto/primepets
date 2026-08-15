import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock, Package, Truck } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-sm flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="font-black text-xl text-[#0a0502]">{value}</p>
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
    </div>
  );
}

export default function ReturnPolicyPage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

  const eligibleItems = [
    'Unopened pet food in original sealed packaging',
    'Unused accessories (collars, leashes, toys) in original packaging',
    'Grooming products that are sealed and unused',
    'Defective or damaged items received — eligible for immediate replacement',
    'Wrong item delivered — full return at no charge to you',
  ];

  const nonEligibleItems = [
    'Opened or partially used pet food, treats, or supplements',
    'Live animals or live plants',
    'Perishable goods and prescription items',
    'Items returned after the 7-day window has passed',
    'Products with removed or damaged labels/tags',
    'Digital products or gift cards',
  ];

  const steps = [
    {
      number: '01',
      title: 'Raise a Return Request',
      description: 'Go to My Account → Orders and select "Return" next to the item within 7 days of delivery.',
    },
    {
      number: '02',
      title: 'Pack Securely',
      description: 'Pack the item in its original packaging. Include your order number slip inside the parcel.',
    },
    {
      number: '03',
      title: 'Schedule Pickup',
      description: 'Our logistics partner will schedule a doorstep pickup within 2 business days at no extra charge.',
    },
    {
      number: '04',
      title: 'Refund Processed',
      description: 'Once we receive and inspect the item, your refund is initiated within 3-5 business days to the original payment method.',
    },
  ];

  return (
    <div className="min-h-screen mesh-bg text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <main className="relative z-0 pt-4 pb-20">
        {/* Hero banner */}
        <section className="relative overflow-hidden bg-[#0a0502] text-white py-16 px-6 mb-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d07e20]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5c3110]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-2xl mb-6 shadow-[0_0_30px_rgba(208,126,32,0.4)]">
              <RefreshCw size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">Return Policy</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Hassle-free returns within 7 days. Your pet's happiness — and yours — is our priority.
            </p>
            <p className="text-orange-200/40 text-xs mt-4">Last updated: August 2026</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5c3110] hover:text-[#d07e20] transition-colors mb-8 font-semibold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard icon={Clock}    label="Return Window"      value="7 Days"        color="#d07e20" />
            <StatCard icon={Truck}    label="Free Pickup"        value="Doorstep"      color="#5c3110" />
            <StatCard icon={Package}  label="Refund Timeline"    value="3–5 Days"      color="#1a9e60" />
          </div>

          {/* Eligible items */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm mb-6">
            <h2 className="font-black text-lg text-[#0a0502] mb-5 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Items Eligible for Return
            </h2>
            <ul className="space-y-3">
              {eligibleItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={12} className="text-green-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Non-eligible items */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm mb-6">
            <h2 className="font-black text-lg text-[#0a0502] mb-5 flex items-center gap-2">
              <XCircle size={20} className="text-red-400" />
              Items NOT Eligible for Return
            </h2>
            <ul className="space-y-3">
              {nonEligibleItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle size={12} className="text-red-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How to return — step-by-step */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm mb-6">
            <h2 className="font-black text-lg text-[#0a0502] mb-6">How to Initiate a Return</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-[0_0_15px_rgba(208,126,32,0.3)]">
                      {step.number}
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 h-full bg-orange-200/50 mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-bold text-[#0a0502] mb-1">{step.title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exchange & Refund details */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm mb-6">
            <h2 className="font-black text-lg text-[#0a0502] mb-4">Refunds & Exchanges</h2>
            <div className="text-gray-600 text-sm leading-relaxed space-y-3">
              <p>Refunds are credited to the original payment method:</p>
              <ul className="list-none space-y-2 ml-2">
                <li>• <strong>Credit/Debit Card:</strong> 3–5 business days after approval</li>
                <li>• <strong>UPI / Net Banking:</strong> 1–3 business days after approval</li>
                <li>• <strong>Cash on Delivery:</strong> Bank transfer within 5–7 business days (NEFT)</li>
                <li>• <strong>Store Credit:</strong> Instant — we may offer store credit as an alternative with a 10% bonus</li>
              </ul>
              <p className="mt-4">For product <strong>exchanges</strong>, raise a return request and place a new order. We do not process direct swaps due to inventory constraints.</p>
            </div>
          </div>

          {/* Damaged / wrong items */}
          <div className="bg-[#d07e20]/10 rounded-2xl p-6 md:p-8 border border-[#d07e20]/20 mb-6">
            <h2 className="font-black text-lg text-[#0a0502] mb-3">Received a Damaged or Wrong Item?</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If your order arrives damaged or you receive the wrong product, we sincerely apologise. Please take a photo of the item and packaging and contact us within <strong>48 hours</strong> of delivery at{' '}
              <a href="mailto:help@primepets.com" className="text-[#d07e20] font-semibold hover:underline">help@primepets.com</a>.
              We will arrange a free replacement or full refund immediately — no return required for damaged goods.
            </p>
          </div>

          {/* Need help */}
          <div className="bg-[#0a0502] rounded-2xl p-6 text-center border border-white/10">
            <p className="text-white font-bold mb-2">Need Help With a Return?</p>
            <p className="text-orange-200/60 text-xs mb-4">Our team is available Mon–Sat, 9 AM – 7 PM IST</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:help@primepets.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d07e20] to-[#9a5a15] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(208,126,32,0.5)] transition-all"
              >
                📧 Email Us
              </a>
              <button
                onClick={() => navigate('/account')}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-white/20 transition-all"
              >
                📦 View My Orders
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
