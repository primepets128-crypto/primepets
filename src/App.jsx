import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import PageTransition from './components/PageTransition';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import BottomNav from './components/BottomNav';
import PageLoader from './components/PageLoader';
import ErrorBoundary from './components/ErrorBoundary';
import ChatBot from './components/ChatBot';
import TopBar from './components/TopBar';
import ActivityTracker from './components/ActivityTracker';
import { useData } from './context/DataContext';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const HubPage = lazy(() => import('./pages/HubPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Lazy load Admin pages
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminSlides = lazy(() => import('./pages/admin/AdminSlides'));
const AdminDeals = lazy(() => import('./pages/admin/AdminDeals'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayment = lazy(() => import('./pages/admin/AdminPayment'));
const AdminMusic = lazy(() => import('./pages/admin/AdminMusic'));
const AdminLive = lazy(() => import('./pages/admin/AdminLive'));
const AdminRetention = lazy(() => import('./pages/admin/AdminRetention'));

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

// Inner app that has access to DataContext
function AppInner() {
  const location = useLocation();
  const [initialSkip] = useState(() => sessionStorage.getItem('loaderFinished') === 'true');
  const [loaderFinished, setLoaderFinished] = useState(initialSkip);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const { frontendSettings, loading } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update audio source when settings change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newSrc = frontendSettings?.siteAudioUrl || '/background.mp3';
    if (audio.src !== newSrc && !audio.src.endsWith(newSrc)) {
      const wasPlaying = !audio.paused;
      audio.src = newSrc;
      if (wasPlaying) audio.play().catch(() => {});
    }
  }, [frontendSettings?.siteAudioUrl]);

  // Listen for audio changed event from AdminMusic
  useEffect(() => {
    const handler = (e) => {
      const audio = audioRef.current;
      if (!audio) return;
      const wasPlaying = !audio.paused;
      audio.src = e.detail.url || '/background.mp3';
      if (wasPlaying) audio.play().catch(() => {});
    };
    window.addEventListener('audioChanged', handler);
    return () => window.removeEventListener('audioChanged', handler);
  }, []);

  return (
    <div className="min-h-screen mesh-bg text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <PageLoader 
        skip={initialSkip}
        dataReady={!loading}
        onFinish={() => {
          sessionStorage.setItem('loaderFinished', 'true');
          setLoaderFinished(true);
        }} 
      />
      
      {loaderFinished && (
        <>
          <ActivityTracker />
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader skip={false} />}>
              <Routes location={location} key={location.pathname}>
                {/* Storefront Routes */}
                <Route path="/"         element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/category" element={<PageTransition><CategoryPage /></PageTransition>} />
                <Route path="/offers"   element={<PageTransition><OffersPage /></PageTransition>} />
                <Route path="/hub"      element={<PageTransition><HubPage /></PageTransition>} />
                <Route path="/account"  element={<PageTransition><AccountPage /></PageTransition>} />
                <Route path="/login"    element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/product/:id" element={<PageTransition><ProductPage /></PageTransition>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<PageTransition><ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute></PageTransition>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="live" element={<AdminLive />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="slides" element={<AdminSlides />} />
                  <Route path="deals" element={<AdminDeals />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="payment" element={<AdminPayment />} />
                  <Route path="music" element={<AdminMusic />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="retention" element={<AdminRetention />} />
                </Route>
              </Routes>
            </Suspense>
          </AnimatePresence>
          
          <TopBar />
          <CartDrawer />
          {/* Global floating bottom nav — only visible on mobile */}
          <BottomNav />
        </>
      )}
      
      <ChatBot />
      <Toast />

      {/* Background audio */}
      <audio
        ref={audioRef}
        id="site-bg-audio"
        src={frontendSettings?.siteAudioUrl || '/background.mp3'}
        loop
        preload="none"
        muted={isMuted}
      />
      
      <button
        onClick={() => setIsMuted(!isMuted)}
        title={isMuted ? 'Unmute Music' : 'Mute Music'}
        className="md:bottom-6 fixed bottom-[100px] left-4 z-[75] group bg-[#5c3110]/90 hover:bg-[#d07e20] text-orange-100 p-2.5 rounded-full backdrop-blur shadow-lg transition-all duration-200 border border-[#d07e20]/30 hover:scale-110 hover:shadow-[0_0_20px_rgba(208,126,32,0.5)]"
        aria-label="Toggle Mute"
      >
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isMuted ? 'Unmute' : 'Mute'}
        </span>
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <AppInner />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
