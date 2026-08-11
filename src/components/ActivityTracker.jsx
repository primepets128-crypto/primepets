import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function ActivityTracker() {
  const location = useLocation();
  const { logActivity } = useData();

  useEffect(() => {
    let pageName = 'Home';
    
    if (location.pathname.startsWith('/admin')) {
      const path = location.pathname.split('/')[2];
      pageName = path ? `Admin ${path.charAt(0).toUpperCase() + path.slice(1)}` : 'Admin Dashboard';
    } else if (location.pathname === '/category') {
      pageName = 'Shop';
    } else if (location.pathname === '/offers') {
      pageName = 'Offers';
    } else if (location.pathname === '/cart') {
      pageName = 'Cart';
    } else if (location.pathname === '/account') {
      pageName = 'Account';
    } else if (location.pathname === '/hub') {
      pageName = 'Hub';
    }

    logActivity('Page View', `Visited ${pageName}`);
  }, [location.pathname]);

  return null;
}
