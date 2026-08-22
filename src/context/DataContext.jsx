import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { initMetaPixel } from '../utils/metaPixel';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [slides, setSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [dealCategories, setDealCategories] = useState([]);
  const [frontendSettings, setFrontendSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fcmToken, setFcmToken] = useState(null);
  const hasRequestedPermission = useRef(false);

  const [visitorId] = useState(() => {
    let vid = localStorage.getItem('prime-pets-vid');
    if (!vid) {
      vid = 'vid_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('prime-pets-vid', vid);
    }
    return vid;
  });

  const [activityLog, setActivityLog] = useState([]);

  // Push notification permission — only called on explicit user gesture, never automatically
  const requestPushPermission = async () => {
    if (hasRequestedPermission.current) return;
    hasRequestedPermission.current = true;

    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Lazy-import Firebase messaging only when permission is granted
        const { getMessaging, getToken } = await import('firebase/messaging');
        const messaging = getMessaging();
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined
        });
        if (token) {
          setFcmToken(token);
          axios.post('/api/analytics/track', { type: 'interaction', visitorId, action: 'Push Enabled', fcmToken: token }).catch(console.error);
        }
      }
    } catch (error) {
      console.error('Failed to get push token:', error);
    }
  };

  const logActivity = (action, details = '', leadInfo = null) => {
    const type = action === 'Page View' ? 'pageview' : 'interaction';
    
    const payload = {
      type,
      visitorId,
      page: type === 'pageview' ? details.replace('Visited ', '') : '',
      action,
      details,
      fcmToken
    };

    if (leadInfo) {
      if (leadInfo.name) payload.name = leadInfo.name;
      if (leadInfo.phone) payload.phone = leadInfo.phone;
    }

    axios.post('/api/analytics/track', payload).catch(err => console.error("Failed to track:", err));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/data');
      setSlides(res.data.slides || []);
      setBanners(res.data.banners || []);
      setCategories(res.data.categories || []);
      setDeals(res.data.deals || []);
      setProducts(res.data.products || []);
      setCoupons(res.data.coupons || []);
      setDealCategories(res.data.dealCategories || []);
      setFrontendSettings(res.data.frontendSettings || null);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (frontendSettings) {
      document.title = `${frontendSettings.storeName || 'Prime Pets'} | ${frontendSettings.tagline || 'Universe'}`;
      if (frontendSettings.facebookPixelId) {
        initMetaPixel(frontendSettings.facebookPixelId);
      }
    }
  }, [frontendSettings]);

  return (
    <DataContext.Provider value={{
      slides, setSlides,
      banners, setBanners,
      categories, setCategories,
      deals, setDeals,
      products, setProducts,
      coupons, setCoupons,
      dealCategories, setDealCategories,
      frontendSettings, setFrontendSettings,
      activityLog, logActivity,
      loading,
      refreshData,
      requestPushPermission,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
