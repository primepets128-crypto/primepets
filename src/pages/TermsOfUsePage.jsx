import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

export default function TermsOfUsePage() {
  const navigate = useNavigate();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const storeName = settings.storeName || 'Prime Pets';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing or using the ${storeName} website, mobile application, or any associated services, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, registered users, and anyone who accesses our platform.`
    },
    {
      title: 'Use of Our Platform',
      content: `You agree to use ${storeName} only for lawful purposes and in a manner that does not infringe the rights of others. You must not:

• Use our platform for any fraudulent or deceptive activity
• Attempt to gain unauthorised access to our systems or other users' accounts
• Transmit any harmful, offensive, or illegal content
• Reproduce, duplicate, or resell any part of our services without written permission
• Use automated bots or scrapers on our platform`
    },
    {
      title: 'Account Registration',
      content: `To access certain features, you may need to create an account. You are responsible for:

• Maintaining the confidentiality of your login credentials
• All activity that occurs under your account
• Notifying us immediately of any unauthorised use of your account

You must provide accurate and complete information when registering. We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: 'Orders & Payments',
      content: `When you place an order on ${storeName}:

• All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise
• Orders are subject to product availability and confirmation
• We reserve the right to cancel orders due to pricing errors, stock limitations, or suspected fraud
• Payment must be completed at the time of ordering via the methods made available on the platform
• By providing payment information, you confirm you are authorised to use the payment method`
    },
    {
      title: 'Intellectual Property',
      content: `All content on the ${storeName} platform — including logos, product images, text, graphics, and software — is the property of ${storeName} or its licensors and is protected under Indian and international copyright law.

You may not copy, reproduce, or distribute our content without prior written consent. Personal, non-commercial use to browse our catalogue is permitted.`
    },
    {
      title: 'Product Information',
      content: `We strive to keep product descriptions, images, and prices accurate. However, we do not warrant that product descriptions or other content are error-free, complete, or current.

We reserve the right to correct any errors, update information, and cancel orders placed based on incorrect pricing or descriptions.`
    },
    {
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by law, ${storeName} shall not be liable for:

• Indirect, incidental, or consequential damages arising from use of our services
• Loss of data, revenue, or profits
• Damage resulting from unauthorised access to your account
• Any interruption or suspension of our services

Our total liability to you for any claims shall not exceed the amount you paid for the specific order giving rise to the claim.`
    },
    {
      title: 'Governing Law',
      content: `These Terms of Use are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.

If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.`
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to update these Terms of Use at any time. Continued use of our platform after changes constitutes your acceptance of the revised terms. We recommend reviewing this page periodically.`
    },
    {
      title: 'Contact',
      content: `For questions about these Terms of Use:

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
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="font-black text-4xl md:text-5xl text-white mb-4">Terms of Use</h1>
            <p className="text-orange-200/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using {storeName}. They govern your access to and use of our platform.
            </p>
            <p className="text-orange-200/40 text-xs mt-4">Last updated: August 2026</p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
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
                  {section.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#0a0502] rounded-2xl p-6 text-center border border-white/10">
            <p className="text-orange-200/60 text-xs leading-relaxed">
              © 2026 {storeName}. All rights reserved. These terms are governed by the laws of India.
            </p>
          </div>
        </div>
      </main>

      <div className="h-20 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
