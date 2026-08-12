import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getMessaging, getToken } from 'firebase/messaging';
import { auth } from '../firebase'; // get auth and the initialized app

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
          const messaging = getMessaging();
          // We need to pass the VAPID key in a real prod app if configured, but for now we try without it if Firebase auto-provisions or if they set one.
          // In Vite, we'd inject it via env. Let's just try getToken.
          const token = await getToken(messaging, { 
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined 
          });
          if (token) {
            setFcmToken(token);
            // Optionally, resend a log activity just to update the token immediately
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
