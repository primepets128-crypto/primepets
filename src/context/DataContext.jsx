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

  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('prime-pets-activity-log');
    return saved ? JSON.parse(saved) : [];
  });

  const logActivity = (action, details = '') => {
    const newEntry = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLog(prev => {
      const updated = [newEntry, ...prev];
      return updated.slice(0, 100);
    });
  };

  useEffect(() => {
    localStorage.setItem('prime-pets-activity-log', JSON.stringify(activityLog));
  }, [activityLog]);

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
