import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Map, Home, Tag, Gift, BookOpen, User,
  ShieldCheck, FileText, RefreshCw, Package, Settings
} from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

function SitemapGroup({ title, emoji, links }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="font-black text-base text-[#0a0502] mb-4 flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        {title}
      </h2>
      <ul className="space-y-2">
        {links.map((link, i) => (
          <li key={i}>
            <button
              onClick={() => navigate(link.path)}
              className="group flex items-center gap-2 text-gray-600 text-sm hover:text-[#d07e20] transition-colors w-full text-left"
            >
              <link.icon size={14} className="text-[#d07e20]/60 group-hover:text-[#d07e20] transition-colors flex-shrink-0" />
              <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SitemapPage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

  const groups = [
    {
      title: 'Storefront',
      emoji: '🏠',
      links: [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Shop by Category', path: '/category', icon: Tag },
        { label: 'Offers & Deals', path: '/offers', icon: Gift },
      ],
    },
    {
      title: 'Account',
      emoji: '👤',
      links: [
        { label: 'My Account', path: '/account', icon: User },
        { label: 'Login / Sign Up', path: '/login', icon: User },
      ],
    },
    {
      title: 'Legal & Policies',
      emoji: '📋',
      links: [
        { label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
        { label: 'Terms of Use', path: '/terms-of-use', icon: FileText },
        { label: 'Return Policy', path: '/return-policy', icon: RefreshCw },
        { label: 'Sitemap', path: '/sitemap', icon: Map },
      ],
    },
    {
      title: 'Orders & Shopping',
      emoji: '📦',
      links: [
        { label: 'Track My Order', path: '/account', icon: Package },
        { label: 'Rewards Programme', path: '/account', icon: Gift },
      ],
    },
  ];

  return (
    <div className="min-h-screen mesh-bg text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <main className="relative z-0 pt-4 pb-20">
        {/* Hero banner */}
        <section className="relative overflow-hidden bg-[#0a0502] text-white py-16 px-6 mb-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d07e20]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5c3110]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-2xl mb-6 shadow-[0_0_30px_rgba(208,126,32,0.4)]">
              <Map size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">Sitemap</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              A complete directory of every page on {storeName}. Find exactly what you need.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5c3110] hover:text-[#d07e20] transition-colors mb-8 font-semibold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {groups.map((group, i) => (
              <SitemapGroup key={i} {...group} />
            ))}
          </div>

          {/* Admin note */}
          <div className="mt-6 bg-[#0a0502]/80 backdrop-blur rounded-2xl p-5 border border-white/10 flex items-center gap-4">
            <Settings size={20} className="text-[#d07e20] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">Admin Panel</p>
              <p className="text-orange-200/50 text-xs">For authorised staff only — requires admin login.</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="text-[#d07e20] text-xs font-bold hover:text-orange-300 transition-colors whitespace-nowrap"
            >
              Go to Admin →
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">© 2026 {storeName}. All rights reserved.</p>
          </div>
        </div>
      </main>

      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
