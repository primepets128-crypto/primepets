import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

export default function AdminSlides() {
  const { slides, banners, refreshData } = useData();
  const { showToast } = useCart();
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('slides');

  const defaultSlide = {
    gradient: 'from-[#b96c1a] via-[#FF8C00] to-[#FFA500]',
    tag: '', badge: '', title: '', subtitle: '', cta: 'SHOP NOW',
    dog: '', cat: '', heroImage: ''
  };

  const defaultBanner = {
    gradient: 'from-[#0F9B8E] to-[#007CF0]',
    title: '', subtitle: '', emoji: '🚀', cta: '/category'
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide.id) {
        await axios.put(`/api/slides/${editingSlide.id}`, editingSlide);
        showToast('Slide updated successfully!');
      } else {
        await axios.post('/api/slides', editingSlide);
        showToast('New slide added!');
      }
      await refreshData();
      setIsSlideModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving slide.');
    }
  };

  const handleDeleteSlide = async (id) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await axios.delete(`/api/slides/${id}`);
        showToast('Slide deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting slide.');
      }
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner.id) {
        await axios.put(`/api/banners/${editingBanner.id}`, editingBanner);
        showToast('Banner updated successfully!');
      } else {
        await axios.post('/api/banners', editingBanner);
        showToast('New banner added!');
      }
      await refreshData();
      setIsBannerModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving banner.');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await axios.delete(`/api/banners/${id}`);
        showToast('Banner deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting banner.');
      }
    }
  };

  const filteredSlides = slides.filter(s => 
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBanners = banners.filter(b => 
    (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hero Slides & Banners</h2>
          <p className="text-sm text-gray-500">Manage homepage visuals</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
            <button onClick={() => setActiveTab('slides')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'slides' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Slides</button>
            <button onClick={() => setActiveTab('banners')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'banners' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Banners</button>
          </div>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          {activeTab === 'slides' ? (
            <button onClick={() => { setEditingSlide(defaultSlide); setIsSlideModalOpen(true); }} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap">
              <Plus size={18} /> Add Slide
            </button>
          ) : (
            <button onClick={() => { setEditingBanner(defaultBanner); setIsBannerModalOpen(true); }} className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap">
              <Plus size={18} /> Add Banner
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'slides' ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Title & Subtitle</th>
              <th className="p-4 font-semibold">Tags & Badges</th>
              <th className="p-4 font-semibold">Images</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSlides.map(s => (
              <tr key={s.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="p-4 pl-6">
                  <p className="font-bold text-gray-800">{s.title}</p>
                  <p className="text-sm text-gray-500 font-medium">{s.subtitle}</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1.5 items-start">
                    {s.badge && <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-bold border border-red-100">{s.badge}</span>}
                    {s.tag && <span className="bg-white text-gray-700 text-[10px] px-2 py-0.5 rounded-full border shadow-sm font-semibold">{s.tag}</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {s.dog ? (
                      <div className={`w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-gradient-to-r ${s.gradient}`}>
                        <img src={s.dog} alt="dog" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={16}/></div>
                    )}
                    {s.cat ? (
                      <div className={`w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-gradient-to-r ${s.gradient}`}>
                        <img src={s.cat} alt="cat" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={16}/></div>
                    )}
                  </div>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit Slide" onClick={() => { setEditingSlide(s); setIsSlideModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete Slide" onClick={() => handleDeleteSlide(s.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSlides.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <LayoutTemplate size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No slides found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Title & Subtitle</th>
              <th className="p-4 font-semibold">Gradient & Emoji</th>
              <th className="p-4 font-semibold">CTA Link</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBanners.map(b => (
              <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="p-4 pl-6">
                  <p className="font-bold text-gray-800">{b.title}</p>
                  <p className="text-sm text-gray-500 font-medium">{b.subtitle}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-r ${b.gradient}`}>
                      {b.emoji}
                    </div>
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{b.gradient}</code>
                  </div>
                </td>
                <td className="p-4">
                  <code className="text-xs text-gray-600 bg-gray-50 px-2 py-1 border rounded">{b.cta}</code>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit Banner" onClick={() => { setEditingBanner(b); setIsBannerModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete Banner" onClick={() => handleDeleteBanner(b.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBanners.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <LayoutTemplate size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No banners found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
      </div>

      {isSlideModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveSlide} className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editingSlide.id ? 'Edit Slide' : 'Add New Slide'}</h3>
              <button type="button" onClick={() => setIsSlideModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-8">
                
                {/* Visual Preview */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><ImageIcon size={16}/> Live Preview Layout</h4>
                  <div className={`w-full h-32 rounded-xl shadow-inner flex overflow-hidden relative ${!editingSlide.heroImage ? `bg-gradient-to-r ${editingSlide.gradient || 'from-gray-200 to-gray-300'}` : 'bg-gray-800'}`}>
                    {editingSlide.heroImage && <img src={editingSlide.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="hero bg" />}
                    <div className="absolute inset-0 bg-white/20 z-0"></div>
                    <div className="flex-1 p-4 z-10 flex flex-col justify-center">
                       {editingSlide.badge && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold w-fit mb-1">{editingSlide.badge}</span>}
                       <div className="font-bold text-white text-lg leading-tight mb-1">{editingSlide.title || 'Slide Title'}</div>
                       <div className="text-white/90 text-xs mb-2">{editingSlide.subtitle || 'Slide subtitle'}</div>
                       <button className="bg-gray-900 text-white text-[8px] px-3 py-1 rounded-full font-bold w-fit">{editingSlide.cta || 'SHOP NOW'}</button>
                    </div>
                    <div className="flex-1 relative z-10 flex items-end justify-end p-2 gap-2">
                       {editingSlide.dog && <img src={editingSlide.dog} className="h-full object-contain drop-shadow-xl" alt="preview dog" />}
                       {editingSlide.cat && <img src={editingSlide.cat} className="h-4/5 object-contain drop-shadow-xl" alt="preview cat" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text Content */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 border-b pb-2">📝 Text Content</h4>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                      <input required type="text" value={editingSlide.title || ''} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="e.g. Premium Food" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                      <input type="text" value={editingSlide.subtitle || ''} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="e.g. For your furry friend" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tag (Top)</label>
                        <input type="text" value={editingSlide.tag || ''} onChange={e => setEditingSlide({...editingSlide, tag: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="e.g. 🐾 Special" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Badge (Red)</label>
                        <input type="text" value={editingSlide.badge || ''} onChange={e => setEditingSlide({...editingSlide, badge: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="e.g. SALE IS BACK!" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">CTA Button Text <span className="text-red-500">*</span></label>
                      <input required type="text" value={editingSlide.cta || ''} onChange={e => setEditingSlide({...editingSlide, cta: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="e.g. SHOP NOW" />
                    </div>
                  </div>

                  {/* Visual Assets */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 border-b pb-2">🖼️ Media & Styling</h4>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Background Gradient <span className="text-red-500">*</span></label>
                      <input required type="text" value={editingSlide.gradient || ''} onChange={e => setEditingSlide({...editingSlide, gradient: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. from-[#b96c1a] to-[#FFA500]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Hero Background Image</label>
                      <div className="flex gap-2 items-center">
                         {editingSlide.heroImage && <img src={editingSlide.heroImage} className="w-10 h-10 rounded bg-gray-100 object-cover shrink-0 border" alt="thumb" />}
                         <div className="flex-1 flex flex-col">
                           <div className="flex gap-2">
                             <input type="url" value={editingSlide.heroImage || ''} onChange={e => setEditingSlide({...editingSlide, heroImage: e.target.value})} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="Paste URL here..." />
                             <span className="text-sm text-gray-500 flex items-center">OR</span>
                             <label className="cursor-pointer bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 flex items-center text-sm font-medium transition-colors text-gray-700">
                               Upload
                               <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                   if (e.target.files && e.target.files[0]) {
                                     try {
                                       const base64 = await handleImageUpload(e.target.files[0]);
                                       setEditingSlide({...editingSlide, heroImage: base64});
                                     } catch(err) {
                                       console.error("Upload failed", err);
                                       alert("Image upload failed");
                                     }
                                   }
                               }} />
                             </label>
                           </div>
                         </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Dog Image</label>
                      <div className="flex gap-2 items-center">
                         {editingSlide.dog && <img src={editingSlide.dog} className="w-10 h-10 rounded bg-gray-100 object-cover shrink-0 border" alt="thumb" />}
                         <div className="flex-1 flex flex-col">
                           <div className="flex gap-2">
                             <input type="url" value={editingSlide.dog || ''} onChange={e => setEditingSlide({...editingSlide, dog: e.target.value})} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="Paste URL here..." />
                             <span className="text-sm text-gray-500 flex items-center">OR</span>
                             <label className="cursor-pointer bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 flex items-center text-sm font-medium transition-colors text-gray-700">
                               Upload
                               <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                   if (e.target.files && e.target.files[0]) {
                                     try {
                                       const base64 = await handleImageUpload(e.target.files[0]);
                                       setEditingSlide({...editingSlide, dog: base64});
                                     } catch(err) {}
                                   }
                               }} />
                             </label>
                           </div>
                         </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Cat Image</label>
                      <div className="flex gap-2 items-center">
                         {editingSlide.cat && <img src={editingSlide.cat} className="w-10 h-10 rounded bg-gray-100 object-cover shrink-0 border" alt="thumb" />}
                         <div className="flex-1 flex flex-col">
                           <div className="flex gap-2">
                             <input type="url" value={editingSlide.cat || ''} onChange={e => setEditingSlide({...editingSlide, cat: e.target.value})} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="Paste URL here..." />
                             <span className="text-sm text-gray-500 flex items-center">OR</span>
                             <label className="cursor-pointer bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 flex items-center text-sm font-medium transition-colors text-gray-700">
                               Upload
                               <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                   if (e.target.files && e.target.files[0]) {
                                     try {
                                       const base64 = await handleImageUpload(e.target.files[0]);
                                       setEditingSlide({...editingSlide, cat: base64});
                                     } catch(err) {}
                                   }
                               }} />
                             </label>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsSlideModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                {editingSlide.id ? 'Save Changes' : 'Create Slide'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}

      {isBannerModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveBanner} className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editingBanner.id ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button type="button" onClick={() => setIsBannerModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input required type="text" value={editingBanner.title || ''} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="e.g. New Arrivals" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={editingBanner.subtitle || ''} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="e.g. Fresh stock every week" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Emoji <span className="text-red-500">*</span></label>
                    <input required type="text" value={editingBanner.emoji || ''} onChange={e => setEditingBanner({...editingBanner, emoji: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="e.g. 🆕" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Background Gradient <span className="text-red-500">*</span></label>
                    <input required type="text" value={editingBanner.gradient || ''} onChange={e => setEditingBanner({...editingBanner, gradient: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. from-[#d07e20] to-[#b36310]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">CTA Route <span className="text-red-500">*</span></label>
                  <input required type="text" value={editingBanner.cta || ''} onChange={e => setEditingBanner({...editingBanner, cta: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="e.g. /category" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                {editingBanner.id ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}
