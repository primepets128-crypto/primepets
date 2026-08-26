import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { Save, Layout, MessageSquare, Globe, Database, Trash2, AlertTriangle, Phone, Mail, Music2, CreditCard, Loader2 } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import Toast from '../../components/Toast';
import { handleImageUpload } from '../../utils/imageUpload';
import { Link } from 'react-router-dom';

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function AdminSettings() {
  const { frontendSettings, refreshData } = useData();
  const [formData, setFormData] = useState(frontendSettings || {});
  const [activeTab, setActiveTab] = useState('general');
  const [isClearing, setIsClearing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (frontendSettings) {
      setFormData(frontendSettings);
    }
  }, [frontendSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const base64 = await handleImageUpload(file);
        setFormData(prev => ({ ...prev, logoBase64: base64 }));
      } catch (err) {
        console.error(err);
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Image upload failed' } }));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/settings', formData);
      await refreshData();
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Settings saved successfully!' } }));
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Error saving settings' } }));
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all local data? This will reset all products, categories, deals, slides, and settings to their defaults. This action cannot be undone.')) {
      setIsClearing(true);
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('prime-pets-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: Layout },
    { id: 'footer', label: 'Footer & Text', icon: MessageSquare },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'contact', label: 'Contact & WhatsApp', icon: Phone },
    { id: 'facebook', label: 'Meta Pixel & Events', icon: Facebook },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="max-w-4xl animate-fade-in">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Frontend Settings</h1>
            <p className="text-gray-500 font-medium">Manage how your store appears to customers.</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#E06900] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </ScrollReveal>

      {/* Quick links to new sections */}
      <ScrollReveal delay={50}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: '💳', label: 'Payment / Razorpay', path: '/admin/payment' },
            { icon: '🎵', label: 'Site Music', path: '/admin/music' },
            { icon: '🖼️', label: 'Category Images', path: '/admin/categories' },
          ].map(item => (
            <Link key={item.path} to={item.path}
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-700 font-semibold px-4 py-3 rounded-xl transition-colors text-sm">
              <span>{item.icon}</span> {item.label} →
            </Link>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-2 pt-2 overflow-x-auto scrollbar-hide shrink-0 pb-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 font-semibold text-sm transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? 'text-[#d07e20]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d07e20] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                  <input type="text" name="storeName" value={formData.storeName || ''} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                    placeholder="e.g. Prime Pets" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Store Tagline / Subtitle</label>
                  <input type="text" name="tagline" value={formData.tagline || ''} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                    placeholder="e.g. Universe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Store Logo (Custom Upload)</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner border border-gray-200">
                      {(formData.logoBase64 || frontendSettings?.logoBase64) ? (
                        <img src={formData.logoBase64 || frontendSettings.logoBase64} alt="Store Logo" className={`w-full h-full object-contain ${isUploading ? 'opacity-30' : ''}`} />
                      ) : (
                        <img src="/MA_logo.png" alt="Store Logo" className={`w-full h-full object-contain ${isUploading ? 'opacity-30' : ''}`} />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
                          <Loader2 className="animate-spin text-orange-500" size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploading}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#d07e20] hover:file:bg-orange-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">Recommended size: 200x200px. Max size: 200KB.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Letter (1 Character)</label>
                  <input type="text" name="logoChar" value={formData.logoChar || ''} onChange={handleChange}
                    maxLength={1}
                    className="w-20 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-black text-xl text-center"
                    placeholder="P" />
                  <p className="text-xs text-gray-400 mt-2">This letter appears in the glowing icon on the header and footer.</p>
                </div>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Description</label>
                  <textarea name="footerDescription" value={formData.footerDescription || ''} onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium resize-none"
                    placeholder="Welcome to the ultimate pet universe..." />
                  <p className="text-xs text-gray-400 mt-2">Shown above the social media icons in the footer.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scrolling Announcement Bar</label>
                  <textarea name="announcementText" value={formData.announcementText || ''} onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium resize-none"
                    placeholder="Up to 60% Off – Limited Time! | FREE DELIVERY on orders above ₹499 | Use code: PAWDAY30 | 100+ Stores across India 🐾" />
                  <p className="text-xs text-gray-400 mt-2">Separate different scrolling statements/banners with a vertical line character (<code>|</code>).</p>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-[#1877F2]">Facebook URL</label>
                    <input type="url" name="facebookUrl" value={formData.facebookUrl || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1877F2] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-[#E1306C]">Instagram URL</label>
                    <input type="url" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E1306C] focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                      placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-[#FF0000]">YouTube URL</label>
                    <input type="url" name="youtubeUrl" value={formData.youtubeUrl || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-100 transition-all font-medium"
                      placeholder="https://youtube.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-[#25D366]">WhatsApp Number (Social / Footer)</label>
                    <input type="text" name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-green-100 transition-all font-medium"
                      placeholder="+91..." />
                    <p className="text-xs text-gray-400 mt-1">Appears in footer social links.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex gap-3 items-start mb-4">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold text-green-800">Order WhatsApp Notifications</p>
                    <p className="text-green-700 text-sm">When a customer places an order, a WhatsApp message will be sent to the order notification number below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-[#25D366]">
                      📦 Order Notifications WhatsApp Number
                    </label>
                    <input type="text" name="whatsappOrderNumber" value={formData.whatsappOrderNumber || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-green-100 transition-all font-medium"
                      placeholder="+91 97634 05605" />
                    <p className="text-xs text-gray-400 mt-1">This number receives order notifications. Include country code e.g. +919763405605</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📞 Contact Phone Number
                    </label>
                    <input type="tel" name="contactPhone" value={formData.contactPhone || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                      placeholder="+91 99999 99999" />
                    <p className="text-xs text-gray-400 mt-1">Shown in footer contact section.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✉️ Contact Email Address
                    </label>
                    <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                      placeholder="support@primepets.in" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facebook' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start mb-4">
                  <div className="text-blue-600 mt-1"><Facebook size={20} /></div>
                  <div>
                    <p className="font-bold text-blue-850">Meta Pixel & Conversions API Tracking</p>
                    <p className="text-blue-700 text-sm">
                      Configure tracking of standard conversions (PageView, AddToCart, InitiateCheckout, and Purchase) 
                      to optimize your marketing campaigns. Both client-side browser script and backend server logs will use these values.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Pixel ID
                    </label>
                    <input type="text" name="facebookPixelId" value={formData.facebookPixelId || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                      placeholder="e.g. 123456789012345" />
                    <p className="text-xs text-gray-400 mt-1">Found in your Meta Events Manager setting tab.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook System User Access Token (Conversions API)
                    </label>
                    <input type="password" name="facebookAccessToken" value={formData.facebookAccessToken || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                      placeholder="e.g. EAAGzD..." />
                    <p className="text-xs text-gray-400 mt-1">Used to log server-side Conversions API events directly to Facebook. Leave empty to only track events locally.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Conversions API Gateway Routing URL (Optional / Stape)
                    </label>
                    <input type="text" name="facebookConversionsUrl" value={formData.facebookConversionsUrl || ''} onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                      placeholder="e.g. https://capi.yourdomain.com/v1/events" />
                    <p className="text-xs text-gray-400 mt-1">If using Stape Conversions API Gateway, enter your custom gateway routing URL. Leave blank to default to standard Meta Graph API.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-900 mb-2">Clear Local Storage Cache</h3>
                      <p className="text-red-700 text-sm mb-4">
                        This action will completely wipe all data stored in this browser for Prime Pets,
                        including any custom products, categories, deals, or slides you have created.
                        The application will be reset to its initial default state. Use this if you are
                        experiencing "old cache" issues or want a fresh start.
                      </p>
                      <button
                        onClick={handleClearCache}
                        disabled={isClearing}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-red-200"
                      >
                        {isClearing ? (
                          <>Clearing Data...</>
                        ) : (
                          <><Trash2 size={18} /> Clear Data & Reset Application</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Bottom Save Button (Improved UX) */}
          <div className="p-6 bg-gray-50 border-t border-gray-150 flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#E06900] text-white px-7 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
