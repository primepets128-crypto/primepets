import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [slides, setSlides] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
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

  // Request Notification Permission
  useEffect(() => {
    const requestPermission = async () => {
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
        console.error("Failed to get push token:", error);
      }
    };
    
    // Slight delay so it doesn't block immediate rendering
    setTimeout(requestPermission, 2000);
  }, [visitorId]);

  const logActivity = (action, details = '') => {
    const type = action === 'Page View' ? 'pageview' : 'interaction';
    
    axios.post('/api/analytics/track', {
      type,
      visitorId,
      page: type === 'pageview' ? details.replace('Visited ', '') : '',
      action,
      details,
      fcmToken
    }).catch(err => console.error("Failed to track:", err));
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
    }
  }, [frontendSettings]);

  return (
    <DataContext.Provider value={{
      slides, setSlides,
      banners, setBanners,
      categories, setCategories,
      deals, setDeals,
      products, setProducts,
      frontendSettings, setFrontendSettings,
      activityLog, logActivity,
      loading,
      refreshData
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
