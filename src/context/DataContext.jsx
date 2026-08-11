import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const [visitorId] = useState(() => {
    let vid = localStorage.getItem('prime-pets-vid');
    if (!vid) {
      vid = 'vid_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('prime-pets-vid', vid);
    }
    return vid;
  });

  // We no longer need to keep all activity in a local state for the frontend
  // Admin will fetch it via the /api/analytics/live endpoint.
  // But to not break the frontend that might use activityLog length, we can keep it empty or remove it.
  const [activityLog, setActivityLog] = useState([]);

  const logActivity = (action, details = '') => {
    // If it's a page view
    const type = action === 'Page View' ? 'pageview' : 'interaction';
    
    axios.post('/api/analytics/track', {
      type,
      visitorId,
      page: type === 'pageview' ? details.replace('Visited ', '') : '',
      action,
      details
    }).catch(err => console.error("Failed to track:", err));
  };

  const refreshData = async () => {
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
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
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
