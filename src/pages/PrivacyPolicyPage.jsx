import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us when you create an account, place an order, or contact us for support. This includes:
      
• Name, email address, phone number, and delivery address
• Payment information (processed securely via our payment partners — we never store raw card data)
• Order history and preferences
• Communications you send us (chat, email, support tickets)
• Device and usage data when you browse our website (IP address, browser type, pages visited)`
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

• Process and fulfil your orders, and send you related notifications
• Manage your ${storeName} Rewards account and points
• Send promotional emails and offers (you may opt out at any time)
• Improve our website, product catalogue, and customer experience
• Detect and prevent fraud or unauthorised access
• Comply with legal obligations`
    },
    {
      title: '3. Sharing Your Information',
      content: `We do not sell, trade, or rent your personal information to third parties. We may share data with:

• Delivery and logistics partners solely to fulfil your orders
• Payment gateways for secure transaction processing
• Analytics providers (e.g., Google Analytics) under strict data agreements
• Law enforcement or regulators when required by law

All third-party partners are contractually bound to keep your data confidential.`
    },
    {
      title: '4. Cookies & Tracking',
      content: `We use cookies and similar technologies to:

• Keep you signed in between sessions
• Remember your cart and preferences
• Measure website performance and traffic
• Serve relevant advertisements on partner platforms

You can control or disable cookies through your browser settings. Some features may not work properly without cookies.`
    },
    {
      title: '5. Data Security',
      content: `We implement industry-standard security measures including SSL/TLS encryption, secure cloud infrastructure, and access controls to protect your personal data. While no system is 100% secure, we continuously review and update our practices to safeguard your information.`
    },
    {
      title: '6. Your Rights',
      content: `Depending on your location, you may have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data ("right to be forgotten")
• Opt out of marketing communications at any time
• Lodge a complaint with a data protection authority

To exercise any of these rights, email us at help@primepets.com.`
    },
    {
      title: '7. Children\'s Privacy',
      content: `Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately so we can delete it.`
    },
    {
      title: '8. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email or an in-app notice. Your continued use of our website after such changes constitutes acceptance of the updated policy.`
    },
    {
      title: '9. Contact Us',
      content: `If you have any questions or concerns about this Privacy Policy, please reach out:

📧 help@primepets.com
📞 1800-123-Prime
📍 ${storeName}, India`
    }
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
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">Privacy Policy</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              We value your trust. Here's exactly how {storeName} collects, uses, and protects your personal information.
            </p>
            <p className="text-orange-200/40 text-xs mt-4">Last updated: August 2026</p>
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
            {sections.map((section, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="font-black text-lg text-[#0a0502] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-[#d07e20] to-[#8a4e10] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {section.title.replace(/^\d+\.\s/, '')}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 bg-[#0a0502] rounded-2xl p-6 text-center border border-white/10">
            <p className="text-orange-200/60 text-xs leading-relaxed">
              © 2026 {storeName}. All rights reserved. This policy is governed by the laws of India.
            </p>
          </div>
        </div>
      </main>

      {/* Mobile spacer */}
      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
