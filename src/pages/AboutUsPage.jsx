import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Heart, Target } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

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
              <Users size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">About Us</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We're on a mission to bring you the best for your furry friends. Welcome to {storeName}.
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

          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-black text-lg text-[#0a0502] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Target size={16} />
                </span>
                Our Mission
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                At {storeName}, we believe pets are family. Our mission is to provide premium, safe, and exciting products that enhance the quality of life for your pets. We carefully curate every item in our store, ensuring it meets our high standards for nutrition, durability, and fun.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-black text-lg text-[#0a0502] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Heart size={16} />
                </span>
                Our Story
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                Founded by a team of passionate pet parents, {storeName} started with a simple idea: why is it so hard to find truly high-quality pet supplies all in one place?
                
                We set out to build a platform that brings together top-tier brands, transparent ingredients, and sustainable materials. From our humble beginnings in a small local shop, we've grown to serve thousands of happy pets across India, but our core values remain the same: quality, care, and convenience.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="font-black text-lg text-[#0a0502] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Users size={16} />
                </span>
                Join the Family
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you're looking for specialized diets, tough toys for heavy chewers, or a cozy bed, our expert team is here to help you make the right choice. Welcome to the {storeName} family!
              </p>
            </div>
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
