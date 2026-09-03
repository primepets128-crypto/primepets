import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

export default function StoreLocatorPage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

  const stores = [
    { city: 'Mumbai', address: '123 Marine Drive, South Mumbai, MH 400020', phone: '+91 98765 43210' },
    { city: 'Delhi', address: '45 Connaught Place, New Delhi, DL 110001', phone: '+91 98765 43211' },
    { city: 'Bangalore', address: '78 Indiranagar 100ft Road, KA 560038', phone: '+91 98765 43212' },
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
              <MapPin size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">Find a Store</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Visit {storeName} in person! Find the nearest store to pamper your pet.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#5c3110] hover:text-[#d07e20] transition-colors mb-8 font-semibold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="grid gap-6 md:grid-cols-2">
            {stores.map((store, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="font-black text-lg text-[#d07e20] mb-2 flex items-center gap-2">
                  <MapPin size={20} />
                  {store.city}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {store.address}
                </p>
                <p className="text-gray-800 font-bold text-sm">
                  📞 {store.phone}
                </p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 bg-[#0a0502] rounded-2xl p-6 text-center border border-white/10">
            <p className="text-orange-200/60 text-xs leading-relaxed">
              © 2026 {storeName}. All rights reserved.
            </p>
          </div>
        </div>
      </main>

      {/* Mobile spacer */}
      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
