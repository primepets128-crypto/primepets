import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Phone, User, Package, Loader2, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useData } from '../context/DataContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE    = 49;

function deliveryFee(subtotal) {
  return subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

function calculateGST(subtotal) {
  return Math.round(subtotal * 0.18);
}

function grandTotal(subtotal) {
  return subtotal + calculateGST(subtotal) + deliveryFee(subtotal);
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function buildWhatsAppMessage(orderId, customerInfo, cartItems, total, paymentMethod) {
  const itemLines = cartItems
    .map(i => `- ${i.name} x${i.qty} = ₹${i.price * i.qty}`)
    .join('\n');
  return encodeURIComponent(
    `New Order #${orderId}\nCustomer: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nAddress: ${customerInfo.address}\nItems:\n${itemLines}\nTotal: ₹${total}\nPayment: ${paymentMethod}`
  );
}

// ─── Step variants ───────────────────────────────────────────────────────────

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

// ─── Progress Bar ────────────────────────────────────────────────────────────

function StepProgress({ step }) {
  const steps = ['Details', 'Payment', 'Done'];
  return (
    <div className="flex items-center justify-center gap-0 px-5 py-3 bg-white border-b border-gray-100">
      {steps.map((label, i) => {
        const done    = i < step;
        const active  = i === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                done   ? 'bg-green-500 text-white' :
                active ? 'bg-[#d07e20] text-white shadow-[0_0_0_4px_rgba(208,126,32,0.15)]' :
                         'bg-gray-100 text-gray-400'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${active ? 'text-[#d07e20]' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 mb-3 rounded-full transition-all duration-500 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, type }) {
  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      exit={{ y: -30,    opacity: 0 }}
      className={`${bg} text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg mx-5 mt-3 text-center`}
    >
      {message}
    </motion.div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
        {Icon && <Icon size={11} className="text-[#d07e20]" />}
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1 font-medium">{error}</p>}
    </div>
  );
}

// ─── Mini Order Summary (collapsible) ────────────────────────────────────────

function MiniOrderSummary({ cartItems, cartTotal }) {
  const [open, setOpen] = useState(false);
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  const toFree = DELIVERY_THRESHOLD - cartTotal;

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50 overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Package size={14} className="text-[#d07e20]" />
          <span className="text-xs font-black text-gray-700 uppercase tracking-wide">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
          {toFree > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              <Truck size={10} /> Add ₹{toFree} for FREE delivery
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-900">₹{total}</span>
          {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {/* Expandable items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5 border-t border-orange-100">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-xs text-gray-600">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} <span className="text-gray-400">×{item.qty}</span></span>
                  <span className="font-semibold flex-shrink-0">₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="border-t border-orange-100 pt-1.5 space-y-0.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span><span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>GST (18%)</span><span>₹{calculateGST(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Delivery</span>
                  <span className={fee === 0 ? 'text-green-600 font-bold' : 'text-gray-500'}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-orange-100">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Full Order Summary (Step 2) ─────────────────────────────────────────────

function OrderSummary({ cartItems, cartTotal }) {
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-2.5">
      <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Order Summary</p>
      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
              {item.name} <span className="text-gray-400">×{item.qty}</span>
            </span>
            <span className="text-gray-800 font-semibold flex-shrink-0">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-orange-200 pt-2 space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span><span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>GST (18%)</span><span>₹{calculateGST(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Delivery</span>
          <span className={fee === 0 ? 'text-green-600 font-bold' : ''}>{fee === 0 ? 'FREE 🎉' : `₹${fee}`}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-orange-200">
          <span>Total</span><span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CheckoutModal({ isOpen, onClose, cartItems, cartTotal, onOrderSuccess }) {
  const { frontendSettings } = useData();

  const [step, setStep]     = useState(0);
  const [direction, setDir] = useState(1);

  const [form, setForm] = useState({ name: '', phone: '', address: '', pincode: '', city: '' });
  const [errors, setErrors] = useState({});

  const [payMethod, setPayMethod] = useState('COD');
  const [loading, setLoading]     = useState(false);
  const [orderStep, setOrderStep] = useState(null); // null | 'saving' | 'confirmed' | 'whatsapp'
  const [toast, setToast]         = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const goTo = useCallback((nextStep) => {
    setDir(nextStep > step ? 1 : -1);
    setStep(nextStep);
  }, [step]);

  const handleClose = useCallback(() => {
    setStep(0); setDir(1);
    setForm({ name: '', phone: '', address: '', pincode: '', city: '' });
    setErrors({}); setPayMethod('COD'); setLoading(false);
    setToast(null); setConfirmedOrder(null);
    onClose();
  }, [onClose]);

  function validateForm() {
    const e = {};
    if (!form.name.trim())                   e.name    = 'Name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone   = 'Enter a valid 10-digit mobile number.';
    if (!form.address.trim())                e.address = 'Please enter your delivery address.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validateForm()) goTo(1);
  }

  async function placeCOD() {
    setLoading(true);
    setOrderStep('saving');
    try {
      const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
      const res = await axios.post('/api/orders', {
        visitorId:       'anonymous',
        customerName:    form.name.trim(),
        customerPhone:   form.phone.trim(),
        customerAddress: fullAddress,
        items:           JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
        total:           grandTotal(cartTotal),
        paymentMethod:   'COD',
      });
      setOrderStep('confirmed');
      await new Promise(r => setTimeout(r, 700));
      const orderId = res.data?.orderId || res.data?.order?.id || res.data?.id || `ORD${Date.now()}`;
      setConfirmedOrder({ orderId, paymentMethod: 'COD' });
      setOrderStep('whatsapp');
      await new Promise(r => setTimeout(r, 500));
      goTo(2);
      onOrderSuccess && onOrderSuccess(orderId);
      const phone   = (frontendSettings?.whatsappOrderNumber || '919763405605').replace(/\D/g, '');
      const message = buildWhatsAppMessage(orderId, form, cartItems, grandTotal(cartTotal), 'COD');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
      setOrderStep(null);
    }
  }

  async function placeOnline() {
    setLoading(true);
    try {
      // Step 1 — create Razorpay order on backend
      const orderRes = await axios.post('/api/payment/create-order', { amount: grandTotal(cartTotal) * 100 });
      const rpOrder  = orderRes.data; // { id, amount, currency, key_id }

      // Use key from DB settings first, fall back to the one the server returns
      const keyId = frontendSettings?.razorpayKeyId || rpOrder.key_id;
      if (!keyId) {
        showToast('Razorpay is not configured. Please use COD or contact support.');
        setLoading(false);
        return;
      }

      // Step 2 — load checkout.js
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        showToast('Could not load Razorpay. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 3 — open Razorpay modal
      const options = {
        key:         keyId,
        amount:      rpOrder.amount,
        currency:    rpOrder.currency || 'INR',
        name:        frontendSettings?.storeName || 'Prime Pets',
        description: 'Pet Supplies Order',
        order_id:    rpOrder.id,
        prefill: { name: form.name.trim(), contact: form.phone.trim() },
        theme:  { color: '#d07e20' },
        // Step 4 — on payment success: verify signature, then save order
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
            const saveRes = await axios.post('/api/orders', {
              visitorId:         'anonymous',
              customerName:      form.name.trim(),
              customerPhone:     form.phone.trim(),
              customerAddress:   fullAddress,
              items:             JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
              total:             grandTotal(cartTotal),
              paymentMethod:     'ONLINE',
              razorpayOrderId:   rpOrder.id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            const orderId = saveRes.data?.id || saveRes.data?.orderId || saveRes.data?.order?.id || `ORD${Date.now()}`;
            setConfirmedOrder({ orderId, paymentMethod: 'Online' });
            goTo(2);
            onOrderSuccess && onOrderSuccess(orderId);
          } catch (verifyErr) {
            showToast('Payment done but order save failed. Please screenshot and contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            showToast('Payment cancelled. You can try again anytime.', 'error');
          },
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      showToast(err?.response?.data?.error || err?.response?.data?.message || 'Could not initiate payment. Please try again.');
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    payMethod === 'COD' ? await placeCOD() : await placeOnline();
  }

  function openWhatsApp() {
    if (!confirmedOrder) return;
    const phone   = (frontendSettings?.whatsappOrderNumber || '919763405605').replace(/\D/g, '');
    const message = buildWhatsAppMessage(confirmedOrder.orderId, form, cartItems, grandTotal(cartTotal), confirmedOrder.paymentMethod);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Sheet */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 60,    opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '93vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d07e20] to-[#a65d14] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-white/80" />
            <p className="text-white font-black text-base leading-tight">Checkout</p>
          </div>
          <button
            onClick={handleClose}
            className="bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Step Progress */}
        {step < 2 && <StepProgress step={step} />}

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
        </AnimatePresence>

        {/* Body */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait" custom={direction}>

            {/* ── Step 0: Details ── */}
            {step === 0 && (
              <motion.div
                key="step-info"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                {/* Mini order summary at top */}
                <MiniOrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <div className="space-y-3">
                  <Field label="Full Name *" icon={User} error={errors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition`}
                    />
                  </Field>

                  <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 flex-shrink-0">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit mobile number"
                        className={`flex-1 border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition`}
                      />
                    </div>
                  </Field>

                  <Field label="Delivery Address *" icon={MapPin} error={errors.address}>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="House / Flat No., Street, Area, Landmark"
                      className={`w-full border ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition resize-none`}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pincode">
                      <input
                        type="text"
                        maxLength={6}
                        value={form.pincode}
                        onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="400001"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </Field>
                    <Field label="City">
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </Field>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Payment ── */}
            {step === 1 && (
              <motion.div
                key="step-payment"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 space-y-4"
              >
                <button
                  onClick={() => goTo(0)}
                  className="flex items-center gap-1 text-xs text-[#d07e20] font-semibold hover:underline"
                >
                  <ArrowLeft size={13} /> Edit Details
                </button>

                {/* Delivery address recap */}
                <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5">
                  <MapPin size={14} className="text-[#d07e20] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Delivering to</p>
                    <p className="text-xs text-gray-700 font-semibold truncate">{form.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{[form.address, form.city, form.pincode].filter(Boolean).join(', ')}</p>
                  </div>
                </div>

                {/* Payment options */}
                <div className="space-y-2.5">
                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Choose Payment</p>

                  {[
                    { id: 'COD',    emoji: '💵', title: 'Cash on Delivery',  sub: 'Pay when your order arrives' },
                    { id: 'ONLINE', emoji: '💳', title: 'Online Payment',    sub: 'UPI, Cards, Net Banking, Wallets' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayMethod(opt.id)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                        payMethod === opt.id
                          ? 'border-[#d07e20] bg-orange-50 shadow-md'
                          : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <p className="font-black text-gray-800 text-sm">{opt.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{opt.sub}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          payMethod === opt.id ? 'border-[#d07e20] bg-[#d07e20]' : 'border-gray-300'
                        }`}>
                          {payMethod === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <div className="flex items-center gap-3">
                        {[
                          { key: 'saving',    icon: '📦', label: 'Saving order...' },
                          { key: 'confirmed', icon: '✅', label: 'Order confirmed!' },
                          { key: 'whatsapp',  icon: '💬', label: 'Opening WhatsApp...' },
                        ].map((s) => (
                          <div
                            key={s.key}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all duration-300 ${
                              orderStep === s.key
                                ? 'opacity-100 scale-105 text-white'
                                : orderStep === 'confirmed' && s.key === 'saving'
                                ? 'opacity-60 text-white/70'
                                : orderStep === 'whatsapp' && (s.key === 'saving' || s.key === 'confirmed')
                                ? 'opacity-60 text-white/70'
                                : 'opacity-30 text-white/40'
                            }`}
                          >
                            <span className="text-base">{s.icon}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <><Package size={16} /> Place Order — ₹{grandTotal(cartTotal)}</>
                  )}
                </button>

                <p className="text-center text-gray-400 text-[11px]">🔒 100% secure checkout</p>
              </motion.div>
            )}

            {/* ── Step 2: Confirmation ── */}
            {step === 2 && confirmedOrder && (
              <motion.div
                key="step-confirm"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 flex flex-col items-center text-center space-y-5"
              >
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 size={52} className="text-green-500" strokeWidth={1.8} />
                </motion.div>

                <div>
                  <p className="text-3xl font-black text-gray-900 leading-tight">Order Placed!</p>
                  <p className="text-green-600 font-bold text-sm mt-1">#{confirmedOrder.orderId}</p>
                </div>

                {/* Receipt card */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl w-full px-4 py-4 text-left space-y-2">
                  {[
                    { label: 'Customer', value: form.name },
                    { label: 'Phone',    value: `+91 ${form.phone}` },
                    { label: 'Address',  value: [form.address, form.city, form.pincode].filter(Boolean).join(', ') },
                    { label: 'Payment',  value: confirmedOrder.paymentMethod },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-xs text-gray-500 items-start gap-2">
                      <span className="font-bold text-gray-600 flex-shrink-0 w-16">{row.label}</span>
                      <span className="text-right flex-1">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-gray-900">
                    <span>Total Paid</span>
                    <span>₹{grandTotal(cartTotal)}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs">
                  Our team will contact you on WhatsApp shortly. 🐾
                </p>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-base">💬</span> Track on WhatsApp
                </button>

                <button
                  onClick={handleClose}
                  className="w-full text-gray-400 text-xs font-semibold py-1 hover:text-[#d07e20] transition-colors"
                >
                  Continue Shopping →
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
