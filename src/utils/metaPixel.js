import axios from 'axios';

/**
 * Dynamically initializes the Meta Pixel script in the document header.
 * @param {string} pixelId - The Facebook Pixel ID.
 */
export function initMetaPixel(pixelId) {
  if (!pixelId || window.fbq) return;

  try {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', pixelId);
    // Track initial page view via standard pixel call
    window.fbq('track', 'PageView');
    console.log(`Initialized Meta Pixel: ${pixelId}`);
  } catch (error) {
    console.error('Failed to initialize Meta Pixel:', error);
  }
}

/**
 * Tracks a Facebook Pixel Event client-side and logs it server-side.
 * @param {string} eventName - Meta Standard or Custom event name (e.g. PageView, AddToCart, Purchase)
 * @param {Object} [eventData] - Custom metadata (e.g. value, currency, content_name)
 * @param {string} [userEmail] - Email address of the customer if logged in (hashed on backend)
 * @param {string} [eventId] - Unique event ID for deduplication
 */
export async function trackFacebookEvent(eventName, eventData = null, userEmail = null, eventId = null) {
  const finalEventId = eventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Client-Side Browser Event with Deduplication
  if (window.fbq) {
    try {
      window.fbq('track', eventName, eventData, { eventID: finalEventId });
    } catch (e) {
      console.error('Meta Pixel client track error:', e);
    }
  }

  // 2. Server-Side Logging (Analytics dashboard tracker)
  try {
    const visitorId = localStorage.getItem('prime-pets-vid') || 'anonymous';
    const url = window.location.href;

    await axios.post('/api/analytics/facebook-event', {
      eventName,
      eventData,
      userEmail,
      visitorId,
      url,
      eventId: finalEventId
    });
  } catch (err) {
    console.error('Failed to log Facebook event to server:', err.message);
  }
}
