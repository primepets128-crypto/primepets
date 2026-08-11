import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Phone, User, Package, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useData } from '../context/DataContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE    = 49;

function deliveryFee(subtotal) {
  return subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}

function grandTotal(subtotal) {
  return subtotal + deliveryFee(subtotal);
}

/** Dynamically load the Razorpay checkout script once. */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/** Build the WhatsApp order message. */
function buildWhatsAppMessage(orderId, customerInfo, cartItems, total, paymentMethod) {
  const itemLines = cartItems
    .map(i => `- ${i.name} x${i.qty} = ₹${i.price * i.qty}`)
    .join('\n');
  return encodeURIComponent(
    `New Order #${orderId}\nCustomer: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nAddress: ${customerInfo.address}\nItems:\n${itemLines}\nTotal: ₹${total}\nPayment: ${paymentMethod}`
  );
}

// ─── Step-transition variants ────────────────────────────────────────────────

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ModalHeader({ step, onClose }) {
  const titles = ['Your Details', 'Payment', 'Order Confirmed!'];
  return (
    <div className="bg-gradient-to-r from-[#d07e20] to-[#a65d14] px-5 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <p className="text-white font-black text-lg leading-tight">{titles[step]}</p>
        <p className="text-orange-100 text-xs">Step {step + 1} of 3</p>
      </div>
      <button
        onClick={onClose}
        className="bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-colors"
        aria-label="Close"
      >
        <X size={18} className="text-white" />
      </button>
    </div>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
        {Icon && <Icon size={12} className="text-[#d07e20]" />}
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

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

function OrderSummary({ cartItems, cartTotal }) {
  const fee   = deliveryFee(cartTotal);
  const total = grandTotal(cartTotal);
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-2.5">
      <p className="text-xs font-black text-gray-700 uppercase tracking-wide">Order Summary</p>
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
              {item.name} <span className="text-gray-400">x{item.qty}</span>
            </span>
            <span className="text-gray-800 font-semibold flex-shrink-0">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-orange-200 pt-2 space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal</span>
          <span>₹{cartTotal}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Delivery</span>
          <span className={fee === 0 ? 'text-green-600 font-semibold' : ''}>{fee === 0 ? 'FREE' : `₹${fee}`}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-orange-200">
          <span>Total</span>
          <span>₹{total}</span>
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
    setStep(0);
    setDir(1);
    setForm({ name: '', phone: '', address: '', pincode: '', city: '' });
    setErrors({});
    setPayMethod('COD');
    setLoading(false);
    setToast(null);
    setConfirmedOrder(null);
    onClose();
  }, [onClose]);

  function validateForm() {
    const e = {};
    if (!form.name.trim())                   e.name    = 'Name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone   = 'Enter a valid 10-digit phone number.';
    if (!form.address.trim())                e.address = 'Address is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validateForm()) goTo(1);
  }

  async function placeCOD() {
    setLoading(true);
    try {
      const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
      const res = await axios.post('/api/orders', {
        customerName:    form.name.trim(),
        customerPhone:   form.phone.trim(),
        customerAddress: fullAddress,
        items:           JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
        total:           grandTotal(cartTotal),
        paymentMethod:   'COD',
      });

      const orderId = res.data?.orderId || res.data?.order?.id || res.data?.id || `ORD${Date.now()}`;
      setConfirmedOrder({ orderId, paymentMethod: 'COD' });
      goTo(2);
      onOrderSuccess && onOrderSuccess(orderId);

      const phone   = (frontendSettings?.whatsappOrderNumber || '919763405605').replace(/\D/g, '');
      const message = buildWhatsAppMessage(orderId, form, cartItems, grandTotal(cartTotal), 'COD');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    } catch (err) {
      console.error('COD order failed:', err);
      showToast(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function placeOnline() {
    const keyId = frontendSettings?.razorpayKeyId;
    if (!keyId) {
      showToast('Razorpay not configured. Please use COD or contact admin.');
      return;
    }

    setLoading(true);
    try {
      const orderRes = await axios.post('/api/payment/create-order', {
        amount: grandTotal(cartTotal) * 100,
      });
      const rpOrder = orderRes.data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        showToast('Could not load Razorpay. Check your internet connection.');
        setLoading(false);
        return;
      }

      const options = {
        key:         keyId,
        amount:      rpOrder.amount,
        currency:    rpOrder.currency || 'INR',
        name:        frontendSettings?.storeName || 'Prime Pets',
        description: 'Pet Supplies Order',
        order_id:    rpOrder.id,
        prefill: {
          name:    form.name.trim(),
          contact: form.phone.trim(),
        },
        theme: { color: '#d07e20' },
        handler: async (response) => {
          try {
            await axios.post('/api/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });

            const fullAddress = [form.address.trim(), form.city, form.pincode].filter(Boolean).join(', ');
            const saveRes = await axios.post('/api/orders', {
              customerName:      form.name.trim(),
              customerPhone:     form.phone.trim(),
              customerAddress:   fullAddress,
              items:             JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
              total:             grandTotal(cartTotal),
              paymentMethod:     'ONLINE',
              razorpayPaymentId: response.razorpay_payment_id,
            });

            const orderId = saveRes.data?.orderId || saveRes.data?.order?.id || saveRes.data?.id || `ORD${Date.now()}`;
            setConfirmedOrder({ orderId, paymentMethod: 'Online' });
            goTo(2);
            onOrderSuccess && onOrderSuccess(orderId);
          } catch (verifyErr) {
            console.error('Payment verify/save failed:', verifyErr);
            showToast('Payment done but order save failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay order creation failed:', err);
      showToast(err?.response?.data?.message || 'Could not initiate payment. Please try again.');
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (payMethod === 'COD') {
      await placeCOD();
    } else {
      await placeOnline();
    }
  }

  function openWhatsApp() {
    if (!confirmedOrder) return;
    const phone   = (frontendSettings?.whatsappOrderNumber || '919763405605').replace(/\D/g, '');
    const message = buildWhatsAppMessage(
      confirmedOrder.orderId, form, cartItems, grandTotal(cartTotal), confirmedOrder.paymentMethod
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-3">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        <ModalHeader step={step} onClose={handleClose} />

        <AnimatePresence>
          {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait" custom={direction}>

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
                <p className="text-gray-500 text-xs">
                  We will deliver to this address. Fields marked * are required.
                </p>

                <Field label="Full Name *" icon={User} error={erro₹name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full border ${erro₹name ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition`}
                  />
                </Field>

                <Field label="Phone Number *" icon={Phone} error={erro₹phone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10-digit mobile number"
                    className={`w-full border ${erro₹phone ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition`}
                  />
                </Field>

                <Field label="Delivery Address *" icon={MapPin} error={erro₹address}>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="House / Flat No., Street, Area, Landmark"
                    className={`w-full border ${erro₹address ? 'border-red-400' : 'border-gray-200'} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition resize-none`}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Pincode">
                    <input
                      type="text"
                      maxLength={6}
                      value={form.pincode}
                      onChange={e => setForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }))}
                      placeholder="e.g. 400001"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </Field>
                  <Field label="City">
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </Field>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

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
                  className="flex items-center gap-1 text-xs text-[#d07e20] font-semibold hover:underline mb-1"
                >
                  <ArrowLeft size={13} /> Edit Details
                </button>

                <div className="space-y-3">
                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide">
                    Choose Payment Method
                  </p>

                  <button
                    onClick={() => setPayMethod('COD')}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      payMethod === 'COD'
                        ? 'border-[#d07e20] bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">&#x1F4B5;</span>
                      <div>
                        <p className="font-black text-gray-800 text-sm">Cash on Delivery</p>
                        <p className="text-gray-500 text-xs mt-0.5">Pay when your order arrives</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        payMethod === 'COD' ? 'border-[#d07e20] bg-[#d07e20]' : 'border-gray-300'
                      }`}>
                        {payMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPayMethod('ONLINE')}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      payMethod === 'ONLINE'
                        ? 'border-[#d07e20] bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">&#x1F4B3;</span>
                      <div>
                        <p className="font-black text-gray-800 text-sm">Online Payment</p>
                        <p className="text-gray-500 text-xs mt-0.5">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        payMethod === 'ONLINE' ? 'border-[#d07e20] bg-[#d07e20]' : 'border-gray-300'
                      }`}>
                        {payMethod === 'ONLINE' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                </div>

                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Package size={16} />
                      Place Order - ₹{grandTotal(cartTotal)}
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === 2 && confirmedOrder && (
              <motion.div
                key="step-confirm"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 flex flex-col items-center text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 size={44} className="text-green-500" strokeWidth={1.8} />
                </motion.div>

                <div>
                  <p className="text-2xl font-black text-gray-900 leading-tight">
                    Order #{confirmedOrder.orderId}
                  </p>
                  <p className="text-green-600 font-bold text-sm mt-1">Placed Successfully!</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl w-full px-4 py-3 text-left space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-600">Customer</span>
                    <span>{form.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-600">Phone</span>
                    <span>{form.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 items-start gap-2">
                    <span className="font-semibold text-gray-600 flex-shrink-0">Address</span>
                    <span className="text-right">
                      {[form.address, form.city, form.pincode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-600">Payment</span>
                    <span>{confirmedOrder.paymentMethod}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-black text-gray-900">
                    <span>Total</span>
                    <span>₹{grandTotal(cartTotal)}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs">
                  You will receive updates on WhatsApp. Our team will contact you shortly.
                </p>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-base">&#x1F4AC;</span> Track on WhatsApp
                </button>

                <button
                  onClick={handleClose}
                  className="w-full text-gray-500 text-xs font-semibold py-1 hover:text-[#d07e20] transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


