const express = require('express');
const router  = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');

// Initialise Razorpay instance once (avoids repeated construction per request)
function getRazorpayInstance() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured in server/.env');
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

// ── POST /api/payment/create-order ─────────────────────────────────────────
// Body: { amount }  — amount in PAISE (rupees × 100), minimum 100
// Returns: { id, amount, currency, key_id }
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    const paise = Math.round(Number(amount));
    if (!paise || paise < 100) {
      return res.status(400).json({ error: 'Amount must be at least ₹1 (100 paise)' });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount:   paise,
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    });

    // Return Razorpay's native field names so the frontend can use order.id directly.
    // Also return key_id so the frontend modal works even before admin saves it in Settings.
    res.json({
      id:       order.id,
      amount:   order.amount,
      currency: order.currency,
      key_id:   process.env.RAZORPAY_KEY_ID,   // safe — this is the public key only
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);
    if (error.message.includes('not configured')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create payment order', details: error.description || error.message });
  }
});

// ── POST /api/payment/verify ───────────────────────────────────────────────
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Returns 200 { success: true } on match, 400 on mismatch, 400 on missing fields
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment fields' });
    }

    const { RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay key secret not configured' });
    }

    // HMAC-SHA256(order_id | payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('Razorpay signature mismatch — possible tampered response');
      return res.status(400).json({ success: false, error: 'Payment signature verification failed' });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ error: 'Payment verification error' });
  }
});

module.exports = router;
